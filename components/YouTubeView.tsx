"use client";

import { useEffect, useState, useRef } from "react";
import {
  Youtube,
  ExternalLink,
  Search,
  Clock,
  Sparkles,
  FileText,
  Play,
  Copy,
  Check,
  Film,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

interface YouTubeViewProps {
  id: string;
  url: string;
}

interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

interface VideoDocData {
  name?: string;
  videoId?: string;
  channelTitle?: string;
  transcript?: string;
  segments?: TranscriptSegment[];
  downloadUrl?: string;
}

function formatSeconds(seconds: number): string {
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function YouTubeView({ id, url }: YouTubeViewProps) {
  const { user } = useUser();
  const effectiveUserId = user?.id || "guest_user";

  const videoId =
    (id.startsWith("yt_") ? id.replace("yt_", "") : null) ||
    url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1] ||
    "";

  const [docData, setDocData] = useState<VideoDocData | null>(null);
  const [activeTab, setActiveTab] = useState<"player" | "transcript">("player");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Subscribe to document data in Firestore
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(
      doc(db, "users", effectiveUserId, "files", id),
      (snap) => {
        if (snap.exists()) {
          setDocData(snap.data() as VideoDocData);
        }
      },
      (err) => {
        console.warn("Could not fetch YouTube file doc in client:", err);
      }
    );
    return () => unsub();
  }, [id, effectiveUserId]);

  const title = docData?.name || `YouTube Video (${videoId})`;
  const channel = docData?.channelTitle || "YouTube Creator";
  const segments = docData?.segments || [];

  const filteredSegments = searchQuery.trim()
    ? segments.filter((s) =>
        s.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : segments;

  const seekTo = (seconds: number) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "seekTo",
        args: [seconds, true],
      }),
      "*"
    );
    // Switch to player tab on mobile so they can see the video playing
    if (window.innerWidth < 1024) {
      setActiveTab("player");
    }
  };

  const handleCopyLink = () => {
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(videoLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#18181B] text-slate-100 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0F0F12] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 mr-2">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
            <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate text-white leading-tight">
              {title}
            </h2>
            <p className="text-xs text-zinc-400 truncate">{channel}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg"
            title="Copy YouTube Link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1" />
            )}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Open in YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open</span>
          </a>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121216] border-b border-white/5 text-xs shrink-0">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("player")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "player"
                ? "bg-red-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video & Player</span>
          </button>
          <button
            onClick={() => setActiveTab("transcript")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === "transcript"
                ? "bg-red-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript ({segments.length})</span>
          </button>
        </div>

        {activeTab === "transcript" && (
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 pl-8 pr-3 py-1 text-xs rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Tab 1: Video Player & Info */}
        {activeTab === "player" && (
          <div className="h-full flex flex-col overflow-y-auto p-4 space-y-4">
            {/* 16:9 Video Container */}
            <div className="relative w-full pb-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
              {videoId ? (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                  No video selected
                </div>
              )}
            </div>

            {/* Video Meta Info Card */}
            <div className="bg-[#202024] rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                  <Youtube className="w-3 h-3 fill-red-400" />
                  YouTube Ingested
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Pinecone Indexed
                </span>
              </div>
              <h1 className="text-base font-bold text-white line-clamp-2">
                {title}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">By {channel}</p>
            </div>

            {/* Fast Jump Transcript Preview */}
            {segments.length > 0 && (
              <div className="bg-[#202024] rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    <span>Quick Timestamps (Click to Jump)</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("transcript")}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {segments.slice(0, 6).map((seg, idx) => (
                    <button
                      key={idx}
                      onClick={() => seekTo(seg.offset)}
                      className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/5 hover:border-red-500/30 transition-all group"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white font-mono text-[11px] font-bold shrink-0 transition-colors">
                        {formatSeconds(seg.offset)}
                      </span>
                      <p className="text-xs text-zinc-300 group-hover:text-white line-clamp-2 leading-snug">
                        {seg.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Full Interactive Transcript */}
        {activeTab === "transcript" && (
          <div className="h-full flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 select-text">
              {filteredSegments.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-sm">
                  {searchQuery
                    ? "No matching spoken lines found in transcript."
                    : "No transcript segments available for this video."}
                </div>
              ) : (
                filteredSegments.map((seg, idx) => (
                  <div
                    key={idx}
                    onClick={() => seekTo(seg.offset)}
                    className="p-3 rounded-xl bg-[#202024]/70 hover:bg-[#27272C] border border-white/5 hover:border-red-500/30 transition-all cursor-pointer group flex items-start gap-3"
                  >
                    <button
                      type="button"
                      className="px-2 py-1 rounded-md bg-red-500/10 group-hover:bg-red-500 text-red-400 group-hover:text-white font-mono text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{formatSeconds(seg.offset)}</span>
                    </button>
                    <p className="text-xs text-zinc-300 group-hover:text-zinc-100 leading-relaxed">
                      {seg.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
