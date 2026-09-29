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
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border border-purple-100 shadow-xs bg-purple-50 ring-2 ring-purple-100/50">
          {isHuman ? (
            <Image
              src={user?.hasImage && user?.imageUrl ? user.imageUrl : "/user-avatar.png"}
              alt="User Profile"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-inner">
              <BotIcon
                className="h-4.5 w-4.5 text-white stroke-[2.3]"
                style={{ shapeRendering: "geometricPrecision" }}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`chat-bubble text-sm leading-relaxed ${
          isHuman
            ? "bg-purple-600 text-white rounded-2xl rounded-tr-none shadow-xs font-medium px-4 py-3"
            : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none shadow-xs border border-gray-200/60 px-5 py-4"
        }`}
      >
        {message.message === "Thinking..." ? (
          <div className="flex items-center gap-2 py-1">
            <Loader2Icon className="animate-spin h-4 w-4 text-purple-600" />
            <span className="text-xs text-gray-500 font-medium">Analyzing document...</span>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-800 space-y-3 prose-p:my-2.5 prose-p:leading-relaxed prose-ul:my-2.5 prose-li:my-1.5 prose-strong:text-gray-950 prose-headings:my-3">
            <Markdown>{message.message}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
export default ChatMessage;
