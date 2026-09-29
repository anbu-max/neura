"use server";

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  // Delete the document from the database
  try {
    await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("files")
      .doc(docId)
      .delete();
    await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("youtubeChats")
      .doc(docId)
      .delete();
  } catch (err) {
    console.warn("Error deleting file doc:", err);
  }

  // Also check guest_user collection
  if (userId && userId !== "guest_user") {
    try {
      await adminDb
        .collection("users")
        .doc("guest_user")
        .collection("files")
        .doc(docId)
        .delete();
    } catch (err) {
      // ignore
    }
  }

  // Delete from firebase storage if bucket configured
  try {
    if (process.env.FIREBASE_STORAGE_BUCKET) {
      await adminStorage
        .bucket(process.env.FIREBASE_STORAGE_BUCKET)
        .file(`users/${effectiveUserId}/files/${docId}`)
        .delete();
    }
  } catch (err) {
    // Ignore storage deletion errors
  }

  // Delete all embeddings associated with the document
  try {
    const index = await pineconeClient.index(indexName);
    await index.namespace(docId).deleteAll();
  } catch (err) {
    console.warn("Could not delete Pinecone namespace:", err);
  }

  // Revalidate the dashboard page to ensure the documents are up to date
  revalidatePath("/dashboard");
}
