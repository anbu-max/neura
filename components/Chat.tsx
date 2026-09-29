"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Loader2Icon,
  Sparkles,
  Layers,
  HelpCircle,
  BookOpen,
  Binary,
  Castle,
  Clapperboard,
  Smile,
  Calendar,
  GitFork,
  FileCheck,
  ChevronRight,
  Command as CommandIcon,
  Eye,
  User as UserIcon,
  Car,
  Hash,
  Contact,
  Link2,
  SpellCheck,
  Target,
  HeartHandshake,
  Zap,
} from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { askQuestion } from "@/actions/askQuestion";
import ChatMessage from "./ChatMessage";
import { useToast } from "./ui/use-toast";
import { MEMORY_COMMANDS, getMatchingCommands, MemoryCommand } from "@/lib/memoryCommands";
import Link from "next/link";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

const iconMap: { [key: string]: React.ElementType } = {
  HeartHandshake,
  Eye,
  User: UserIcon,
  Car,
  Castle,
  Paperclip: BookOpen,
  Hash,
  Contact,
  Link2,
  SpellCheck,
  Target,
  Calendar,
  Binary,
  Layers,
  HelpCircle,
  Smile,
  GitFork,
  FileCheck,
  Sparkles,
  Zap,
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const { toast } = useToast();
  const effectiveUserId = user?.id || "guest_user";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  // Slash commands state
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<MemoryCommand[]>(MEMORY_COMMANDS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [snapshot, loading] = useCollection(
    query(
      collection(db, "users", effectiveUserId, "files", id, "chat"),
      orderBy("createdAt", "asc")
    )
  );

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!snapshot) return;

    const lastMessage = messages.pop();
    if (lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });

    setMessages(newMessages);
  }, [snapshot]);

  // Handle Input Changes & Slash Autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    if (val.startsWith("/")) {
      const matches = getMatchingCommands(val);
      setFilteredCommands(matches);
      setShowCommands(matches.length > 0);
      setSelectedIndex(0);
    } else {
      setShowCommands(false);
    }
  };

  const selectCommand = (cmd: MemoryCommand) => {
    setInput(`${cmd.slash} `);
    setShowCommands(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showCommands && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (filteredCommands[selectedIndex]) {
          e.preventDefault();
          selectCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setShowCommands(false);
      }
    }
  };

  const triggerAction = async (qText: string) => {
    const q = qText.trim();
    if (!q || isPending) return;

    setInput("");
    setShowCommands(false);

    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);

      if (!success) {
        toast({
          variant: "destructive",
          title: "Upgrade to Pro",
          description: message,
        });

        setMessages((prev) =>
          prev.filter((msg) => msg.message !== "Thinking...")
        );
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    triggerAction(input);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white relative">
      {/* Chat messages */}
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-3">
            <Loader2Icon className="animate-spin h-10 w-10 text-purple-600" />
            <span className="text-sm text-gray-500 font-medium">Loading memory stream...</span>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 && (
              <div className="bg-purple-50/50 border border-purple-100 rounded-3xl p-6 text-center max-w-lg mx-auto my-6 space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-6 h-6 fill-white" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {id.startsWith("yt_") ? "YouTube Video AI Assistant" : "Unlimited Memory AI Assistant"}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {id.startsWith("yt_")
                    ? "Ask questions about any timestamp, summarize, or type / to activate cognitive study frameworks."
                    : "Ask questions, summarize chapters, or type / to activate cognitive study frameworks."}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => selectCommand(MEMORY_COMMANDS.find((c) => c.id === "memory") || MEMORY_COMMANDS[0])}
                    className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full font-semibold transition-all shadow-2xs"
                  >
                    ❤️ /memory
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCommand(MEMORY_COMMANDS.find((c) => c.id === "see") || MEMORY_COMMANDS[1])}
                    className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full font-semibold transition-all shadow-2xs"
                  >
                    👁️ /see
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCommand(MEMORY_COMMANDS.find((c) => c.id === "body") || MEMORY_COMMANDS[2])}
                    className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full font-semibold transition-all shadow-2xs"
                  >
                    🧍 /body
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCommand(MEMORY_COMMANDS.find((c) => c.id === "palace") || MEMORY_COMMANDS[4])}
                    className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full font-semibold transition-all shadow-2xs"
                  >
                    🏰 /palace
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCommand(MEMORY_COMMANDS.find((c) => c.id === "flashcard") || MEMORY_COMMANDS[13])}
                    className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full font-semibold transition-all shadow-2xs"
                  >
                    🗂️ /flashcard
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCommand(MEMORY_COMMANDS.find((c) => c.id === "quiz") || MEMORY_COMMANDS[14])}
                    className="text-xs bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-full font-semibold transition-all shadow-2xs"
                  >
                    ❓ /quiz
                  </button>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}

            <div ref={bottomOfChatRef} />
          </div>
        )}
      </div>

      {/* Input Bar & Floating Slash Command Menu */}
      <div className="p-4 bg-white border-t border-gray-100 relative">
        {/* Floating Slash Autocomplete Popup */}
        {showCommands && filteredCommands.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-2 max-w-3xl mx-auto bg-white border border-gray-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
              <div className="flex items-center gap-1.5 text-purple-700">
                <CommandIcon className="w-3.5 h-3.5" />
                <span>Memory Techniques & Frameworks</span>
              </div>
              <Link
                href="/dashboard/docs"
                target="_blank"
                className="text-purple-600 hover:underline flex items-center gap-0.5 text-[11px]"
              >
                <span>View Full Docs</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 p-1">
              {filteredCommands.map((cmd, idx) => {
                const IconComponent = iconMap[cmd.iconName] || BookOpen;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => selectCommand(cmd)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-purple-600 text-white"
                        : "hover:bg-purple-50 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-sm ${
                              isSelected ? "text-white" : "text-purple-700"
                            }`}
                          >
                            {cmd.slash}
                          </span>
                          <span
                            className={`text-xs font-medium truncate ${
                              isSelected ? "text-purple-100" : "text-gray-900"
                            }`}
                          >
                            {cmd.name}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate ${
                            isSelected ? "text-purple-200" : "text-gray-500"
                          }`}
                        >
                          {cmd.shortDesc}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 border border-gray-200/60"
                      }`}
                    >
                      {cmd.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Document Action Pills */}
        <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Quick Actions:
          </span>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              triggerAction(
                id.startsWith("yt_")
                  ? "Summarize this YouTube video, highlighting the core thesis, speaker arguments, and key takeaways."
                  : "Summarize the entire PDF, highlighting the core thesis and main takeaways."
              )
            }
            className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-98 flex-shrink-0 disabled:opacity-50"
          >
            <span>📝</span>
            <span>{id.startsWith("yt_") ? "Video Summary" : "Summary"}</span>
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              triggerAction(
                id.startsWith("yt_")
                  ? "What are the top 5 key takeaways and actionable lessons from this video?"
                  : "What are the key takeaways and main concepts of this document?"
              )
            }
            className="px-3 py-1 rounded-full bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-200 transition-all text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-98 flex-shrink-0 disabled:opacity-50"
          >
            <span>💡</span>
            <span>Key Takeaways</span>
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setInput(
                id.startsWith("yt_")
                  ? "/see teach me the main lessons from this video using a vivid mental movie"
                  : "/see teach me this concept using a vivid mental movie"
              );
            }}
            className="px-3 py-1 rounded-full bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-800 border border-purple-200 hover:border-purple-300 transition-all text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-98 flex-shrink-0 disabled:opacity-50"
          >
            <span>👁️</span>
            <span>/see Teach Me</span>
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setInput(
                id.startsWith("yt_")
                  ? "Translate the summary of this video into "
                  : "Translate the summary of this document into "
              );
            }}
            className="px-3 py-1 rounded-full bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-200 transition-all text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-98 flex-shrink-0 disabled:opacity-50"
          >
            <span>🌐</span>
            <span>Translate</span>
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 max-w-3xl mx-auto bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-purple-500 focus-within:bg-white transition-all shadow-xs"
        >
          <Input
            placeholder={
              id.startsWith("yt_")
                ? "Ask anything about this video, or type / for commands..."
                : "Ask anything about this document, or type / for commands..."
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm placeholder-gray-400"
          />

          <Button
            type="submit"
            disabled={!input.trim() || isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5 h-9 font-semibold text-sm shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {isPending ? (
              <Loader2Icon className="animate-spin h-4 w-4 text-white" />
            ) : (
              <span>Send</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
export default Chat;
