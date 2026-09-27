import fs from "fs";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

// Initialize the OpenAI model with API key and model name
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});

export const indexName = process.env.PINECONE_INDEX_NAME || "neura-ai";

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  console.log("--- Fetching chat history from the firestore database... ---");
  // Get the last 6 messages from the chat history
  const chats = await adminDb
    .collection(`users`)
    .doc(effectiveUserId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    // .limit(LIMIT)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(
    `--- fetched last ${chatHistory.length} messages successfully ---`
  );
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  console.log("--- Fetching document data from Firestore... ---");
  let firebaseRef = await adminDb
    .collection("users")
    .doc(effectiveUserId)
    .collection("files")
    .doc(docId)
    .get();

  if (!firebaseRef.exists) {
    const groupQuery = await adminDb
      .collectionGroup("files")
      .where("__name__", "==", docId)
      .limit(1)
      .get();
    if (!groupQuery.empty) {
      firebaseRef = groupQuery.docs[0];
    }
  }

  const fileData = firebaseRef.data();
  const downloadUrl = fileData?.downloadUrl;
  const localPath = fileData?.localPath;

  let dataBlob: Blob;

  // 1. If local file exists on disk, load instantly (under 2ms!)
  if (localPath && fs.existsSync(localPath)) {
    const buffer = fs.readFileSync(localPath);
    dataBlob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
  } else {
    // 2. Check public/uploads directory directly
    const defaultLocalPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      effectiveUserId,
      `${docId}.pdf`
    );
    if (fs.existsSync(defaultLocalPath)) {
      const buffer = fs.readFileSync(defaultLocalPath);
      dataBlob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
    } else if (downloadUrl) {
      // 3. Fallback: remote URL
      const fullUrl = downloadUrl.startsWith("http")
        ? downloadUrl
        : `http://localhost:${process.env.PORT || 3000}${downloadUrl}`;
      const response = await fetch(fullUrl);
      dataBlob = await response.blob();
    } else {
      throw new Error("Document content not found");
    }
  }

  console.log("--- Loading PDF document... ---");
  const loader = new PDFLoader(dataBlob);
  const docs = await loader.load();

  console.log("--- Splitting document with optimized chunk size... ---");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts ---`);

  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided.");
  try {
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
  } catch (err) {
    console.warn("Could not check namespace existence:", err);
    return false;
  }
}

// In-memory concurrency lock to prevent duplicate embedding runs for the same doc
const activeGenerations = new Map<string, Promise<any>>();

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  if (activeGenerations.has(docId)) {
    console.log(`--- Reusing in-flight embedding generation for ${docId}... ---`);
    return await activeGenerations.get(docId);
  }

  const promise = (async () => {
    let pineconeVectorStore;

    console.log("--- Initializing fast OpenAI text-embedding-3-small... ---");
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const index = await pineconeClient.index(indexName);
    const namespaceAlreadyExists = await namespaceExists(index, docId);

    if (namespaceAlreadyExists) {
      console.log(
        `--- Namespace ${docId} already exists, reusing existing embeddings... ---`
      );

      pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: docId,
      });

      return pineconeVectorStore;
    } else {
      const splitDocs = await generateDocs(docId);

      console.log(
        `--- Storing embeddings in namespace ${docId} in ${indexName} Pinecone index... ---`
      );

      pineconeVectorStore = await PineconeStore.fromDocuments(
        splitDocs,
        embeddings,
        {
          pineconeIndex: index,
          namespace: docId,
        }
      );

      return pineconeVectorStore;
    }
  })();

  activeGenerations.set(docId, promise);
  try {
    return await promise;
  } finally {
    activeGenerations.delete(docId);
  }
}

const generateLangchainCompletion = async (
  docId: string,
  question: string,
  isTechniqueMode: boolean = false
) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }

  // Create a retriever to search through the vector store
  console.log("--- Creating a retriever... ---");
  const retriever = pineconeVectorStore.asRetriever({ k: 8 });

  // Fetch the chat history from the database
  const chatHistory = await fetchMessagesFromDB(docId);

  // Define a prompt template for generating search queries based on conversation history
  console.log("--- Defining a prompt template... ---");
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // Insert the actual chat history here

    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  // Create a history-aware retriever chain that uses the model, retriever, and prompt
  console.log("--- Creating a history-aware retriever chain... ---");
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  const normalSystemPrompt = `You are Neura AI, an intelligent, highly accurate, and direct document intelligence assistant.

CORE DIRECTIVES & EDGE-CASE PROTOCOLS:

1. ABSOLUTE GROUNDING & OUT-OF-DOCUMENT HANDLING:
   - You answer strictly and exclusively based on the provided document context:
{context}
   - EDGE CASE: QUESTION NOT FOUND IN THE PDF:
     If the user asks a question, topic, or entity that is NOT present in the PDF:
     You MUST state clearly:
     "I cannot find any information relevant or related to that in this PDF."
     Optionally, mention 2-3 topics that ARE present in the document.
   - EDGE CASE: PARTIAL MATCH / INCOMPLETE INFORMATION:
     If the document mentions part of the topic but not the specific detail requested:
     State what the document does mention first in 1-2 concise bullet points, then explicitly add:
     "However, I cannot find any specific information related to that in this PDF."
   - EDGE CASE: GENERAL KNOWLEDGE QUESTIONS OUTSIDE THE PDF (e.g. weather, outside news, coding advice not in doc):
     Do NOT answer with generic external knowledge. State:
     "I cannot find any information relevant or related to that in this PDF. Please feel free to ask about anything covered in this document!"

