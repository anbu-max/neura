"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { detectAndInjectMemoryPrompt } from "@/lib/memoryCommands";
// import { generateLangchainCompletion } from "@/lib/langchain";

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

export async function askQuestion(id: string, question: string) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  const chatRef = adminDb
    .collection("users")
    .doc(effectiveUserId)
    .collection("files")
    .doc(id)
    .collection("chat");

  // check how many user messages are in the chat
  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  //   Check membership limits for messages in a document
  let hasActiveMembership = false;
  try {
    const userRef = await adminDb.collection("users").doc(effectiveUserId).get();
    hasActiveMembership = !!userRef.data()?.hasActiveMembership;
  } catch (err) {
    console.warn("Could not check membership", err);
  }

  // check if Stripe is active; if not set up, grant unlimited access for testing
  const isStripeConfigured = Boolean(
    process.env.STRIPE_API_KEY && !process.env.STRIPE_API_KEY.includes("dummy")
  );

  // check if user is on FREE plan and has asked more than the FREE number of questions
  if (isStripeConfigured && !hasActiveMembership) {
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You've reached the free limit of ${FREE_LIMIT} questions on this document. Upgrade to Pro for unlimited questions & memory tools! 🚀`,
      };
    }
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  // Cultural & IP/Geographic Detection
  let detectedRegion = "Global";
  try {
    const reqHeaders = await headers();
    const acceptLanguage = reqHeaders.get("accept-language") || "";
    const ipCountry = (
      reqHeaders.get("x-vercel-ip-country") ||
      reqHeaders.get("cf-ipcountry") ||
      ""
    ).toUpperCase();

    if (
      ipCountry === "IN" ||
      acceptLanguage.includes("en-IN") ||
      acceptLanguage.includes("hi") ||
      acceptLanguage.includes("ta") ||
      acceptLanguage.includes("te")
    ) {
      detectedRegion = "India";
    } else if (ipCountry === "US" || acceptLanguage.includes("en-US")) {
      detectedRegion = "United States";
    } else if (ipCountry === "GB" || acceptLanguage.includes("en-GB")) {
      detectedRegion = "United Kingdom";
    }
  } catch (err) {
    // ignore
  }

  // Retrieve user autobiographical memories or saved preferences if any
  let userMemories = "";
  try {
    const memSnap = await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("memories")
      .limit(5)
      .get();
    if (!memSnap.empty) {
      userMemories = memSnap.docs.map((d) => d.data().content).join("; ");
    }
  } catch (err) {
    // ignore
  }

  const userContext = {
    region: detectedRegion,
    memories: userMemories,
  };

  // Process Memory Slash Commands (e.g. /see, /palace, /flashcard, /quiz, etc.)
  const { processedQuestion, detectedCommand } = detectAndInjectMemoryPrompt(question);

  // Check if this is an answer to an active quiz question (e.g. user typed "A", "B", "C", "D")
  const isShortOptionChoice =
    /^(option\s*)?[a-d](\s*[\).:]|\b)/i.test(question.trim()) &&
    question.trim().length <= 30;

  let finalPrompt = processedQuestion;

  if (isShortOptionChoice) {
    const aiDocs = chatSnapshot.docs
      .filter((d) => d.data().role === "ai")
      .sort(
        (a, b) =>
          (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0)
      );
    const lastAiText = aiDocs[0]?.data()?.message || "";
    if (
      lastAiText.includes("Reply with your choice") ||
      lastAiText.includes("Question 1") ||
      lastAiText.includes("Question 2") ||
      lastAiText.includes("Question 3")
    ) {
      finalPrompt = `INTERACTIVE QUIZ ANSWER EVALUATION:
The user is answering "${question}" to the active quiz question in the conversation.
INSTRUCTIONS:
1. State clearly if the user is **Correct 🎉** or **Incorrect ❌**.
2. Give a direct, punchy 2-line explanation why the correct answer is right and why the chosen option was correct or mistaken.
3. If this was Question 1 or Question 2, immediately present the NEXT question (e.g. **Question 2 of 3** or **Question 3 of 3**) with 4 options (A, B, C, D) and end with: "👉 **Reply with your choice (A, B, C, or D)**!"
4. If this was Question 3, give their final score, a 1-line recap, and congratulatory wrap-up!`;
    }
  }

  // Storytelling technique mode is NOT used for quiz, executive summary, or flashcards
  const isExcludedFromStoryMode =
    detectedCommand?.id === "quiz" ||
    detectedCommand?.id === "summary" ||
    detectedCommand?.id === "flashcard" ||
    isShortOptionChoice;

  const hasTeachingIntent =
    /\b(teach me|help me learn|eli5|explain like i'?m (5|a child|a beginner)|train me)\b/i.test(
      question
    );
  const isTechniqueMode = Boolean(
    (!isExcludedFromStoryMode && detectedCommand) || hasTeachingIntent
  );

  // Generate AI Response: Normal questions/summaries act normally; teaching requests use technique mode
  const reply = await generateLangchainCompletion(
    id,
    finalPrompt,
    isTechniqueMode,
    userContext
  );

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return { success: true, message: null };
}
