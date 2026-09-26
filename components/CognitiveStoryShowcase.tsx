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
  ChevronRight,
  Brain,
} from "lucide-react";

interface StoryItem {
  id: string;
  tabLabel: string;
  command: string;
  title: string;
  conceptSubtitle: string;
  imageSrc: string;
  imageAlt: string;
  storyParagraph: string;
  neuroscienceWhy: string;
  dryComparison: {
    boring: string;
    vivid: string;
  };
  quote: string;
  quoteAuthor: string;
  testQuestion: string;
  testAnswer: string;
}

const STORIES: StoryItem[] = [
  {
    id: "quantum-superposition",
    tabLabel: "Quantum Superposition",
    command: "/see",
    title: "Quantum Superposition",
    conceptSubtitle: "How to understand Schrödinger's Wavefunction and never forget.",
    imageSrc: "/img/purple_cow_ufo.jpg",
    imageAlt: "Surreal vintage collage of a flying saucer tractor-beaming glowing purple cows into space under a smirking Victorian moon",
    storyParagraph:
      "In quantum mechanics, particles don't possess a single fixed location—they exist in a cloud of probabilities until observed. Picture a cow quietly grazing in a pasture (the baseline Ground State). Suddenly, an alien tractor beam lifts a glowing neon-purple cow into the night sky—it is now neither purely on the ground nor in space, but suspended in a simultaneous continuum of all possible states (ψ = α|ground⟩ + β|space⟩). In the upper sky, an antique Victorian moon opens its eye and glances down. The exact millisecond the moon observes the purple cow, the probability wave instantly collapses, locking the cow into one definitive physical reality.",
    neuroscienceWhy:
      "The brain's Reticular Activating System purges ordinary data. But when confronted with an impossible anomaly (a glowing purple cow in zero-gravity under a smirking moon), the amygdala fires an immediate surge of norepinephrine, forcefully locking the concept into permanent hippocampal storage.",
    dryComparison: {
      boring:
        "\"A quantum system remains in a linear combination of all possible eigenstates until an interaction with an external measuring device causes the wavefunction to collapse into a single definite eigenvalue.\"",
      vivid:
        "\"The cow is simultaneously grazing on the grass AND floating in space until the smirking moon looks down and snaps it into place!\"",
    },
    quote: "If you think you understand quantum mechanics, you don't understand quantum mechanics.",
    quoteAuthor: "Richard Feynman",
    testQuestion: "What causes the purple cow's superposition to collapse?",
    testAnswer:
      "Observation by the Victorian moon—representing how an external measurement apparatus forces a quantum wavefunction into a single definite state.",
  },
  {
    id: "memory-hierarchy",
    tabLabel: "Memory Hierarchy",
    command: "/car",
    title: "CPU Memory Hierarchy",
    conceptSubtitle: "How to understand hardware cache latency and never forget.",
    imageSrc: "/img/car_journey_memory.jpg",
    imageAlt: "Vintage technical blueprint of a classic car exploded into computing stations: engine L1 cache, windshield RAM, and trunk SSD storage",
    storyParagraph:
      "In computer architecture, data speed depends on physical distance from the processor. Instead of memorizing abstract latency tables, take a walk through a vintage car: The roaring engine under the hood represents the CPU Core & L1 Cache, delivering instant combustion at 0.5 nanoseconds. The windshield right in the driver's direct field of view represents volatile RAM, holding immediate active road data. The spacious rear trunk represents persistent SSD storage—it takes a moment to walk back and open, but everything stored in the trunk remains safely intact even when the car engine is completely powered down.",
    neuroscienceWhy:
      "Human spatial navigation is hardwired in the parahippocampal cortex. Anchoring abstract nanosecond hardware latencies to permanent, pre-existing physical vehicle stations allows the mind to traverse complex system architectures as intuitively as sitting in a driver's seat.",
    dryComparison: {
      boring:
        "\"The memory hierarchy optimizes access latency across disparate hardware tiers by staging temporal locality in SRAM caches prior to volatile DRAM and non-volatile NAND flash reads.\"",
      vivid:
        "\"Engine is L1 speed (fire instant), Windshield is RAM (in your face right now), and Trunk is your SSD (holds everything safely when parked)!\"",
    },
    quote: "Simplicity is prerequisite for reliability.",
    quoteAuthor: "Edsger W. Dijkstra",
    testQuestion: "Why is the engine mapped to L1 Cache and the trunk to SSD?",
    testAnswer:
      "Because the engine provides instant micro-second execution right at the core, while the trunk provides massive persistent capacity that survives power shutdowns.",
  },
  {
    id: "neural-plasticity",
    tabLabel: "Neural Plasticity",
    command: "/firstprinciple",
    title: "Synaptic Neuroplasticity",
    conceptSubtitle: "How to understand BDNF neurogenesis and memory chunking and never forget.",
    imageSrc: "/img/golden_ratio_mind.jpg",
    imageAlt: "Stippled engraving of a human mind geometrically split with a glowing golden spiral, EEG waves, and neural synapse illustrations",
    storyParagraph:
      "Your brain is not a fixed hard drive—it is a malleable, evolving neural forest governed by neurogenesis. Human working memory can only hold 4 ± 1 items at a time. By organizing knowledge along the self-similar logarithmic curve of the Golden Spiral (Phi = 1.618) on the profile of a stippled mind, complex biological layers chunk seamlessly: BDNF molecules spark new dendritic spines at the center nucleus, synchronous EEG brainwaves coordinate regional memory replay along the mid-curve, and the prefrontal cortex consolidates fragmented stimuli into crystalline long-term understanding.",
    neuroscienceWhy:
      "Arranging biological concepts along the self-similar Golden Ratio binds hundreds of disparate biochemical variables into an expanding geometric hierarchy, allowing the mind to treat an entire complex biological network as a single visual chunk.",
    dryComparison: {
      boring:
        "\"Long-term potentiation promotes structural synaptic plasticity via BDNF expression, consolidating sensory stimuli into recursive cortical representations.\"",
      vivid:
        "\"Nest knowledge along the golden spiral of your mind: basic synaptic sparks at the center expand outward into master principles at the outer crown!\"",
    },
    quote: "The brain is a muscle that grows stronger with every challenging connection.",
    quoteAuthor: "Majid Fotuhi",
    testQuestion: "How does the golden spiral bypass working memory limits?",
    testAnswer:
      "It binds isolated data points into an expanding geometric hierarchy, allowing the mind to treat an entire network as 1 cohesive visual chunk.",
  },
];

