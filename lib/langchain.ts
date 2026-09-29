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

  // If document is a YouTube video, split transcript directly
  if (fileData?.type === "youtube" || fileData?.transcript) {
    const transcriptText = fileData.transcript || "";
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 200,
    });
    return await splitter.createDocuments(
      [transcriptText],
      [{ docId, title: fileData.name || "YouTube Video", type: "youtube" }]
    );
  }

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
  isTechniqueMode: boolean = false,
  userContext?: { region?: string; memories?: string }
) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }

  // Detect summary/overview queries to fetch broad thematic chunks
  const isSummaryQuery =
    /\b(summar(y|ize|ise)|overview|synopsis|what('s| is) (this|the) (pdf|book|document) about|key takeaways|main points|tl;?dr|explain the (book|pdf|document)|topics covered)\b/i.test(
      question
    );

  // Create a retriever to search through the vector store (increase k for broad summaries)
  console.log(`--- Creating a retriever (k: ${isSummaryQuery ? 14 : 8})... ---`);
  const retriever = pineconeVectorStore.asRetriever({ k: isSummaryQuery ? 14 : 8 });

  // Fetch the chat history from the database
  const chatHistory = await fetchMessagesFromDB(docId);

  // Define a prompt template for generating search queries based on conversation history
  console.log("--- Defining a prompt template... ---");
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // Insert the actual chat history here

    ["user", "{input}"],
    [
      "user",
      isSummaryQuery
        ? "Generate a broad search query to locate the table of contents, introduction, main themes, executive summary, and key conclusions of this document."
        : "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  // Create a history-aware retriever chain that uses the model, retriever, and prompt
  console.log("--- Creating a history-aware retriever chain... ---");
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  const userRegion = userContext?.region || "India / Global";
  const userMemories = userContext?.memories || "None recorded yet";

  const normalSystemPrompt = `You are Neura AI, a smart, direct, and professional document intelligence assistant.

CORE DIRECTIVES:

1. ACT NORMALLY & DELIVER ACCURATE DOCUMENT INFORMATION:
   - Provide direct, objective, factual answers strictly from the provided PDF context:
{context}
   - In Normal Mode, do NOT tell fictional stories, use memory mnemonics, or inject pop culture analogies. Act normally, professionally, and clearly.
   - Answer the user's specific questions accurately and factually based on what is in the document.

2. CLEAR, SPACIOUS & SCANNABLE FORMATTING:
   - Present answers with clean, spaced bullet points and short, concise paragraphs (2 to 3 lines maximum).
   - Use double line breaks between paragraphs and points for effortless readability.
   - Use bold highlights on key terms and ideas. Never output unbroken walls of text.
   - Use clear, simple, and direct language so it is easy for any reader to understand.

3. COMPREHENSIVE DOCUMENT SUMMARIES & OVERVIEWS:
   - When the user asks to summarize the PDF, provide an overview, or asks what the document is about:
     * NEVER refuse, and NEVER say you cannot find information for a general summary.
     * Deliver an authoritative, structured summary directly reflecting the document:
       • **Overview**: Clear 2-line explanation of the document's central thesis and purpose.
       • **Key Themes & Core Points**: 3 to 5 structured bullet points covering the major topics, chapters, and findings.
       • **Summary Takeaway**: The main conclusion or practical impact of the work.

4. EDGE CASES & HONEST RESTRAINT:
   - If the user asks about an outside entity or topic completely absent from the document (like today's weather), state clearly:
     "I cannot find any information relevant to that in this PDF. Please feel free to ask about anything covered in this document!"
   - If a specific detail is missing from the document, clarify what the document does mention and what is not specified.`;

  const techniqueSystemPrompt = `You are Neura AI, operating in Master Cognitive Teaching Mode.
You make any concept from the document 100% intuitive and unforgettable using proven teaching and memory frameworks.

CORE TEACHING DIRECTIVES:

1. ULTRA-SIMPLE ENGLISH (EXPLAIN LIKE I'M 5):
   - Use simple, friendly, everyday words that a 5-year-old child or complete beginner understands effortlessly.
   - Avoid complex or heavy dictionary words. Explain the core idea with warmth and absolute clarity.

2. SPACIOUS FORMATTING & SCANNABLE BULLET POINTS:
   - NEVER output a dense, unbroken wall of text.
   - Break your explanation into clear, spaced bullet points and short 2-3 line paragraphs with double line breaks.
   - Once a thought reaches a full stop, give it room to breathe with a blank line.
   - Use bold highlights on key terms so the takeaway is immediately visible.

3. RELATABLE CULTURAL ANCHORS & FAMOUS MOVIE REFERENCES:
   - User Region / Origin: ${userRegion}
   - User Personal Memory Bank: ${userMemories}
   - Make the idea stick by connecting it to familiar everyday situations, movies, and habits:
     * For Indian users: Relate to everyday Indian life (e.g. local chai stalls or dhabas vs fancy cafes, scenes from 3 Idiots or Bollywood, cricket, street food, UPI).
     * For US / Western users: Relate to familiar pop culture (Marvel / Avengers, Apple Store, Starbucks, Netflix).
     * If the user mentions any favorite movie, hobby, or personal experience: Weave that exact reference in!

4. TECHNIQUE EXECUTION:
   - NEVER write textbook meta-headers like "Step 1: S (Sensory Anchor)" or "Visual Key".
   - Directly APPLY the visual teaching story to the concept in the document.
   - End with a quick, engaging question connecting the lesson to the user's daily life.

5. DOCUMENT GROUNDING:
   - Base all underlying principles directly on the document context:
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
