"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
  Brain,
  Lightbulb,
} from "lucide-react";

export default function CognitiveStoryShowcase() {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      "/see teach me Quantum Superposition in simple plain English"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 bg-[#F5F2EB]/50 border-t border-[#E7E2D8] relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Visual Mnemonic Case Study</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black text-[#18181B] tracking-tight leading-tight">
            How Memory Masters Explain{" "}
            <span className="font-caslon italic font-normal text-purple-600 underline decoration-purple-300 decoration-2 underline-offset-8">
              Complex Science
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#57534E] font-caslon leading-relaxed">
            See how Neura translates intimidating textbook concepts into intuitive, unforgettable mental stories in plain English.
          </p>
        </div>

        {/* Focused Single Case Card: Quantum Superposition */}
        <div className="bg-white rounded-3xl border border-[#E7E2D8] shadow-[0_16px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300">
          {/* Card Top Banner */}
          <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#E7E2D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 font-mono text-xs font-bold uppercase tracking-wider">
                Quantum Superposition
              </span>
              <span className="text-xs text-stone-500 font-headline hidden sm:inline">
                • Schrödinger&apos;s Wavefunction in Plain English
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200/80 transition-all shadow-2xs"
                title="Copy slash command"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>/see</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Title & Tagline */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-headline font-black text-[#18181B] tracking-tight">
                Quantum Superposition
              </h3>
              <p className="text-sm sm:text-base text-purple-700 font-headline font-semibold mt-1">
                How to understand quantum probabilities and wavefunctions without confusing math.
              </p>
            </div>

            {/* Split Story & Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Illustration */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden border border-[#E7E2D8] shadow-md bg-stone-900 group">
                  <Image
                    src="/img/purple_cow_ufo.jpg"
                    alt="Visual mnemonic illustration of Quantum Superposition"
                    width={500}
                    height={380}
                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                    priority
                  />
                </div>
                <p className="text-[11px] text-stone-400 text-center mt-2 italic font-caslon">
                  The Spinning Coin & Purple Cow: All states exist simultaneously until observed.
                </p>
              </div>

              {/* Right: The Simple Plain English Explanation */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900 font-headline">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>The Spinning Coin Analogy (Explain Like I&apos;m 5):</span>
                  </div>
                  <p className="text-sm sm:text-base text-stone-700 font-caslon leading-relaxed">
                    Imagine spinning a coin on a table. While it is spinning at high speed, is it <strong>Heads</strong> or <strong>Tails</strong>?
                  </p>
                  <p className="text-sm sm:text-base text-stone-700 font-caslon leading-relaxed">
                    It is actually <strong>both at the same time</strong>—a rapid blur of pure possibility.
                  </p>
                  <p className="text-sm sm:text-base text-stone-700 font-caslon leading-relaxed">
                    The exact millisecond your hand slaps down onto the coin to stop it, the blur instantly disappears and freezes into <strong>one single reality</strong>: Heads or Tails.
                  </p>
                  <p className="text-sm sm:text-base text-purple-900 font-caslon font-medium leading-relaxed bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                    In quantum mechanics, microscopic particles do the exact same thing: before anyone looks or measures them, they exist across all possibilities simultaneously (<strong>Superposition</strong>). The instant an observer measures them, the blur &ldquo;collapses&rdquo; into one definite state.
                  </p>
                </div>
              </div>
            </div>

            {/* Contrast: Textbook vs Neura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Traditional Textbook (Dense & Forgettable)
                </span>
                <p className="text-xs text-stone-600 font-caslon italic leading-relaxed">
                  &ldquo;A quantum system remains in a linear combination of all possible eigenstates until an interaction with an external measuring device causes the wavefunction to collapse into a single definite eigenvalue.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                <span className="text-[11px] font-mono font-bold text-purple-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Neura Plain English (Instant & Permanent)
                </span>
                <p className="text-xs text-purple-950 font-caslon font-medium leading-relaxed">
                  &ldquo;While the coin is spinning, it is both Heads AND Tails. The second you slap your hand down, the blur snaps into just one!&rdquo;
                </p>
              </div>
            </div>

            {/* Interactive Recall Check */}
            <div className="pt-2 border-t border-[#E7E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-headline font-bold text-stone-900">
                  Quick Memory Check:
                </span>
                <p className="text-xs text-stone-600 font-caslon">
                  What causes a particle in superposition to collapse into one state?
                </p>
              </div>

              <div>
                {revealed ? (
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                    Measurement or observation by an external detector! 🎉
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="px-3.5 py-1.5 text-xs font-headline font-bold rounded-xl border border-purple-200 text-purple-700 bg-white hover:bg-purple-50 shadow-2xs transition-all"
                  >
                    Reveal Answer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
