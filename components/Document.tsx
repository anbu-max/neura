"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import {
  DownloadCloud,
  Trash2Icon,
  FileText,
  Youtube,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/actions/deleteDocument";

interface DocumentProps {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
  chatCount?: number;
  createdAt?: string | Date;
  type?: "pdf" | "youtube";
  lastMessage?: string;
}

function Document({
  id,
  name,
  size,
  downloadUrl,
  chatCount = 0,
  createdAt,
  type = "pdf",
  lastMessage,
}: DocumentProps) {
  const router = useRouter();
  const [isDeleting, startTransaction] = useTransition();
  const { hasActiveMembership } = useSubscription();

  const isYouTube = type === "youtube";
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Recently";

  const handleOpen = () => {
    router.push(`/dashboard/files/${id}`);
  };

  return (
    <div className="flex flex-col w-full sm:w-[320px] h-[330px] rounded-3xl bg-white border border-gray-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-purple-300 hover:shadow-xl justify-between p-6 transition-all duration-300 group">
      {/* Top Header */}
      <div className="cursor-pointer" onClick={handleOpen}>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform ${
              isYouTube
                ? "bg-gradient-to-tr from-red-600 to-rose-500"
                : "bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600"
            }`}
          >
            {isYouTube ? (
              <Youtube className="w-5 h-5 fill-white text-white" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isYouTube
                ? "bg-red-50 text-red-600 border-red-200/60"
                : "bg-purple-50 text-purple-700 border-purple-200/60"
            }`}
          >
            {isYouTube ? "YouTube Video" : "PDF Document"}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-headline font-bold text-gray-900 line-clamp-2 text-base group-hover:text-purple-600 transition-colors leading-snug"
          title={name}
        >
          {name}
        </h3>

        {/* Metadata */}
        <p className="text-xs text-gray-400 mt-1.5 font-medium">
          {!isYouTube && size > 0 ? `${byteSize(size).value} KB • ` : ""}
          {formattedDate}
        </p>

        {/* Chat Activity Pill */}
        <div className="mt-3">
          {chatCount > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>{chatCount} {chatCount === 1 ? "chat message" : "messages exchanged"}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50/70 text-purple-700 text-xs font-medium border border-purple-200/50">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Ready for questions</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={isDeleting}
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          onClick={() => {
            const prompt = window.confirm(
              `Are you sure you want to delete "${name}" from your history?`
            );

            if (prompt) {
              startTransaction(async () => {
                await deleteDocument(id);
              });
            }
          }}
          title="Delete from history"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {!isYouTube && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 w-8 p-0 rounded-xl border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200"
              title="Download file"
            >
              <a href={downloadUrl} download>
                <DownloadCloud className="h-4 w-4" />
              </a>
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleOpen}
            className="h-8 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs font-semibold shadow-xs hover:scale-102 active:scale-98 transition-all"
          >
            <span>Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Document;
