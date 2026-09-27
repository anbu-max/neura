"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CircleArrowDown,
  RocketIcon,
  FileText,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import useUpload from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useToast } from "./ui/use-toast";

function FileUploader() {
  const {
    progress,
    status,
    fileId,
    fileName,
    fileSize,
    error,
    isUploading,
    handleUpload,
    cancelUpload,
  } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (!isOverFileLimit && !filesLoading) {
          await handleUpload(file);
        } else {
          toast({
            variant: "destructive",
            title: "Free Plan File Limit Reached",
            description:
              "You have reached the maximum number of files allowed for your account. Please upgrade to add more documents.",
          });
        }
      }
    },
    [handleUpload, isOverFileLimit, filesLoading, toast]
  );

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  return (
    <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto p-6">
      {error && (
        <div className="mt-8 w-full max-w-lg bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3 shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h4 className="font-headline font-bold text-red-800 text-sm">Upload Failed</h4>
          <p className="text-xs text-red-600 font-caslon">{error}</p>
          <button
            type="button"
            onClick={cancelUpload}
            className="px-5 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-headline font-bold transition-all shadow-2xs"
          >
            Try Again
          </button>
        </div>
      )}

      {isUploading && !error && (
        <div className="mt-8 w-full max-w-lg bg-white border border-[#E7E2D8] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center gap-4">
          {/* Header with File info & Cancel */}
          <div className="w-full flex items-center justify-between gap-3 bg-purple-50/50 border border-purple-100 rounded-2xl p-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-headline font-bold text-[#18181B] truncate max-w-[200px] sm:max-w-[280px]">
                  {fileName || "Document.pdf"}
                </p>
                <p className="text-xs text-[#78716C] font-mono">{fileSize || "PDF file"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={cancelUpload}
              className="flex items-center gap-1 text-xs font-headline font-bold text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs flex-shrink-0"
              title="Cancel upload"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>

          {/* Status Label & Percentage */}
          <div className="w-full flex items-center justify-between text-xs font-headline px-1">
            <span className="font-semibold text-purple-900 flex items-center gap-1.5 truncate">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600 flex-shrink-0" />
              <span className="truncate">{status || "Processing..."}</span>
            </span>
            <span className="font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg text-xs flex-shrink-0 ml-2">
              {progress || 0}%
            </span>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-purple-100 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 h-full rounded-full transition-all duration-300 shadow-xs"
              style={{
                width: `${Math.min(100, Math.max(5, progress || 0))}%`,
              }}
            />
          </div>

          {/* Stepper info */}
          <div className="w-full grid grid-cols-3 gap-2 pt-2 text-[11px] text-center font-headline font-semibold text-[#78716C]">
            <div className={`p-1.5 rounded-lg ${(progress || 0) >= 20 ? "bg-purple-50 text-purple-700 font-bold" : ""}`}>
              1. Cloud Storage
            </div>
            <div className={`p-1.5 rounded-lg ${(progress || 0) >= 65 ? "bg-purple-50 text-purple-700 font-bold" : ""}`}>
              2. Vector Split
            </div>
            <div className={`p-1.5 rounded-lg ${(progress || 0) >= 85 ? "bg-purple-50 text-purple-700 font-bold" : ""}`}>
              3. AI Memory
            </div>
          </div>
        </div>
      )}

      {!isUploading && !error && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed mt-6 w-full rounded-3xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isFocused || isDragAccept || isDragActive
              ? "border-purple-600 bg-purple-50 scale-[1.01]"
              : "border-purple-200 hover:border-purple-500 bg-white hover:bg-purple-50/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center text-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-16 w-16 text-purple-600 animate-bounce mb-4" />
                <p className="text-purple-700 font-bold text-lg">Drop your PDF right here!</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 border border-purple-100 group-hover:scale-105 transition-transform">
                  <CircleArrowDown className="h-8 w-8 text-purple-600" />
                </div>
                <p className="font-bold text-gray-800 text-lg mb-1">
                  Drag & drop your PDF file here
                </p>
                <p className="text-sm text-gray-400">
                  or <span className="text-purple-600 underline font-semibold">browse files</span> from your computer
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
