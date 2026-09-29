"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Gamepad2,
  Film,
  Award,
  BookOpen,
  Music,
  Utensils,
  Heart,
  Ban,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { saveUserMemories } from "@/actions/userSettings";
import { useToast } from "./ui/use-toast";

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function OnboardingModal({
  forceOpen = false,
  onClose,
}: OnboardingModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [favoriteGame, setFavoriteGame] = useState("");
  const [favoriteMovie, setFavoriteMovie] = useState("");
  const [bestMoment, setBestMoment] = useState("");
  const [bestBook, setBestBook] = useState("");
  const [favoriteMusic, setFavoriteMusic] = useState("");
  const [favoriteFood, setFavoriteFood] = useState("");
  const [petInfo, setPetInfo] = useState("");
  const [petPeeves, setPetPeeves] = useState("");
  const [learningStyle, setLearningStyle] = useState("Vivid mental movies and relatable everyday stories (/see)");

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    const hasCompleted = localStorage.getItem("neura_onboarding_completed");
    if (!hasCompleted) {
      // Trigger smooth popup after 1.5s
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("neura_onboarding_completed", "true");
    if (onClose) onClose();
  };

  const handleSaveAndFinish = async () => {
    setIsSaving(true);

    const memoriesToSave: Array<{ category: string; content: string }> = [];

    if (favoriteGame.trim())
      memoriesToSave.push({ category: "game", content: `Favorite Game / Sport: ${favoriteGame.trim()}` });
    if (favoriteMovie.trim())
      memoriesToSave.push({ category: "movie", content: `Favorite Movie / Shows: ${favoriteMovie.trim()}` });
    if (bestMoment.trim())
      memoriesToSave.push({ category: "moment", content: `Best Life Moment: ${bestMoment.trim()}` });
    if (bestBook.trim())
      memoriesToSave.push({ category: "book", content: `Best Book Read: ${bestBook.trim()}` });
    if (favoriteMusic.trim())
      memoriesToSave.push({ category: "music", content: `Favorite Music / Musician: ${favoriteMusic.trim()}` });
    if (favoriteFood.trim())
      memoriesToSave.push({ category: "food", content: `Favorite Food & Drink: ${favoriteFood.trim()}` });
    if (petInfo.trim())
      memoriesToSave.push({ category: "pet", content: `Pets / Animals: ${petInfo.trim()}` });
    if (petPeeves.trim())
      memoriesToSave.push({ category: "dislike", content: `Pet Peeves / Dislikes: ${petPeeves.trim()}` });
    if (learningStyle)
      memoriesToSave.push({ category: "learning_style", content: `Learning Style: ${learningStyle}` });

    try {
      if (memoriesToSave.length > 0) {
        await saveUserMemories(memoriesToSave);
      }
      localStorage.setItem("neura_onboarding_completed", "true");
      toast({
        title: "Memory Profile Active! 🎉",
        description: "Neura has personalized your cognitive analogies, mental movies, and summaries.",
      });
      setIsSaving(false);
      setIsOpen(false);
      if (onClose) onClose();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Could not save memories",
        description: e?.message || "Please try again.",
      });
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight font-headline">
                Personalize Your Cognitive Memory
              </h2>
              <p className="text-xs text-purple-200">
                Step {step} of 3 • Customizing AI analogies to your life
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Skip for now"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-purple-100 w-full shrink-0">
          <div
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-purple-600" />
                  <span>Favorite Movies & TV Shows</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Used in <code>/see</code> mental movies (e.g. <em>Interstellar, 3 Idiots, Marvel, Breaking Bad</em>)
                </p>
                <input
                  type="text"
                  placeholder="e.g. Interstellar, Inception, 3 Idiots..."
                  value={favoriteMovie}
                  onChange={(e) => setFavoriteMovie(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-purple-600" />
                  <span>Favorite Games or Sports</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Used for competitive analogies (e.g. <em>Cricket, Chess, FIFA, Formula 1, Elden Ring</em>)
                </p>
                <input
                  type="text"
                  placeholder="e.g. Cricket, Chess, FIFA..."
                  value={favoriteGame}
                  onChange={(e) => setFavoriteGame(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-purple-600" />
                  <span>Favorite Music & Artists</span>
                </h3>
                <p className="text-xs text-stone-500">
                  e.g. <em>A.R. Rahman, Hans Zimmer, Coldplay, Anirudh</em>
                </p>
                <input
                  type="text"
                  placeholder="e.g. A.R. Rahman, Hans Zimmer..."
                  value={favoriteMusic}
                  onChange={(e) => setFavoriteMusic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Best Book You&apos;ve Ever Read</span>
                </h3>
                <p className="text-xs text-stone-500">
                  e.g. <em>Atomic Habits, Sapiens, Thinking Fast & Slow</em>
                </p>
                <input
                  type="text"
                  placeholder="e.g. Atomic Habits by James Clear..."
                  value={bestBook}
                  onChange={(e) => setBestBook(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-purple-600" />
                  <span>Favorite Foods & Comfort Drinks</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Used for sensory anchors (e.g. <em>Filter coffee, Chai, Dum Biryani, Pizza, Ramen</em>)
                </p>
                <input
                  type="text"
                  placeholder="e.g. Hyderabadi Dum Biryani & Filter Coffee..."
                  value={favoriteFood}
                  onChange={(e) => setFavoriteFood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span>Pets or Favorite Animals</span>
                </h3>
                <p className="text-xs text-stone-500">
                  e.g. <em>Golden Retriever named Bruno, Siamese cat, or Wolf</em>
                </p>
                <input
                  type="text"
                  placeholder="e.g. My golden retriever Bruno..."
                  value={petInfo}
                  onChange={(e) => setPetInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Best Life Moment / Achievement</span>
                </h3>
                <p className="text-xs text-stone-500">
                  A memorable milestone to anchor your highest-order memory palaces.
                </p>
                <input
                  type="text"
                  placeholder="e.g. Winning my first college hackathon with my best friends..."
                  value={bestMoment}
                  onChange={(e) => setBestMoment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-purple-600" />
                  <span>What You Hate / Biggest Pet Peeves</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Things the AI should avoid or use as negative contrast examples.
                </p>
                <input
                  type="text"
                  placeholder="e.g. Unnecessarily long theoretical lectures with zero examples..."
                  value={petPeeves}
                  onChange={(e) => setPetPeeves(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Preferred Learning Style</span>
                </h3>
                <select
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600 bg-white"
                >
                  <option value="Vivid mental movies and relatable everyday stories (/see)">
                    Vivid mental movies & everyday human stories (/see)
                  </option>
                  <option value="Direct, concise, and structured bullet points">
                    Direct, concise, and structured bullet points
                  </option>
                  <option value="Deep architectural memory palaces (/palace)">
                    Architectural memory palaces & spatial loci (/palace)
                  </option>
                  <option value="Feynman technique: explain like I am in 10th grade (/feynman)">
                    Feynman technique: simple analogies (/feynman)
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="rounded-xl text-xs flex items-center gap-1 text-stone-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              Skip for now
            </button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold px-4 flex items-center gap-1.5 shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAndFinish}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-5 flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? "Saving Memories..." : "Activate Memory Profile"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
