"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useToast } from "./ui/use-toast";

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
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
      // Do something with the files

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
      } else {
        // do nothing...
        // toast...
      }
    },
    [handleUpload, isOverFileLimit, filesLoading, toast]
  );

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-16 w-16 text-purple-600 animate-pulse" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-16 w-16 text-emerald-500" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-16 w-16 text-purple-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-16 w-16 text-purple-600 animate-bounce" />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto p-6">
      {uploadInProgress && (
        <div className="mt-20 flex flex-col justify-center items-center gap-5 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
          <div
            className={`radial-progress bg-purple-100 text-purple-600 border-purple-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "10rem",
              "--thickness": "1rem",
            }}
          >
            {progress} %
          </div>

          {/* Render Status Icon */}
          {status && statusIcons[status as StatusText]}

          {status && (
            <p className="text-purple-700 font-semibold animate-pulse text-base">
              {String(status)}
            </p>
          )}
        </div>
      )}

      {!uploadInProgress && (
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
