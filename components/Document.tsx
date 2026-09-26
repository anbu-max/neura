"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/actions/deleteDocument";

function Document({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) {
  const router = useRouter();
  const [isDeleting, startTransaction] = useTransition();
  const { hasActiveMembership } = useSubscription();

  return (
    <div className="flex flex-col w-64 h-80 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-purple-300 hover:shadow-lg justify-between p-5 transition-all duration-300 group">
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          router.push(`/dashboard/files/${id}`);
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
          <DownloadCloud className="w-5 h-5 text-purple-600" />
        </div>
        <p className="font-bold text-gray-900 line-clamp-2 text-base group-hover:text-purple-600 transition-colors">
          {name}
        </p>
        <p className="text-xs text-gray-400 mt-2 font-medium">
          {byteSize(size).value} KB • PDF Document
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 justify-end pt-3 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          disabled={isDeleting}
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
          onClick={() => {
            const prompt = window.confirm(
              "Are you sure you want to delete this document?"
            );

            if (prompt) {
              startTransaction(async () => {
                await deleteDocument(id);
              });
            }
          }}
          title="Delete document"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 px-3 rounded-lg border-gray-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 gap-1.5 text-xs font-semibold"
        >
          <a href={downloadUrl} download>
            <DownloadCloud className="h-3.5 w-3.5" />
            <span>PDF</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
export default Document;
