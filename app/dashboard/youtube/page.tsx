"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Youtube,
  Sparkles,
  ArrowRight,
  Video,
  MessageSquare,
  BookOpen,
  Brain,
  Loader2,
  ExternalLink,
  Play,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ingestYouTube } from "@/actions/ingestYouTube";
import { db } from "@/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

interface SavedYouTubeChat {
  id: string;
  title: string;
  url: string;
  videoId: string;
  thumbnailUrl?: string;
  createdAt?: any;
}

const SAMPLE_VIDEOS = [
  {
    title: "Andrej Karpathy: Intro to Large Language Models",
    url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
    tag: "AI & LLMs",
  },
  {
    title: "3Blue1Brown: But what is a neural network?",
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
    tag: "Neural Networks",
  },
  {
    title: "Steve Jobs: Stanford Commencement Speech",
    url: "https://www.youtube.com/watch?v=UF8uR6Z6KLc",
    tag: "Inspiration",
  },
];

export default function YouTubeChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const effectiveUserId = user?.id || "guest_user";

  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [savedChats, setSavedChats] = useState<SavedYouTubeChat[]>([]);

  // Listen to recent YouTube chats for this user
  useEffect(() => {
    const q = query(
      collection(db, "users", effectiveUserId, "youtubeChats"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const chats: SavedYouTubeChat[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<SavedYouTubeChat, "id">),
        }));
        setSavedChats(chats);
      },
      (err) => {
        console.warn("Could not query saved youtube chats:", err);
      }
    );

    return () => unsub();
  }, [effectiveUserId]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setIsLoading(true);
    setStatusStep("Extracting subtitles and closed captions...");

    try {
      const stepTimer1 = setTimeout(() => {
        setStatusStep("Splitting transcript & generating cognitive embeddings in Pinecone...");
      }, 1500);

      const res = await ingestYouTube(videoUrl.trim());
      clearTimeout(stepTimer1);

      if (!res.success || !res.docId) {
        toast({
          variant: "destructive",
          title: "Could not load video transcript",
          description:
            res.error ||
            "Please ensure the video has closed captions/subtitles enabled by the creator.",
        });
        setIsLoading(false);
        setStatusStep("");
        return;
      }

      setStatusStep("Opening AI Workspace...");
      toast({
        title: "Video Ready!",
        description: `Successfully indexed "${res.title || "video"}"`,
      });

      router.push(`/dashboard/files/${res.docId}`);
    } catch (err: any) {
      console.error("Ingestion failed:", err);
      toast({
        variant: "destructive",
        title: "Ingestion error",
        description:
          err?.message || "An unexpected error occurred while processing the video.",
      });
      setIsLoading(false);
      setStatusStep("");
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-semibold mb-4 shadow-xs">
          <Youtube className="w-4 h-4 fill-red-500 text-red-500" />
          <span>YouTube Chat & Cognitive Memory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Chat with any{" "}
          <span className="text-red-500 relative inline-block">
            YouTube Video
            <svg
              className="absolute w-full h-3 -bottom-1 left-0 text-red-300"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0,10 Q50,20 100,5"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        <p className="mt-3 text-gray-600 text-base leading-relaxed">
          Paste any YouTube URL (from 5-minute clips to 2-hour lectures). We&apos;ll extract the full transcript, index it in vector memory, and let you ask deep questions or learn using{" "}
          <span className="font-semibold text-purple-700">Cognitive Memory Frameworks</span>.
        </p>
      </div>

      {/* URL Input Box */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
        <form onSubmit={handleStart} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
              <Video className="w-5 h-5 text-stone-400" />
            </div>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-stone-900 border-2 border-stone-200 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50/70 placeholder-stone-400 font-medium transition-all disabled:opacity-60 shadow-2xs"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !videoUrl.trim()}
            className="bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold rounded-2xl px-8 py-3.5 h-auto text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Processing Video...</span>
              </div>
            ) : (
              <>
                <span>Chat Video</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Live Loading Progress Subtitle */}
        {isLoading && statusStep && (
          <div className="mt-4 p-3 rounded-xl bg-red-50/70 border border-red-100 flex items-center gap-2.5 text-xs text-red-700 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-red-600" />
            <span className="font-medium">{statusStep}</span>
          </div>
        )}

        {/* Quick Suggestions / Doodles */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-400">Try these videos:</span>
          {SAMPLE_VIDEOS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setVideoUrl(sample.url)}
              className="bg-gray-50 hover:bg-red-50 hover:text-red-700 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-200 transition-colors flex items-center gap-1.5"
            >
              <span>{sample.tag}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 truncate max-w-[140px] sm:max-w-none">
                {sample.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Previously Ingested Videos */}
      {savedChats.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              <span>Your YouTube Library</span>
            </h2>
            <span className="text-xs text-gray-500">
              {savedChats.length} {savedChats.length === 1 ? "video" : "videos"} indexed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => router.push(`/dashboard/files/${chat.id}`)}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:border-red-200 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  {chat.thumbnailUrl ? (
                    <img
                      src={chat.thumbnailUrl}
                      alt={chat.title}
                      className="w-16 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <Play className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {chat.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-red-600 font-medium">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Chat
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gray-400 group-hover:text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Chat with People */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Interactive Video Chat</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Ask questions about any timestamped moment, speaker argument, or formula mentioned in the video.
          </p>
        </div>

        {/* Card 2: Instant Summaries */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Instant Thesis & Recaps</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Extract key takeaways, core thesis, and bulleted recaps in seconds without watching hours.
          </p>
        </div>

        {/* Card 3: Cognitive Memory Techniques */}
        <div className="bg-white p-6 rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/30 to-white shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-purple-950 text-lg mb-2">Memory Palace & /see</h3>
          <p className="text-purple-800/80 text-sm leading-relaxed">
            Type <code className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded font-mono font-bold">/see</code> or <code className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded font-mono font-bold">/palace</code> to turn any complex lecture into an unforgettable mental story.
          </p>
        </div>
      </div>
    </div>
  );
}
