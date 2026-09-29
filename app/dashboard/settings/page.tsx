"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Key,
  Brain,
  Moon,
  Sun,
  User,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Check,
  Loader2,
  FileText,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getUserSettings,
  saveUserSettings,
  getUserMemories,
  saveUserMemories,
  deleteUserMemory,
  uploadUserProfileFile,
  UserMemoryItem,
} from "@/actions/userSettings";
import OnboardingModal from "@/components/OnboardingModal";

export default function SettingsPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"memories" | "byok" | "appearance">("memories");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Settings State
  const [openAiKey, setOpenAiKey] = useState("");
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [region, setRegion] = useState("India / Global");
  const [darkMode, setDarkMode] = useState(false);

  // Memories State
  const [memories, setMemories] = useState<UserMemoryItem[]>([]);
  const [newMemoryCategory, setNewMemoryCategory] = useState("general");
  const [newMemoryContent, setNewMemoryContent] = useState("");
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploadingBio, setIsUploadingBio] = useState(false);
  const [manualBioText, setManualBioText] = useState("");

  // Load initial settings and memories
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [settingsData, mems] = await Promise.all([
          getUserSettings(),
          getUserMemories(),
        ]);

        if (settingsData) {
          setOpenAiKey(settingsData.openAiKey || "");
          setUseCustomKey(Boolean(settingsData.useCustomKey));
          setDisplayName(settingsData.displayName || "");
          setRegion(settingsData.region || "India / Global");
          setDarkMode(Boolean(settingsData.darkMode));
          if (settingsData.bio) setManualBioText(settingsData.bio);
        }

        setMemories(mems || []);

        // Sync dark mode class
        if (typeof window !== "undefined") {
          const isDark =
            localStorage.getItem("neura_dark_mode") === "true" ||
            Boolean(settingsData?.darkMode);
          setDarkMode(isDark);
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch (err) {
        console.warn("Could not load settings:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("neura_dark_mode", String(nextDark));
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    saveUserSettings({ darkMode: nextDark });
    toast({
      title: nextDark ? "Night Mode Enabled 🌙" : "Light Mode Enabled ☀️",
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const res = await saveUserSettings({
      openAiKey,
      useCustomKey,
      displayName,
      region,
      darkMode,
      bio: manualBioText,
    });
    setIsSaving(false);

    if (res.success) {
      toast({
        title: "Settings Saved! ✅",
        description: "Your API keys and preferences have been updated.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Could not save settings",
        description: res.error || "Please try again.",
      });
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryContent.trim()) return;

    setIsAddingMemory(true);
    const res = await saveUserMemories([
      { category: newMemoryCategory, content: newMemoryContent.trim() },
    ]);
    setIsAddingMemory(false);

    if (res.success) {
      setNewMemoryContent("");
      const updated = await getUserMemories();
      setMemories(updated);
      toast({
        title: "Memory Added! 🧠",
        description: "Neura will incorporate this into future cognitive analogies.",
      });
    }
  };

  const handleDeleteMemory = async (memId: string) => {
    await deleteUserMemory(memId);
    setMemories((prev) => prev.filter((m) => m.id !== memId));
    toast({
      title: "Memory Deleted",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBio(true);
    try {
      const text = await file.text();
      const res = await uploadUserProfileFile(text, file.name);
      if (res.success) {
        toast({
          title: "Profile Absorb Complete! 📖",
          description: `Extracted personal knowledge from "${file.name}".`,
        });
        const updated = await getUserMemories();
        setMemories(updated);
        setManualBioText(text.slice(0, 5000));
      } else {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: res.error || "Could not read file.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "File Error",
        description: err?.message || "Could not process text.",
      });
    } finally {
      setIsUploadingBio(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Onboarding Wizard Modal */}
      {showOnboarding && (
        <OnboardingModal
          forceOpen={true}
          onClose={async () => {
            setShowOnboarding(false);
            const updated = await getUserMemories();
            setMemories(updated);
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-stone-900">
              Settings & Memory Profile
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Manage your personal cognitive memory bank, Bring Your Own Key (BYOK), and preferences.
          </p>
        </div>

        <Button
          onClick={() => setShowOnboarding(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>Launch Onboarding Wizard</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("memories")}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "memories"
              ? "border-purple-600 text-purple-700 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Cognitive Memory Profile ({memories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("byok")}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "byok"
              ? "border-purple-600 text-purple-700 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Bring Your Own Key (BYOK)</span>
        </button>

        <button
          onClick={() => setActiveTab("appearance")}
          className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "appearance"
              ? "border-purple-600 text-purple-700 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Appearance & Persona</span>
        </button>
      </div>

      {/* TAB 1: COGNITIVE MEMORIES */}
      {activeTab === "memories" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Upload User Information / Moments File */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span>Upload Personal Information & Moments File</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Upload a <code>.txt</code> or <code>.md</code> file about yourself, your career, favorite moments, or pet details so Neura can deeply personalize all learning metaphors.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 cursor-pointer text-xs font-semibold text-purple-700 transition-colors">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>
                  {isUploadingBio
                    ? "Reading & Absorbing..."
                    : "Choose .txt, .md, or bio file"}
                </span>
                <input
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={handleFileUpload}
                  disabled={isUploadingBio}
                  className="hidden"
                />
              </label>
            </div>

            {manualBioText && (
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="text-[11px] font-bold text-stone-500 mb-1">
                  Current Absorbed Profile Summary:
                </div>
                <p className="text-xs text-stone-700 line-clamp-3">
                  {manualBioText}
                </p>
              </div>
            )}
          </div>

          {/* Add a Quick Memory Anchor */}
          <form
            onSubmit={handleAddMemory}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3"
          >
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>Add Custom Memory Anchor</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newMemoryCategory}
                onChange={(e) => setNewMemoryCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 focus:outline-none focus:border-purple-600 sm:w-44"
              >
                <option value="movie">Favorite Movie</option>
                <option value="game">Favorite Game / Sport</option>
                <option value="moment">Best Life Moment</option>
                <option value="book">Favorite Book</option>
                <option value="music">Music / Artist</option>
                <option value="food">Favorite Food</option>
                <option value="pet">Pet / Animal</option>
                <option value="dislike">Pet Peeve / Dislike</option>
                <option value="general">General Memory</option>
              </select>

              <input
                type="text"
                placeholder="e.g. Favorite Movie: Interstellar (loves space & time travel)"
                value={newMemoryContent}
                onChange={(e) => setNewMemoryContent(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-purple-600"
              />

              <Button
                type="submit"
                disabled={isAddingMemory || !newMemoryContent.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-4 h-9 shadow-2xs"
              >
                {isAddingMemory ? "Adding..." : "Add Memory"}
              </Button>
            </div>
          </form>

          {/* Active Memory Bank List */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Your Active Memory Bank ({memories.length})</span>
              </h3>
              <span className="text-xs text-stone-400">
                Used in /see, /palace, and teaching mode
              </span>
            </div>

            {memories.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                No memories recorded yet. Launch the Onboarding Wizard to personalize your AI!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-2 group hover:border-purple-300 transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 mb-1">
                        {mem.category}
                      </span>
                      <p className="text-xs text-stone-800 leading-snug">
                        {mem.content}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors shrink-0"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BRING YOUR OWN KEY (BYOK) */}
      {activeTab === "byok" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-600" />
                <span>Bring Your Own Key (OpenAI API Key)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter your personal OpenAI API Key to use GPT-4o with your own usage limits and billing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="useCustomKeyCheckbox"
                  checked={useCustomKey}
                  onChange={(e) => setUseCustomKey(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-stone-300"
                />
                <label
                  htmlFor="useCustomKeyCheckbox"
                  className="text-xs font-semibold text-stone-800 cursor-pointer"
                >
                  Enable my personal OpenAI API Key for completions & questions
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  OpenAI API Key (sk-...)
                </label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:border-purple-600"
                />
                <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Keys are securely stored in your personal account document.</span>
                </p>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-5 h-9"
              >
                {isSaving ? "Saving..." : "Save API Key"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPEARANCE & PERSONA */}
      {activeTab === "appearance" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-purple-600" />
              <span>Theme & Night Mode</span>
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    {darkMode ? "Night Mode Active" : "Light Mode Active"}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Toggle dark theme for comfortable nighttime reading.
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleToggleDarkMode}
                className="rounded-xl text-xs h-8 px-3 font-semibold"
              >
                Switch to {darkMode ? "Light Mode ☀️" : "Night Mode 🌙"}
              </Button>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Cultural Region for Analogies
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-purple-600 bg-white"
                >
                  <option value="India">India (Cricket, Bollywood, Chai, Local analogies)</option>
                  <option value="United States">United States (Pop culture, Hollywood, Marvel)</option>
                  <option value="United Kingdom">United Kingdom (British cultural anchors)</option>
                  <option value="Global">Global / Universal</option>
                </select>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-5 h-9"
              >
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
