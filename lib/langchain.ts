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

  console.log("--- Fetching the download URL from Firebase... ---");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(effectiveUserId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Download URL not found");
  }

  console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

  // Fetch the PDF from the specified URL
  const response = await fetch(downloadUrl);

  // Load the PDF into a PDFDocument object
  const data = await response.blob();

  // Load the PDF document from the specified path
  console.log("--- Loading PDF document... ---");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  // Split the loaded document into smaller parts for easier processing
  console.log("--- Splitting the document into smaller parts... ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts ---`);

  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided.");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  let pineconeVectorStore;

  // Generate embeddings (numerical representations) for the split documents
  console.log("--- Generating embeddings... ---");
  const embeddings = new OpenAIEmbeddings();

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
    // If the namespace does not exist, download the PDF from firestore via the stored Download URL & generate the embeddings and store them in the Pinecone vector store
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... ---`
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
}

const generateLangchainCompletion = async (docId: string, question: string) => {
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

  // Define a prompt template for answering questions based on retrieved context
  console.log("--- Defining a prompt template for answering questions... ---");
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are Neura AI, an elite cognitive document intelligence engine and master memory architect.
You possess deep operational mastery of the 8 foundational scientific texts on accelerated learning, spatial memory, and neuroplasticity:
1. "A Mind for Numbers" (Dr. Barbara Oakley) — Focused vs. diffuse oscillation, chunking, overcoming the Einstellung effect, active recall.
2. "The Memory Book" (Harry Lorayne & Jerry Lucas) — The Associative Link method, the Substitute Word system for technical jargon, the Phonetic Major Number System (0-9 consonants), and peg words.
3. "Limitless" (Jim Kwik) — The FASTER learning protocol, visual active recall, overcoming mental barriers, and high-retention encoding.
4. "Make It Stick: The Science of Successful Learning" (Brown, Roediger, McDaniel) — Spaced retrieval practice, interleaving, generative learning, desirable difficulties, calibration, and reflection.
5. "Moonwalking with Einstein" (Joshua Foer) — Classical Roman architectural Memory Palaces, PAO (Person-Action-Object), vivid elaboration, and spatial navigational recall.
6. "The Art of Memory" (Frances A. Yates) — Ad Herennium classical loci techniques, Cicero and Quintilian oratory methods, and Giordano Bruno's symbolic memory wheels.
7. "Unlimited Memory" (Kevin Horsley) — S.E.E. Principle (Sensory, Exaggeration, Energized action), the 20-station Car Journey method, and the 10-point Body pegging system.
8. "Boost Your Brain" (Dr. Majid Fotuhi) — Neuroplasticity, hippocampal neurogenesis, BDNF activation, and cognitive reserve engineering.

CORE DIRECTIVES:
- Base all factual answers directly and thoroughly on the document context provided below:
{context}

- If the user uses a memory technique, slash command, or asks how to learn/remember/summarize/break down the document:
  1. Faithfully implement the requested cognitive framework.
  2. Ground it in the actual facts, figures, steps, or principles found in the document.
  3. Include 10 to 20+ rich, sensory, concrete examples, loci anchors, or mnemonic associations to make the concepts stick forever.
  4. Use clear headings, bullet points, numbered steps, and memory hooks.
- If the document context does not fully answer a question, use your cognitive expertise to provide the best structured learning path while clearly noting what is directly in the document.`,
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
