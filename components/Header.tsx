"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { FilePlus2, Sparkles, Home, ChevronRight } from "lucide-react";
import UpgradeButton from "./UpgradeButton";

function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "History";
    if (pathname === "/dashboard/upload") return "Upload PDF";
    if (pathname === "/dashboard/youtube") return "YouTube Chat";
    if (pathname === "/dashboard/docs") return "Memory Commands & Documentation";
    if (pathname === "/dashboard/settings") return "Settings & Memory Profile";
    if (pathname === "/dashboard/upgrade") return "Upgrade to Pro";
    if (pathname.startsWith("/dashboard/files/")) return "Chat with Document";
    return "Dashboard";
  };

  return (
    <header className="flex items-center justify-between bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2D8] px-6 py-3.5 sticky top-0 z-20 font-futura tracking-tight">
      <div className="flex items-center gap-4">
        {/* On Landing Page: Show full Brand */}
        {!isDashboard ? (
          <>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="font-headline font-extrabold text-xl tracking-tight text-[#18181B]">
                Neura<span className="text-purple-600"> AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-headline font-semibold text-[#57534E] ml-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-[#EFE9DD] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/50 transition-colors"
              >
                Chats & History
              </Link>
              <Link
                href="/dashboard/docs"
                className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/50 transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/dashboard/upgrade"
                className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/50 transition-colors"
              >
                Pricing
              </Link>
            </nav>
          </>
        ) : (
          /* In Dashboard: Show Breadcrumb */
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-purple-600 flex items-center gap-1 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="font-semibold text-gray-800">{getPageTitle()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SignedIn>
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl h-9 px-3 gap-1.5 font-medium text-sm"
          >
            <Link href="/dashboard/upload">
              <FilePlus2 className="w-4 h-4 text-purple-600" />
              <span>New PDF</span>
            </Link>
          </Button>

          <UpgradeButton />

          <div className="pl-1">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm px-4 h-9 text-sm font-semibold font-futura tracking-tight"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}
export default Header;
