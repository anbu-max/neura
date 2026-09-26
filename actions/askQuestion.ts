"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
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

  //   check if user is on FREE plan and has asked more than the FREE number of questions
  if (!hasActiveMembership) {
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

  //   Process Memory Slash Commands (e.g. /firstprinciple, /palace, /flashcard, /quiz, /cinematic)
  const { processedQuestion } = detectAndInjectMemoryPrompt(question);

  //   Generate AI Response with Memory Framework
  const reply = await generateLangchainCompletion(id, processedQuestion);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return { success: true, message: null };
}