export default function CognitiveStoryShowcase() {
  const [activeStoryId, setActiveStoryId] = useState<string>("quantum-superposition");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const activeStory = STORIES.find((s) => s.id === activeStoryId) || STORIES[0];

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <section id="stories" className="py-20 bg-[#FAF8F5] border-y border-[#E7E2D8] relative overflow-hidden text-[#18181B]">
      {/* Subtle Paper Grain Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Futura Headline + Caslon Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DD] border border-[#DCD5C8] text-[#18181B] text-xs font-mono font-bold uppercase tracking-widest mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Visual Mnemonic Case Studies</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tight text-[#18181B] leading-tight">
            How Memory Masters Explain{" "}
            <span className="font-caslon italic font-normal underline decoration-purple-500/60 underline-offset-8">
              Complex Science
            </span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#57534E] leading-relaxed font-caslon max-w-2xl mx-auto">
            Explore how cognitive memory techniques translate intimidating concepts into permanent visual blueprints.
          </p>
        </div>

        {/* Clean Concept Selector Tabs (One-term labels) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {STORIES.map((story) => {
            const isActive = story.id === activeStoryId;
            return (
              <button
                key={story.id}
                onClick={() => {
                  setActiveStoryId(story.id);
                  setShowAnswer(false);
                }}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? "bg-[#18181B] text-white border-[#18181B] shadow-sm scale-[1.01]"
                    : "bg-white text-[#44403C] border-[#E7E2D8] hover:border-[#18181B]/30 hover:bg-[#F5F1E8]"
                }`}
              >
                <span className="font-headline font-bold">{story.tabLabel}</span>
                <span
                  className={`font-mono text-[11px] px-2 py-0.5 rounded-md ${
                    isActive ? "bg-white/20 text-purple-200" : "bg-[#EFE9DD] text-[#78716C]"
                  }`}
                >
                  {story.command}
                </span>
              </button>
            );
          })}
        </div>

        {/* Master Showcase Container: Clean 2-Column Layout */}
        <div className="bg-white rounded-3xl border border-[#E7E2D8] shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Full Uncropped Artwork (No covering badges) */}
            <div className="lg:col-span-5 bg-[#F7F4EE] p-5 sm:p-6 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#E7E2D8]">
              <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white group">
                <Image
                  src={activeStory.imageSrc}
                  alt={activeStory.imageAlt}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Clean Concept Story Breakdown */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                    {activeStory.tabLabel}
                  </span>
                  <button
                    onClick={() => handleCopy(activeStory.command)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#F7F4EE] text-[#18181B] border border-[#E7E2D8] hover:bg-[#EFE9DD] transition-colors"
                  >
                    {copiedCommand === activeStory.command ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                        <span>{activeStory.command}</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-2xl sm:text-3xl font-headline font-black text-[#18181B] tracking-tight">
                  {activeStory.title}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-[#57534E] font-caslon italic leading-relaxed">
                  {activeStory.conceptSubtitle}
                </p>
              </div>

              {/* Story-Driven Paragraph (From Books) */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8]">
                <p className="text-sm sm:text-base text-[#292524] font-caslon leading-relaxed">
                  {activeStory.storyParagraph}
                </p>
              </div>

              {/* The Neuroscience Insight */}
              <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E2D8C7]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B] uppercase font-mono mb-1">
                  <Brain className="w-3.5 h-3.5 text-purple-600" />
                  <span>The Cognitive Neuroscience</span>
                </div>
                <p className="text-xs text-[#44403C] font-caslon leading-relaxed">
                  {activeStory.neuroscienceWhy}
                </p>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-red-50/40 border border-red-200/50">
                  <div className="text-red-800 text-[10px] font-bold uppercase font-mono mb-0.5">
                    ❌ Traditional Textbook
                  </div>
                  <p className="text-xs text-red-950/80 leading-snug italic font-caslon">
                    {activeStory.dryComparison.boring}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/50">
                  <div className="text-emerald-800 text-[10px] font-bold uppercase font-mono mb-0.5">
                    ✅ Neura Memory Anchor
                  </div>
                  <p className="text-xs text-emerald-950/90 leading-snug font-caslon font-semibold">
                    {activeStory.dryComparison.vivid}
                  </p>
                </div>
              </div>

              {/* Active Recall Quiz Box */}
              <div className="p-3.5 rounded-2xl bg-[#18181B] text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-300 font-bold uppercase">
                    <HelpCircle className="w-3 h-3" />
                    <span>Quick Active-Recall Test</span>
                  </div>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="px-2.5 py-1 rounded-lg bg-white text-[#18181B] hover:bg-gray-100 text-[10px] font-headline font-bold transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <span>{showAnswer ? "Hide" : "Reveal Answer"}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${showAnswer ? "rotate-90" : ""}`} />
                  </button>
                </div>

                <p className="text-xs text-gray-200 font-caslon leading-snug">
                  {activeStory.testQuestion}
                </p>

                {showAnswer && (
                  <p className="text-[11px] text-purple-200 pt-1.5 border-t border-white/10 font-caslon italic animate-fade-in leading-relaxed">
                    💡 <strong>Answer:</strong> {activeStory.testAnswer}
                  </p>
                )}
              </div>

              {/* Bottom Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#E7E2D8]">
                <div className="text-xs text-[#78716C] italic font-caslon">
                  &quot;{activeStory.quote}&quot; — {activeStory.quoteAuthor}
                </div>

                <Link
                  href="/dashboard/docs"
                  className="inline-flex items-center gap-1 text-xs font-headline font-bold text-[#18181B] hover:text-purple-700 group transition-colors"
                >
                  <span>Explore All 23 Techniques in Docs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
