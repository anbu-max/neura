"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { uploadFileServerFallback } from "@/actions/uploadFile";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading file...",
  SAVING = "Saving document...",
  READY = "Ready! Opening document...",
}

export type Status = StatusText | string;

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isCancelledRef = useRef<boolean>(false);
  const { user } = useUser();
  const router = useRouter();

  const cancelUpload = () => {
    isCancelledRef.current = true;
    setProgress(null);
    setStatus(null);
    setFileName(null);
    setFileSize(null);
    setError(null);
    setFileId(null);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    isCancelledRef.current = false;
    const effectiveUserId = user?.id || "guest_user";
    const fileIdToUploadTo = uuidv4();

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
    setError(null);
    setProgress(20);
    setStatus(StatusText.UPLOADING);

    // Dynamic responsive progress ticker so UI never looks stuck or fake
    const ticker = setInterval(() => {
      setProgress((prev) => {
        if (prev === null || prev >= 85) return prev;
        return prev + 15;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileId", fileIdToUploadTo);
      formData.append("userId", effectiveUserId);

      const res = await uploadFileServerFallback(formData);
      clearInterval(ticker);

      if (isCancelledRef.current) return;

      if (!res.success) {
        throw new Error(res.error || "Upload failed");
      }

      setProgress(100);
      setStatus(StatusText.READY);

      // Trigger embeddings in the background so user can immediately view & chat
      generateEmbeddings(fileIdToUploadTo).catch((embeddingErr) => {
        console.warn("Background embedding generation notice:", embeddingErr);
      });

      // Quick smooth transition to document
      setTimeout(() => {
        if (!isCancelledRef.current) {
          setFileId(fileIdToUploadTo);
        }
      }, 350);
    } catch (err: any) {
      clearInterval(ticker);
      if (isCancelledRef.current) return;
      console.error("Upload error:", err);
      setError(err?.message || "Failed to process document");
      setStatus(null);
      setProgress(null);
    }
  };

  const isUploading = progress !== null && progress >= 0;

  return {
    progress,
    status,
    fileId,
    fileName,
    fileSize,
    error,
    isUploading,
    handleUpload,
    cancelUpload,
  };
}

export default useUpload;
