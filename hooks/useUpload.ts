"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { uploadFileServerFallback } from "@/actions/uploadFile";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading file to storage...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving document to database...",
  GENERATING = "Generating AI embeddings & memory index...",
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

  const uploadTaskRef = useRef<UploadTask | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  const { user } = useUser();
  const router = useRouter();

  const cancelUpload = () => {
    isCancelledRef.current = true;
    if (uploadTaskRef.current) {
      try {
        uploadTaskRef.current.cancel();
      } catch (e) {
        console.warn("Could not cancel upload task:", e);
      }
      uploadTaskRef.current = null;
    }
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
    setProgress(5);
    setStatus(StatusText.UPLOADING);

    const tryServerUpload = async () => {
      try {
        if (isCancelledRef.current) return;
        setStatus("Uploading directly via secure server...");
        setProgress(45);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileId", fileIdToUploadTo);
        formData.append("userId", effectiveUserId);

        const res = await uploadFileServerFallback(formData);
        if (isCancelledRef.current) return;

        if (!res.success) {
          throw new Error(res.error || "Upload failed");
        }

        setProgress(75);
        setStatus(StatusText.GENERATING);
        await generateEmbeddings(fileIdToUploadTo);

        if (isCancelledRef.current) return;
        setProgress(100);
        setStatus(StatusText.READY);
        setFileId(fileIdToUploadTo);
      } catch (serverErr: any) {
        if (isCancelledRef.current) return;
        console.error("Server upload error:", serverErr);
        setError(serverErr?.message || "Failed to process document");
        setStatus(null);
        setProgress(null);
      }
    };

    try {
      const storageRef = ref(
        storage,
        `users/${effectiveUserId}/files/${fileIdToUploadTo}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTaskRef.current = uploadTask;

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (isCancelledRef.current) return;
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 60
          );
          setStatus(`${StatusText.UPLOADING} (${Math.max(5, percent)}%)`);
          setProgress(Math.max(5, percent));
        },
        async (storageError) => {
          if (isCancelledRef.current) return;
          console.warn(
            "Client storage upload encountered restriction, switching to server pipeline...",
            storageError
          );
          // Seamless fallback using Admin SDK
          await tryServerUpload();
        },
        async () => {
          if (isCancelledRef.current) return;
          try {
            setStatus(StatusText.UPLOADED);
            setProgress(65);

            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

            if (isCancelledRef.current) return;
            setStatus(StatusText.SAVING);
            setProgress(75);

            await setDoc(doc(db, "users", effectiveUserId, "files", fileIdToUploadTo), {
              name: file.name,
              size: file.size,
              type: file.type,
              downloadUrl: downloadUrl,
              ref: uploadTask.snapshot.ref.fullPath,
              createdAt: new Date(),
            });

            if (isCancelledRef.current) return;
            setStatus(StatusText.GENERATING);
            setProgress(85);

            await generateEmbeddings(fileIdToUploadTo);

            if (isCancelledRef.current) return;
            setProgress(100);
            setStatus(StatusText.READY);
            setFileId(fileIdToUploadTo);
          } catch (postUploadErr: any) {
            if (isCancelledRef.current) return;
            console.warn("Client post-upload step failed, trying server fallback...", postUploadErr);
            await tryServerUpload();
          }
        }
      );
    } catch (clientErr: any) {
      if (isCancelledRef.current) return;
      console.warn("Could not initiate client upload, switching to server fallback...", clientErr);
      await tryServerUpload();
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
