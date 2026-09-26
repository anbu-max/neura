"use client";

import { useState } from "react";
import { Youtube, Sparkles, ArrowRight, Video, MessageSquare, BookOpen, Clock, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function YouTubeChatPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "chat" | "memory">("summary");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-semibold mb-4">
          <Youtube className="w-4 h-4 fill-red-500 text-red-500" />
          <span>YouTube Chat & Summary Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Chat with any <span className="text-red-500 relative inline-block">
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
        <p className="mt-3 text-gray-600 text-base">
          Paste any YouTube URL to summarize transcripts, ask deep questions, and retain concepts using{" "}
          <span className="font-semibold text-purple-700">Unlimited Memory</span> structuring.
        </p>
      </div>

      {/* URL Input Box */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 relative">
        <form onSubmit={handleStart} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Video className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-50 text-gray-800 placeholder-gray-400 transition-all"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl px-7 py-3.5 h-auto text-base shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Analyzing Video...</span>
            ) : (
              <>
                <span>Chat Video</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Suggestions / Doodles */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-400">Try these:</span>
          <button
            type="button"
            onClick={() => setVideoUrl("https://www.youtube.com/watch?v=example1")}
            className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200 transition-colors"
          >
            🎓 Stanford AI Lecture
          </button>
          <button
            type="button"
            onClick={() => setVideoUrl("https://www.youtube.com/watch?v=example2")}
            className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200 transition-colors"
          >
            🧠 Unlimited Memory Summary
          </button>
          <button
            type="button"
            onClick={() => setVideoUrl("https://www.youtube.com/watch?v=example3")}
            className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200 transition-colors"
          >
            ⚡ 10-Minute Tech Deep Dive
          </button>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Chat with People */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Interactive Chat</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Ask questions directly about timestamped moments, arguments, and speakers in the video.
          </p>
        </div>

        {/* Card 2: Instant Summaries */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Whole Video Summary</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Extract key takeaways, core thesis, and bulleted recaps in seconds without watching hours.
          </p>
        </div>

        {/* Card 3: Unlimited Memory Techniques */}
        <div className="bg-white p-6 rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/30 to-white shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-purple-950 text-lg mb-2">Unlimited Memory</h3>
          <p className="text-purple-800/80 text-sm leading-relaxed">
            Uses memory palace associations and cognitive retention frameworks so you remember what you study.
          </p>
        </div>
      </div>
    </div>
  );
}
