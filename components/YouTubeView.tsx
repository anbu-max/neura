"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Youtube,
  ExternalLink,
  Search,
  Clock,
  Sparkles,
  Play,
  Copy,
  Check,
  RotateCcw,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
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
  const segments = useMemo(() => docData?.segments || [], [docData?.segments]);

  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter((s) => s.text.toLowerCase().includes(q));
  }, [segments, searchQuery]);

  const seekTo = (seconds: number) => {
    setActiveTimestamp(seconds);
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "seekTo",
        args: [seconds, true],
      }),
      "*"
    );
  };

  const handleCopyLink = () => {
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(videoLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] text-stone-900 border-r border-[#E7E2D8]">
      {/* Top Header Bar - Clean Light Aesthetic */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#E7E2D8] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 mr-3">
          <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Youtube className="w-4 h-4 text-red-600 fill-red-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold truncate text-stone-900 leading-tight">
              {title}
            </h2>
            <p className="text-[11px] text-stone-500 truncate">{channel}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            className="h-8 px-2.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
            title="Copy YouTube Link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1" />
            )}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded-lg transition-colors border border-stone-200/60 shadow-2xs"
            title="Open in YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open</span>
          </a>
        </div>
      </div>

      {/* Main Container: Video on Top, Transcript Directly Below (No Tabs) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Half: Video Player & Badges */}
        <div className="p-3 sm:p-4 bg-white border-b border-[#E7E2D8] shrink-0 space-y-3">
          {/* 16:9 Video Embed */}
          <div className="relative w-full pb-[56.25%] bg-stone-950 rounded-2xl overflow-hidden shadow-md border border-stone-200/90">
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
              <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
                No video loaded
              </div>
            )}
          </div>

          {/* Video Metadata & Search Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200/70">
                <Youtube className="w-3 h-3 fill-red-600 text-red-600" />
                Video Loaded
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/70">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Pinecone Indexed
              </span>
            </div>

            {/* Quick Restart Video */}
            <button
              onClick={() => seekTo(0)}
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Start from 0:00</span>
            </button>
          </div>
        </div>

        {/* Bottom Half: Interactive Timestamps & Spoken Transcript */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#FAF8F5]">
          {/* Transcript Header with Search Bar */}
          <div className="px-4 py-2.5 bg-[#F5F2EB]/60 border-b border-[#E7E2D8] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>Timestamps & Transcript</span>
              {segments.length > 0 && (
                <span className="text-[11px] font-normal text-stone-500">
                  ({segments.length} lines)
                </span>
              )}
            </div>

            {/* Search Input for Spoken Words */}
            <div className="relative w-44 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search spoken words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#DCD5C8] pl-8 pr-3 py-1 text-xs rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Scrollable Timestamped Spoken Lines */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            {filteredSegments.length === 0 ? (
              <div className="text-center py-10 px-4 text-stone-400 text-xs">
                {searchQuery
                  ? `No timestamps found matching "${searchQuery}".`
                  : "Loading transcript timestamps..."}
              </div>
            ) : (
              filteredSegments.map((seg, idx) => {
                const isActive = activeTimestamp === seg.offset;
                return (
                  <div
                    key={idx}
                    onClick={() => seekTo(seg.offset)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 shadow-2xs ${
                      isActive
                        ? "bg-red-50/80 border-red-300 ring-1 ring-red-200"
                        : "bg-white hover:bg-stone-50/90 border-[#E7E2D8] hover:border-red-200"
                    }`}
                  >
                    {/* Clickable Timestamp Pill */}
                    <button
                      type="button"
                      className={`px-2 py-1 rounded-md font-mono text-xs font-bold shrink-0 transition-colors flex items-center gap-1 ${
                        isActive
                          ? "bg-red-600 text-white shadow-xs"
                          : "bg-red-50 group-hover:bg-red-600 text-red-600 group-hover:text-white border border-red-200/70 group-hover:border-red-600"
                      }`}
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{formatSeconds(seg.offset)}</span>
                    </button>

                    {/* Spoken Text */}
                    <p className="text-xs text-stone-700 group-hover:text-stone-900 leading-relaxed pt-0.5 select-text">
                      {seg.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
