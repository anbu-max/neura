import Documents from "@/components/Documents";
import Link from "next/link";
import { Plus, Youtube, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function Dashboard() {
  return (
    <div className="h-full max-w-7xl mx-auto p-6 sm:p-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200/70 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
            <span>Document & Chat History</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Knowledge <span className="text-purple-600">History</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and continue your uploaded PDF conversations and video chats.
          </p>
        </div>

        {/* Quick Tool Links */}
        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700 gap-1.5 h-10 text-sm font-semibold"
          >
            <Link href="/dashboard/youtube">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>YouTube Chat</span>
            </Link>
          </Button>

          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-1.5 h-10 px-4 text-sm font-semibold shadow-xs"
          >
            <Link href="/dashboard/upload">
              <Plus className="w-4 h-4" />
              <span>Upload PDF</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <Documents />
    </div>
  );
}
export default Dashboard;
