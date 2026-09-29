import { Suspense } from "react";
import Documents from "@/components/Documents";
import Link from "next/link";
import { Plus, Youtube, FileText, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 15;

function DocumentsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-44 rounded-2xl bg-white border border-gray-100 p-5 shadow-2xs animate-pulse flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50" />
            <div className="w-12 h-5 rounded-md bg-gray-100" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="h-8 bg-gray-50 rounded-xl border border-gray-100" />
        </div>
      ))}
    </div>
  );
}

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

      {/* Documents Grid with Streaming Suspense */}
      <Suspense fallback={<DocumentsLoadingSkeleton />}>
        <Documents />
      </Suspense>
    </div>
  );
}
export default Dashboard;
