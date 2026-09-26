"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Search,
  BrainCircuit,
  Binary,
  Castle,
  Layers,
  HelpCircle,
  Smile,
  Calendar,
  GitFork,
  FileCheck,
  ArrowRight,
  Zap,
  Eye,
  User as UserIcon,
  Car,
  Hash,
  Contact,
  Link2,
  SpellCheck,
  Target,
  Lightbulb,
  HeartHandshake,
  FileText,
  Clock,
} from "lucide-react";
import { MEMORY_COMMANDS } from "@/lib/memoryCommands";

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

export default function MemoryDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Memory Mastery", "Structure", "Testing", "Analogy"];

  const filteredCommands = MEMORY_COMMANDS.filter((cmd) => {
    const matchesCategory =
      selectedCategory === "All" || cmd.category === selectedCategory;
    const matchesSearch =
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.slash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.fullDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.cognitiveScience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.whenToUse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.steps.some(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.action.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (slash: string, id: string) => {
    navigator.clipboard.writeText(slash);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-10 pb-28 font-sans">
      {/* ========================================================================= */}
      {/* HERO HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-purple-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-purple-200 text-xs font-bold uppercase tracking-wider border border-white/10 shadow-xs">
            <BrainCircuit className="w-4 h-4 text-purple-300" />
            <span>Optimized Cognitive Frameworks & Memory Protocols</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Cognitive Slash Commands & <span className="text-purple-300">Memory Documentation</span>
          </h1>

          <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed">
            Every command below transforms how you read, synthesize, and memorize complex PDF documents and YouTube transcripts. Type any <code className="bg-black/40 text-purple-300 px-2 py-0.5 rounded font-mono text-xs font-bold border border-purple-400/20">/command</code> in the chat to activate that mental protocol.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <Link
              href="/dashboard/upload"
              className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all inline-flex items-center gap-1.5 shadow-md shadow-purple-900/40 hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Upload PDF & Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/youtube"
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all inline-flex items-center gap-1.5 border border-white/10"
            >
              <span>YouTube Video Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-STEP QUICK WORKFLOW                                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-start gap-4 hover:border-purple-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-black text-base flex items-center justify-center flex-shrink-0 border border-purple-100">
            1
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Open Any Document</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Upload a PDF document or paste a YouTube URL to start a rich AI conversation.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-start gap-4 hover:border-purple-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-black text-base flex items-center justify-center flex-shrink-0 border border-purple-100">
            2
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Type &quot;/&quot; in the Chat</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              A floating menu appears with all {MEMORY_COMMANDS.length} memory commands with arrow-key selection.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-start gap-4 hover:border-purple-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-black text-base flex items-center justify-center flex-shrink-0 border border-purple-100">
            3
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Get Memory-Engineered Output</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              The AI automatically restructures answers into loci palaces, autobiographical anchors, flashcards, or SEE cinema.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEARCH & CATEGORY FILTER                                                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? MEMORY_COMMANDS.length
                : MEMORY_COMMANDS.filter((c) => c.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search commands, techniques, or cognitive terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE COMMANDS CATALOG                                            */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        {filteredCommands.map((cmd) => {
          const IconComp = iconMap[cmd.iconName] || BookOpen;
          const isCopied = copiedId === cmd.id;

          return (
            <div
              key={cmd.id}
              className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs hover:border-purple-300 hover:shadow-lg transition-all duration-200 space-y-6"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs flex-shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl">
                      {cmd.name}
                    </h3>
                    <span className="font-mono text-xs sm:text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                      {cmd.slash}
                    </span>
                  </div>
                </div>

                {/* Copy Command Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(cmd.slash, cmd.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-300 transition-all shadow-2xs self-start sm:self-auto"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>

              {/* Strategy 2-3 Line Description */}
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {cmd.fullDesc}
              </p>

              {/* ======================================================= */}
              {/* 1, 2, 3 NUMBERED EXECUTION STEPS                        */}
              {/* ======================================================= */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Step-by-Step 1, 2, 3 Mental Execution Protocol</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {cmd.steps.map((st) => (
                    <div
                      key={st.step}
                      className="bg-white rounded-xl p-3.5 border border-slate-200/70 shadow-2xs flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                          {st.step}
                        </span>
                        <h5 className="font-bold text-gray-900 text-xs">
                          {st.title}
                        </h5>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pl-8">
                        {st.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cognitive Science & Pro-Tip Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cognitive Neuroscience Box */}
                <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800">
                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                    <span>Cognitive Neuroscience</span>
                  </div>
                  <p className="text-xs text-purple-950 leading-relaxed font-medium">
                    {cmd.cognitiveScience}
                  </p>
                </div>

                {/* Pro-Tip & When to Use Box */}
                <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Expert Tip & When to Use</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    {cmd.proTip}
                  </p>
                  <div className="pt-1 text-[11px] text-amber-900/90 flex items-start gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span><strong>When to Use:</strong> {cmd.whenToUse}</span>
                  </div>
                </div>
              </div>

              {/* Clean Example Section (Compact Prompt + Clean Output without Asterisks) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-stretch">
                {/* Compact Prompt Card */}
                <div className="md:col-span-4 p-4 bg-gray-50 rounded-2xl border border-gray-200/70 flex flex-col justify-between space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Example Chat Command
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-200 flex items-center justify-between shadow-2xs">
                    <span className="font-mono text-base font-bold text-purple-700">
                      {cmd.slash}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cmd.slash, cmd.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-all"
                      title="Copy Command"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Type in the chat bar to execute this mental protocol on your document.
                  </p>
                </div>

                {/* Clean Example Output */}
                <div className="md:col-span-8 p-4 bg-purple-50/20 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-700">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    <span>Example Output</span>
                  </div>
                  <div className="text-xs text-gray-800 leading-relaxed bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs space-y-2 whitespace-pre-line font-medium">
                    {cmd.exampleOutputSnippet}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ACTION BANNER                                                      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-purple-800/40">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-black text-2xl tracking-tight">
            Ready to experience optimized learning?
          </h4>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
            Upload any research paper, study guide, or video transcript and test any cognitive slash command in real-time.
          </p>
        </div>

        <Link
          href="/dashboard/upload"
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-7 py-3.5 rounded-2xl text-sm shadow-md shadow-purple-900/40 hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0"
        >
          <span>Chat with Your PDF</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
