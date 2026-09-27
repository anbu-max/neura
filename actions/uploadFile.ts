"use server";

import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";

export async function uploadFileServerFallback(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const fileId = formData.get("fileId") as string;
    const { userId } = await auth();
    const effectiveUserId =
      userId || (formData.get("userId") as string) || "guest_user";

    if (!file || !fileId) {
      return { success: false, error: "File and fileId are required" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Immediately save file to server storage (public/uploads) for instant access
    const userUploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      effectiveUserId
    );
    if (!fs.existsSync(userUploadsDir)) {
      fs.mkdirSync(userUploadsDir, { recursive: true });
    }

    const localFilePath = path.join(userUploadsDir, `${fileId}.pdf`);
    fs.writeFileSync(localFilePath, new Uint8Array(buffer));

    const downloadUrl = `/api/files/${fileId}`;

    // 3. Save metadata to Firestore
    await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("files")
      .doc(fileId)
      .set({
        name: file.name,
        size: file.size,
        type: file.type || "application/pdf",
        downloadUrl,
        ref: `users/${effectiveUserId}/files/${fileId}`,
        localPath: localFilePath,
        createdAt: new Date(),
      });

    return { success: true, downloadUrl };
  } catch (error: any) {
    console.error("Upload failed:", error);
    return { success: false, error: error?.message || "Upload failed" };
  }
}
