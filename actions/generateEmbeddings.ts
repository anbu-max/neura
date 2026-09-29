"use server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  try {
    // Dynamic import prevents heavy LangChain/Pinecone/Tiktoken stack from being bundled into page routes
    const { generateEmbeddingsInPineconeVectorStore } = await import("@/lib/langchain");
    await generateEmbeddingsInPineconeVectorStore(docId);
    revalidatePath("/dashboard");
    return { completed: true };
  } catch (err: any) {
    console.warn("Background embedding generation warning for docId:", docId, err?.message);
    return { completed: false, error: err?.message };
  }
}
