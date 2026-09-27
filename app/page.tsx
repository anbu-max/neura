"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import CognitiveStoryShowcase from "@/components/CognitiveStoryShowcase";
import useUpload from "@/hooks/useUpload";
import {
  Sparkles,
  Upload,
  Globe,
  Microscope,
  GraduationCap,
  Briefcase,
  Layers,
  Languages,
  ChevronDown,
  ArrowRight,
  Zap,
  BrainCircuit,
  SplitSquareVertical,
  Rocket,
  ShieldCheck,
  FileText,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const {
    progress,
    status,
    fileId,
    fileName,
    fileSize,
    error,
    isUploading,
    handleUpload,
    cancelUpload,
  } = useUpload();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleUpload(file);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const faqs = [
    {
      q: "Can I chat with PDFs for free without signing in?",
      a: "Yes! You can instantly drag and drop any PDF document right on this page or the upload page. No sign-up or credit card is required to start chatting with your documents.",
    },
    {
      q: "How does the cognitive memory engine work?",
      a: "Our AI incorporates principles from foundational memory literature—organizing key concepts into cognitive loci (memory palaces), semantic chunking, and instant spaced recall summaries so you retain more information in less time.",
    },
    {
      q: "Can I chat with YouTube videos as well as PDFs?",
      a: "Yes! Our YouTube Chat tool analyzes video transcripts, generates concise timestamped summaries, and lets you ask questions directly about any video.",
    },
    {
      q: "Are my documents kept private and secure?",
      a: "Absolutely. Your documents and conversations are encrypted in transit and at rest. We never share or sell your data.",
    },
    {
      q: "Does it support multiple languages?",
      a: "Neura AI accepts documents in any language and can answer questions or translate content across over 100+ languages simultaneously.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-caslon text-[#18181B] selection:bg-[#EFE9DD] selection:text-[#18181B]">
      {/* Top Navbar */}
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO & FOCUSED UPLOAD HUB                                      */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
          {/* Subtle Doodle Background Accents */}
          <div className="absolute top-12 left-10 text-purple-300/40 hidden md:block select-none pointer-events-none -rotate-12">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <path
                d="M10 50 Q 30 10, 60 50 T 90 40"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              <path
                d="M75 25 L 90 40 L 75 55"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="absolute top-20 right-14 text-purple-300/40 hidden md:block select-none pointer-events-none rotate-12">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="8 8"
              />
              <path
                d="M25 35 Q 40 50, 55 35"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Sparkle Headline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DD] border border-[#DCD5C8] text-[#18181B] text-xs font-mono font-bold uppercase tracking-widest mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Tools for Students & Researchers</span>
            </div>

            {/* Main Title with Futura Geometric Font */}
            <h1 className="text-4xl sm:text-6xl font-headline font-black text-[#18181B] tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Transform Your PDFs into{" "}
              <span className="text-purple-600 relative inline-block font-caslon italic font-normal">
                Interactive
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-purple-400/80"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2,12 Q50,22 98,6"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Conversations
            </h1>

            {/* Subtitle with Caslon Heritage Typography */}
            <p className="mt-5 text-lg sm:text-xl text-[#57534E] max-w-2xl mx-auto font-caslon leading-relaxed">
              Drop any <span className="text-[#18181B] font-semibold font-headline">PDF document</span>. Summarize, extract key takeaways, and memorize effortlessly with cognitive learning.
            </p>

            {/* Single Clean Focused PDF Drop Card */}
            <div className="mt-10 max-w-xl mx-auto relative">
              {/* Purple Doodle Arrow Annotation */}
              <div className="absolute -top-10 -left-10 hidden sm:flex items-center gap-1 select-none pointer-events-none z-20">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 rotate-[-10deg] font-mono bg-purple-50/90 px-2 py-0.5 rounded border border-purple-200 shadow-2xs">
                  DROP YOUR PDF FILE HERE
                </span>
                <svg
                  className="w-10 h-10 text-purple-600 rotate-12"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <path
                    d="M20 20 Q 70 20, 70 70 L 50 60 M 70 70 L 80 50"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="bg-white rounded-3xl border border-[#E7E2D8] shadow-[0_16px_50px_rgba(0,0,0,0.04)] p-4 sm:p-5">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 min-h-[170px] ${
                    isDragActive
                      ? "border-purple-600 bg-purple-50/80 scale-[1.01]"
                      : "border-purple-200 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/40"
                  }`}
                >
                  <input {...getInputProps()} />

                  {error ? (
                    <div
                      className="flex flex-col items-center justify-center gap-3 p-4 text-center max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AlertCircle className="w-9 h-9 text-red-500" />
                      <div className="space-y-1">
                        <p className="font-headline font-bold text-sm text-red-700">Upload Encountered an Issue</p>
                        <p className="text-xs text-red-600 font-caslon">{error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelUpload();
                        }}
                        className="mt-1 px-4 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-headline font-bold transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : isUploading ? (
                    <div
                      className="w-full max-w-lg p-2 sm:p-4 flex flex-col items-center gap-3 cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Top: File info & Cancel button */}
                      <div className="w-full flex items-center justify-between gap-3 bg-white/90 border border-purple-100 rounded-2xl px-4 py-2.5 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-headline font-bold text-[#18181B] truncate max-w-[180px] sm:max-w-[260px]">
                              {fileName || "Document.pdf"}
                            </p>
                            <p className="text-[11px] text-[#78716C] font-mono">
                              {fileSize || "PDF file"}
                            </p>
                          </div>
                        </div>

                        {/* Cancel Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelUpload();
                          }}
                          className="flex items-center gap-1 text-xs font-headline font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs flex-shrink-0"
                          title="Cancel upload"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>

                      {/* Status & Percentage */}
                      <div className="w-full flex items-center justify-between text-xs px-1 font-headline">
                        <span className="font-semibold text-purple-800 flex items-center gap-1.5 truncate">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600 flex-shrink-0" />
                          <span className="truncate">{status || "Uploading..."}</span>
                        </span>
                        <span className="font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md text-[11px] flex-shrink-0 ml-2">
                          {progress || 0}%
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                        <div
                          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 h-full rounded-full transition-all duration-300 shadow-xs relative overflow-hidden"
                          style={{
                            width: `${Math.min(100, Math.max(5, progress || 0))}%`,
                          }}
                        />
                      </div>

                      {/* Phase Indicators */}
                      <div className="w-full grid grid-cols-3 gap-1 pt-1 text-[10px] text-center font-headline font-semibold text-[#78716C]">
                        <span className={`${(progress || 0) >= 20 ? "text-purple-700 font-bold" : ""}`}>
                          1. Uploading
                        </span>
                        <span className={`${(progress || 0) >= 65 ? "text-purple-700 font-bold" : ""}`}>
                          2. Database
                        </span>
                        <span className={`${(progress || 0) >= 85 ? "text-purple-700 font-bold" : ""}`}>
                          3. AI Memory
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                      <span className="text-base font-medium text-[#44403C] font-caslon">
                        Drop your PDF file here or
                      </span>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-900 text-sm font-headline font-bold shadow-2xs hover:scale-105 transition-all">
                        <Upload className="w-4 h-4 text-purple-600" />
                        <span>Browse file</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* University Trust Badges */}
            <div className="mt-14 pt-8 border-t border-[#E7E2D8] max-w-3xl mx-auto">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#78716C] mb-6">
                Trusted by researchers and students at top institutions:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
                {/* Harvard */}
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#18181B] tracking-wider">
                  <svg className="w-5 h-5 text-red-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.25v4.66c0 4.14-2.73 8.02-6 9.09-3.27-1.07-6-4.95-6-9.09V6.43l6-2.25z" />
                  </svg>
                  <span>HARVARD</span>
                </div>

                {/* Stanford */}
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#18181B] tracking-wider">
                  <svg className="w-5 h-5 text-emerald-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L6 10h4v10h4V10h4L12 2z" />
                  </svg>
                  <span>STANFORD</span>
                </div>

                {/* MIT */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-black text-[#18181B] tracking-widest">
                  <span className="bg-red-800 text-white px-1 rounded-xs">III</span>
                  <span>MIT</span>
                </div>

                {/* Oxford */}
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#18181B] tracking-wider">
                  <svg className="w-5 h-5 text-blue-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v10M7 12h10" />
                  </svg>
                  <span>OXFORD</span>
                </div>

                {/* Cambridge */}
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#18181B] tracking-wider">
                  <svg className="w-5 h-5 text-teal-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                  <span>CAMBRIDGE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: INTERACTIVE APP DEMO MOCKUP                                    */}
        {/* ========================================================================= */}
        <section className="py-14 bg-[#FAF8F5] border-t border-[#E7E2D8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xs font-mono font-bold text-purple-700 uppercase tracking-widest mb-2">
                Real-Time Document Intelligence
              </h2>
              <p className="text-2xl sm:text-3xl font-headline font-bold text-[#18181B]">
                Experience Side-by-Side Clarity
              </p>
            </div>

            {/* App Mockup Container */}
            <div className="bg-white border border-[#E7E2D8] rounded-3xl p-3 sm:p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8] mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs font-mono font-medium text-[#78716C]">
                    Unlimited_Memory_Summary.pdf
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-purple-700 font-headline font-semibold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Connected</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[360px]">
                {/* PDF Page Mockup */}
                <div className="lg:col-span-7 bg-[#FAF8F5] rounded-2xl border border-[#E7E2D8] p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="h-4 bg-[#E7E2D8] rounded w-2/5 mb-4" />
                    <div className="space-y-2 mb-6">
                      <div className="h-3 bg-[#EFE9DD] rounded w-full" />
                      <div className="h-3 bg-[#EFE9DD] rounded w-11/12" />
                      <div className="h-3 bg-purple-100 rounded w-4/5 text-[10px] text-purple-800 px-1 font-mono">
                        Memory Principle: Transform abstract data into vivid physical loci.
                      </div>
                      <div className="h-3 bg-[#EFE9DD] rounded w-5/6" />
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] flex items-center gap-3">
                      <BrainCircuit className="w-8 h-8 text-purple-600 flex-shrink-0" />
                      <p className="text-xs text-[#18181B] font-caslon font-medium leading-relaxed">
                        &quot;The secret to a 10x memory is not natural talent, but organizing ideas through spatial memory palaces.&quot;
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#78716C] font-mono text-right pt-4 border-t border-[#E7E2D8]">
                    Page 1 of 12 • Source Verified
                  </div>
                </div>

                {/* Chat Stream Mockup */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E7E2D8] p-4 shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-[#18181B] text-white text-xs font-headline font-medium px-3.5 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] shadow-2xs">
                        How can I remember complex terms from this paper?
                      </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex justify-start">
                      <div className="bg-[#F7F4EE] text-[#18181B] text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none max-w-[90%] space-y-1.5 leading-relaxed border border-[#E7E2D8]">
                        <p className="font-headline font-bold text-purple-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> 3 Core Memory Anchors:
                        </p>
                        <ol className="list-decimal pl-4 space-y-1 text-[#44403C] font-caslon">
                          <li>
                            <strong className="font-headline text-[#18181B]">See it:</strong> Convert abstract terms into vivid pictures.
                          </li>
                          <li>
                            <strong className="font-headline text-[#18181B]">Place it:</strong> Anchor terms in a familiar vehicle or room.
                          </li>
                          <li>
                            <strong className="font-headline text-[#18181B]">Recall it:</strong> Test with active retrieval questions.
                          </li>
                        </ol>
                        <div className="pt-1">
                          <span className="inline-block bg-[#EFE9DD] text-[#18181B] font-mono font-semibold px-1.5 py-0.5 rounded text-[10px] border border-[#DCD5C8]">
                            Source: Page 1, Section 2
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E7E2D8]">
                    <div className="flex items-center gap-2 bg-[#FAF8F5] rounded-xl px-3 py-2 text-xs text-[#78716C] border border-[#E7E2D8]">
                      <span className="font-caslon">Ask any follow-up question...</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: "NEURA AI IN A NUTSHELL" - 6 FEATURE CARDS                     */}
        {/* ========================================================================= */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-headline font-black text-[#18181B]">
              Neura AI in a <span className="font-caslon italic font-normal text-purple-600">Nutshell</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#57534E] font-caslon">
              Your Cognitive Document AI - specialized for research, learning, and synthesis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 shadow-2xs hover:border-[#18181B]/30 hover:bg-[#FDFCF9] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] flex items-center justify-center text-purple-700 mb-4 border border-[#DCD5C8]">
                  <Microscope className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-[#18181B] text-lg mb-2">For Researchers</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed">
                  Explore scientific papers, academic journals, and technical manuals to extract data without manual scanning.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center text-xs font-headline font-bold text-purple-700">
                <span>Fast Literature Review →</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 shadow-2xs hover:border-[#18181B]/30 hover:bg-[#FDFCF9] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] flex items-center justify-center text-purple-700 mb-4 border border-[#DCD5C8]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-[#18181B] text-lg mb-2">For Students</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed">
                  Prepare for exams, generate active-recall flashcards, and turn 200-page textbooks into structured memory notes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center text-xs font-headline font-bold text-purple-700">
                <span>Ace Your Exams →</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 shadow-2xs hover:border-[#18181B]/30 hover:bg-[#FDFCF9] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] flex items-center justify-center text-purple-700 mb-4 border border-[#DCD5C8]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-[#18181B] text-lg mb-2">For Professionals</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed">
                  Analyze legal contracts, financial reports, and business proposals in seconds with cited page references.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center text-xs font-headline font-bold text-purple-700">
                <span>Accelerate Due Diligence →</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 shadow-2xs hover:border-[#18181B]/30 hover:bg-[#FDFCF9] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] flex items-center justify-center text-purple-700 mb-4 border border-[#DCD5C8]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-[#18181B] text-lg mb-2">Cited Sources</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed">
                  Every single answer includes direct page citations. Click the citation badge to verify the original paragraph.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center text-xs font-headline font-bold text-purple-700">
                <span>Never Guess Answers →</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 shadow-2xs hover:border-[#18181B]/30 hover:bg-[#FDFCF9] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] flex items-center justify-center text-purple-700 mb-4 border border-[#DCD5C8]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-[#18181B] text-lg mb-2">Multi-File Chats</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed">
                  Cross-reference multiple documents in a single workspace. Compare research papers and analyze document sets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center text-xs font-headline font-bold text-purple-700">
                <span>Cross-Document AI →</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl border border-[#E7E2D8] p-6 shadow-2xs hover:border-[#18181B]/30 hover:bg-[#FDFCF9] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] flex items-center justify-center text-purple-700 mb-4 border border-[#DCD5C8]">
                  <Languages className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-[#18181B] text-lg mb-2">Any Language</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed">
                  Works globally! Upload documents in Spanish, German, Chinese, Japanese, or French, and chat in any language.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center text-xs font-headline font-bold text-purple-700">
                <span>100+ Languages Supported →</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* EDITORIAL PAPER SHOWCASE: VISUAL MNEMONIC & NEUROSCIENCE BLUEPRINTS       */}
        {/* ========================================================================= */}
        <CognitiveStoryShowcase />

        {/* ========================================================================= */}
        {/* SECTION 4: OPTIMIZED COGNITIVE LEARNING ENGINE (OBSIDIAN BLACK THEME)      */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#09090B] text-white relative overflow-hidden border-y border-zinc-800">
          {/* Subtle Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>Cognitive Learning Engine</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-headline font-black tracking-tight text-white">
                Don’t just read. <span className="font-caslon italic font-normal text-purple-400">Remember effortlessly.</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-zinc-400 font-caslon leading-relaxed">
                Instead of repetitive, passive reading, our AI restructures documents into sensory mental cinema, spatial loci memory palaces, and active recall loops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/90 rounded-2xl p-7 border border-zinc-800 shadow-sm hover:border-purple-500/40 hover:bg-zinc-900 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-mono font-bold text-sm mb-5">
                  01
                </div>
                <h3 className="text-lg font-headline font-bold text-white mb-2">See & Connect (S.E.E.)</h3>
                <p className="text-zinc-400 font-caslon text-sm leading-relaxed">
                  Transform dry data into vivid mental movies. Complex terminology is automatically mapped into sensory metaphors that stick instantly.
                </p>
              </div>

              <div className="bg-zinc-900/90 rounded-2xl p-7 border border-zinc-800 shadow-sm hover:border-purple-500/40 hover:bg-zinc-900 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-mono font-bold text-sm mb-5">
                  02
                </div>
                <h3 className="text-lg font-headline font-bold text-white mb-2">Spatial Loci & Palaces</h3>
                <p className="text-zinc-400 font-caslon text-sm leading-relaxed">
                  Information is structured into progressive vehicle or architectural stations so you can mentally walk through an entire document in sequence.
                </p>
              </div>

              <div className="bg-zinc-900/90 rounded-2xl p-7 border border-zinc-800 shadow-sm hover:border-purple-500/40 hover:bg-zinc-900 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-mono font-bold text-sm mb-5">
                  03
                </div>
                <h3 className="text-lg font-headline font-bold text-white mb-2">Active & Spaced Recall</h3>
                <p className="text-zinc-400 font-caslon text-sm leading-relaxed">
                  Automated self-testing queries and autobiographical memory hooks consolidate knowledge into permanent crystalline retention.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-[#09090B] font-headline font-bold px-8 py-4 rounded-2xl shadow-sm hover:scale-105 transition-all text-sm sm:text-base"
              >
                <span>Try Cognitive Learning on Your PDF</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: "PDF INTERACTIONS MADE SIMPLE" WORKFLOW GRID                   */}
        {/* ========================================================================= */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-headline font-black text-[#18181B]">
              PDF Interactions Made <span className="font-caslon italic font-normal text-purple-600">Simple</span>
            </h2>
            <p className="mt-3 text-[#57534E] font-caslon text-base">
              Summarize, compare, and ask questions to any PDF. Fast, free, and no sign-up required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item 1 */}
            <div className="bg-white rounded-3xl border border-[#E7E2D8] p-7 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-purple-700 uppercase tracking-widest block mb-2">
                  Organize
                </span>
                <h3 className="text-xl font-headline font-bold text-[#18181B] mb-2">Multi-File Workspaces</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed mb-5">
                  Bring multiple PDFs into one conversation. Keep your study materials, papers, or project files easily accessible in one chat.
                </p>
              </div>
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#E7E2D8] flex items-center gap-3 text-xs text-[#57534E] font-caslon">
                <Layers className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Create folders and group 10+ related research PDFs together</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-white rounded-3xl border border-[#E7E2D8] p-7 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-purple-700 uppercase tracking-widest block mb-2">
                  Simplify
                </span>
                <h3 className="text-xl font-headline font-bold text-[#18181B] mb-2">Executive PDF Summaries</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed mb-5">
                  Summarize academic articles, research papers, or reports. Extract the key insights without reading everything.
                </p>
              </div>
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#E7E2D8] flex items-center gap-3 text-xs text-[#57534E] font-caslon">
                <Zap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Executive 1-page summaries in under 3 seconds</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="bg-white rounded-3xl border border-[#E7E2D8] p-7 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-purple-700 uppercase tracking-widest block mb-2">
                  Understand
                </span>
                <h3 className="text-xl font-headline font-bold text-[#18181B] mb-2">Global Document Translation</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed mb-5">
                  Make any PDF speak your language. Transform documents from around the world into clear, readable text instantly.
                </p>
              </div>
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#E7E2D8] flex items-center gap-3 text-xs text-[#57534E] font-caslon">
                <Globe className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>English, Spanish, Mandarin, German, French & 90+ more</span>
              </div>
            </div>

            {/* Item 4 */}
            <div className="bg-white rounded-3xl border border-[#E7E2D8] p-7 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-purple-700 uppercase tracking-widest block mb-2">
                  Navigate
                </span>
                <h3 className="text-xl font-headline font-bold text-[#18181B] mb-2">Side-by-Side Verification</h3>
                <p className="text-[#57534E] font-caslon text-sm leading-relaxed mb-5">
                  Keep the chat and PDF open together. Answers are linked to the original PDF content, making it simple to verify.
                </p>
              </div>
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#E7E2D8] flex items-center gap-3 text-xs text-[#57534E] font-caslon">
                <SplitSquareVertical className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Interactive live PDF viewer paired with real-time AI responses</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: INTERACTIVE FREQUENTLY ASKED QUESTIONS (FAQ)                   */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FAF8F5] border-t border-[#E7E2D8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-headline font-black text-[#18181B]">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-[#57534E] font-caslon text-base">
                Everything you need to know about Neura AI, privacy, and memory tools.
              </p>
            </div>

            <div className="space-y-3.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E7E2D8] rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between font-headline font-bold text-[#18181B] text-base hover:text-purple-700 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#78716C] transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-purple-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-[#57534E] font-caslon leading-relaxed border-t border-[#E7E2D8] bg-[#FAF8F5]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: EDITORIAL AESTHETIC FOOTER                                     */}
        {/* ========================================================================= */}
        <footer className="bg-[#F5F1E8] text-[#57534E] py-16 border-t border-[#E7E2D8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E7E2D8]">
              {/* Brand Col */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-xl font-headline font-black text-[#18181B] tracking-tight">
                    Chat<span className="text-purple-600">PDF</span>
                  </span>
                </div>
                <p className="text-sm font-caslon text-[#57534E] leading-relaxed">
                  The AI-powered document companion designed for researchers, students, and professionals worldwide.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>All Systems Operational</span>
                </div>
              </div>

              {/* Col 2: Tools */}
              <div>
                <h4 className="text-[#18181B] text-xs font-headline font-bold uppercase tracking-wider mb-4">
                  AI Tools
                </h4>
                <ul className="space-y-2.5 text-xs font-headline font-semibold text-[#57534E]">
                  <li>
                    <Link href="/dashboard/upload" className="hover:text-purple-700 transition-colors">
                      PDF Chat & Analyzer
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/youtube" className="hover:text-purple-700 transition-colors">
                      YouTube Video Chat
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/docs" className="hover:text-purple-700 transition-colors">
                      Memory Command Engine
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Memory Science */}
              <div>
                <h4 className="text-[#18181B] text-xs font-headline font-bold uppercase tracking-wider mb-4">
                  Cognitive Techniques
                </h4>
                <ul className="space-y-2.5 text-xs font-headline font-semibold text-[#57534E]">
                  <li>
                    <Link href="/dashboard/docs" className="hover:text-purple-700 transition-colors">
                      /see • S.E.E. Principle
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/docs" className="hover:text-purple-700 transition-colors">
                      /car • Car Journey Method
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/docs" className="hover:text-purple-700 transition-colors">
                      /palace • Method of Loci
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/docs" className="hover:text-purple-700 transition-colors">
                      /flashcard • Active Retrieval
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4: Account */}
              <div>
                <h4 className="text-[#18181B] text-xs font-headline font-bold uppercase tracking-wider mb-4">
                  Workspace
                </h4>
                <ul className="space-y-2.5 text-xs font-headline font-semibold text-[#57534E]">
                  <li>
                    <Link href="/dashboard" className="hover:text-purple-700 transition-colors">
                      My Documents
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/upgrade" className="hover:text-purple-700 transition-colors">
                      Pro Membership
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/docs" className="hover:text-purple-700 transition-colors">
                      Documentation & Guide
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] font-caslon gap-4">
              <p>© 2026 Neura AI. Built with cognitive memory principles.</p>
              <div className="flex items-center gap-6 font-headline font-semibold">
                <Link href="#" className="hover:text-[#18181B] transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-[#18181B] transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-[#18181B] transition-colors">
                  Security
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
