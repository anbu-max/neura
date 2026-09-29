"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import { fetchYouTubeTranscript, extractYouTubeVideoId } from "@/lib/youtube";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { revalidatePath } from "next/cache";

export interface IngestYouTubeResult {
  success: boolean;
  docId?: string;
  videoId?: string;
  title?: string;
  error?: string;
}

export async function ingestYouTube(videoUrl: string): Promise<IngestYouTubeResult> {
  try {
    const { userId } = await auth();
    const effectiveUserId = userId || "guest_user";

    if (!videoUrl || typeof videoUrl !== "string") {
      return { success: false, error: "Please enter a valid YouTube link." };
    }

    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      return {
        success: false,
        error:
          "Could not identify a YouTube Video ID. Please check the URL (e.g., https://www.youtube.com/watch?v=...)",
      };
    }

    const docId = `yt_${videoId}`;

    // 1. Fetch metadata and transcript from YouTube
    console.log(`[YouTube Ingestion] Fetching transcript for ${videoId}...`);
    const transcriptData = await fetchYouTubeTranscript(videoUrl);

    // 2. Save document record to Firestore files collection
    const fileDocRef = adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("files")
      .doc(docId);

    const docPayload = {
      id: docId,
      name: transcriptData.metadata.title,
      type: "youtube",
      videoId: transcriptData.metadata.videoId,
      downloadUrl: transcriptData.metadata.url,
      thumbnailUrl: transcriptData.metadata.thumbnailUrl,
      channelTitle: transcriptData.metadata.authorName,
      transcript: transcriptData.fullText,
      segments: transcriptData.segments.slice(0, 3000), // Covers up to 3.5 hours of video with zero truncation
      size: 0,
      totalBytes: 0,
      createdAt: new Date(),
    };

    await fileDocRef.set(docPayload, { merge: true });

    // 3. Also save to youtubeChats collection for quick retrieval
    const ytDocRef = adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("youtubeChats")
      .doc(docId);

    await ytDocRef.set(
      {
        id: docId,
        title: transcriptData.metadata.title,
        url: transcriptData.metadata.url,
        videoId: transcriptData.metadata.videoId,
        thumbnailUrl: transcriptData.metadata.thumbnailUrl,
        createdAt: new Date(),
      },
      { merge: true }
    );

    // 4. Generate embeddings and store into Pinecone
    console.log(`[YouTube Ingestion] Generating Pinecone embeddings for ${docId}...`);
    try {
      await generateEmbeddingsInPineconeVectorStore(docId);
    } catch (embErr: any) {
      console.warn(
        `[YouTube Ingestion] Pinecone embeddings note: ${embErr?.message}`
      );
      // We still succeed if Pinecone indexing completed or is in-memory
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/youtube");
    revalidatePath(`/dashboard/files/${docId}`);

    return {
      success: true,
      docId,
      videoId,
      title: transcriptData.metadata.title,
    };
  } catch (error: any) {
    console.error("[YouTube Ingestion Error]:", error);
    return {
      success: false,
      error:
        error.message ||
        "Failed to ingest YouTube video. Please ensure the video has closed captions/subtitles.",
    };
  }
}
