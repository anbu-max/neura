"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { BotIcon, Loader2Icon } from "lucide-react";
import Markdown from "react-markdown";
import { Message } from "./Chat";

function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.role === "human";
  const { user } = useUser();

  return (
    <div className={`chat ${isHuman ? "chat-end" : "chat-start"} mb-4`}>
      <div className="chat-image avatar">
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border border-gray-100 shadow-2xs">
          {isHuman ? (
            user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile Picture"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                {user?.firstName?.[0] || "U"}
              </div>
            )
          ) : (
            <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white">
              <BotIcon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>

      <div
        className={`chat-bubble text-sm leading-relaxed ${
          isHuman
            ? "bg-purple-600 text-white rounded-2xl rounded-tr-none shadow-xs font-medium"
            : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none shadow-xs border border-gray-200/60"
        }`}
      >
        {message.message === "Thinking..." ? (
          <div className="flex items-center gap-2 py-1">
            <Loader2Icon className="animate-spin h-4 w-4 text-purple-600" />
            <span className="text-xs text-gray-500 font-medium">Analyzing document...</span>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
            <Markdown>{message.message}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
export default ChatMessage;
