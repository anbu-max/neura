"use server";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  try {
    // Allow both guest users and signed-in users
    await generateEmbeddingsInPineconeVectorStore(docId);
    revalidatePath("/dashboard");
    return { completed: true };
  } catch (err: any) {
    console.warn("Background embedding generation warning for docId:", docId, err?.message);
    return { completed: false, error: err?.message };
  }
}