2. VISUALLY DIGESTIBLE HUMAN FORMATTING:
   - Format answers using clean, organized bullet points or short numbered lists.
   - Limit every bullet point or paragraph to a MAXIMUM of 3 to 4 lines so it is immediately scannable.
   - Bold key terms, metrics, and takeaways.
   - Never output unbroken walls of text.

3. ZERO UNSOLICITED MNEMONICS OR FICTIONAL STORIES:
   - In Normal Mode, do NOT use memory techniques, dating metaphors, or fictional stories. Provide direct, objective, crisp answers.
   - Techniques are reserved EXCLUSIVELY for when the user explicitly triggers a slash command.

4. MULTILINGUAL FLUENCY:
   - If the document or query is in Chinese (Simplified or Traditional), Spanish, Japanese, French, or any other language, answer fluently in the requested language while upholding all rules.`;

  const techniqueSystemPrompt = `You are Neura AI, operating in Master Cognitive Framework Mode.
You embody the full, deep scientific mastery of the 8 foundational texts on accelerated learning, spatial memory, and neuroplasticity:
1. "A Mind for Numbers" (Dr. Barbara Oakley) — Focused vs. diffuse oscillation, chunking, breaking the Einstellung effect, active recall.
2. "The Memory Book" (Harry Lorayne & Jerry Lucas) — The Associative Link system, Substitute Word phonetics for complex jargon, Phonetic Major Number System (0-9 consonants: S/Z, T/D, N, M, R, L, J/Sh/Ch, K/G, F/V, P/B), pegging.
3. "Limitless" (Jim Kwik) — The FASTER accelerated learning protocol (Forget, Act, State, Teach, Enter, Review), visual active recall.
4. "Make It Stick" (Brown, Roediger, McDaniel) — Desirable difficulties, spaced retrieval practice, interleaving varied problem types, generative learning, reflection.
5. "Moonwalking with Einstein" (Joshua Foer) — Classical Roman architectural Memory Palaces (Method of Loci), Person-Action-Object (PAO) compression, bizarre & emotionally vivid imagery.
6. "The Art of Memory" (Frances A. Yates) — Ad Herennium architectural rules (distinct lighting, 30-ft spacing, ordered architectural paths), Cicero oratorical loci, Bruno's combinatorial memory wheels.
7. "Unlimited Memory" (Kevin Horsley) — S.E.E. Principle (Sensory, Exaggeration, Energized action), 20-station Car Journey, 10-point Body pegging list.
8. "Boost Your Brain" (Dr. Majid Fotuhi) — Neurogenesis, hippocampal growth, BDNF upregulation, cognitive reserve, memory consolidation during sleep.

CRITICAL TECHNIQUE EXECUTION RULES:
1. NEVER EXPLAIN THE TECHNIQUE OR WRITE META-LABELS:
   - Never say what the technique is, why you are using it, or write textbook headers (e.g. NEVER write "Step 1: S (Sensory Anchor)", "Visual Key", or "Here is the S.E.E. principle").
   - Simply and seamlessly APPLY the technique to the facts in the document.

2. REAL-WORLD HUMAN EXPERIENCES (ZERO SCI-FI / ROBOTIC TROPES):
   - Anchor the memory in relatable everyday human experiences (spilled coffee on white sneakers, party encounters, awkward elevator rides, everyday dilemmas).
   - Absolutely NO "blue orbs", "glowing circuits", or robotic characters.

3. EDGE CASE: TECHNIQUE REQUEST ON OUT-OF-DOCUMENT TOPIC:
   - If the user uses a command on a topic that is NOT in the document:
     State: "I cannot find any information relevant or related to that in this PDF to apply this technique to."
     List 2-3 key topics from the document that they can explore with this technique instead.

4. DIGESTIBLE & SHORT:
   - Keep paragraphs and points short (maximum 3 to 4 lines each).
   - End with a quick question to anchor the concept in the user's memory.

5. DOCUMENT GROUNDING:
   - Base all encoded facts directly on the provided document context:
{context}`;

  const selectedSystemPrompt = isTechniqueMode ? techniqueSystemPrompt : normalSystemPrompt;

  // Define a prompt template for answering questions based on retrieved context
  console.log("--- Defining a prompt template for answering questions... ---");
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      selectedSystemPrompt,
    ],

    ...chatHistory, // Insert the actual chat history here

    ["user", "{input}"],
  ]);

  // Create a chain to combine the retrieved documents into a coherent response
  console.log("--- Creating a document combining chain... ---");
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });

  // Create the main retrieval chain that combines the history-aware retriever and document combining chains
  console.log("--- Creating the main retrieval chain... ---");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("--- Running the chain with a sample conversation... ---");
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  // Print the result to the console
  console.log(reply.answer);
  return reply.answer;
};

// Export the model and the run function
export { model, generateLangchainCompletion };
