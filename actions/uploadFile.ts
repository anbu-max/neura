"use server";

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

export async function uploadFileServerFallback(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const fileId = formData.get("fileId") as string;
    const { userId } = await auth();
    const effectiveUserId = userId || (formData.get("userId") as string) || "guest_user";

    if (!file || !fileId) {
      return { success: false, error: "File and fileId are required" };
    }

    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET || "neura-ai-793fb.firebasestorage.app";
    const bucket = adminStorage.bucket(bucketName);

    const filePath = `users/${effectiveUserId}/files/${fileId}`;
    const fileRef = bucket.file(filePath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to Firebase Storage using Admin SDK
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || "application/pdf",
      },
    });

    // Make public or get signed URL
    let downloadUrl: string;
    try {
      await fileRef.makePublic();
      downloadUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
    } catch {
      const [signedUrl] = await fileRef.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 year
      });
      downloadUrl = signedUrl;
    }

    // Save metadata to Firestore
    await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("files")
      .doc(fileId)
      .set({
        name: file.name,
        size: file.size,
        type: file.type,
        downloadUrl,
        ref: filePath,
        createdAt: new Date(),
      });

    return { success: true, downloadUrl };
  } catch (error: any) {
    console.error("Server upload fallback failed:", error);
    return { success: false, error: error?.message || "Server upload failed" };
  }
}
