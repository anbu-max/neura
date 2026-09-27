"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  FileText,
  Youtube,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  History,
} from "lucide-react";
import UpgradeButton from "./UpgradeButton";

interface AppSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AppSidebar({ onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    if (onToggle) {
      onToggle();
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <aside
      className={`h-screen bg-[#FAF8F5] border-r border-[#E7E2D8] flex flex-col transition-all duration-300 ease-in-out select-none z-30 ${
        collapsed ? "w-16 min-w-[4rem]" : "w-60 min-w-[15rem]"
      }`}
    >
      {/* Top: Brand + New Document + Sidebar Toggle */}
      <div className="p-3 border-b border-[#E7E2D8] flex flex-col gap-2.5">
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/" className="flex items-center gap-2 group" title="Neura AI Home">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            {!collapsed && (
              <span className="font-headline font-black text-lg tracking-tight text-[#18181B]">
                Neura<span className="text-purple-600">AI</span>
              </span>
            )}
          </Link>
        </div>

        {/* Single "New Document" button */}
        <Link
          href="/dashboard/upload"
          className={`flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-headline font-bold rounded-xl py-2 px-3 shadow-xs hover:shadow transition-all text-sm ${
            collapsed ? "w-10 h-10 p-0 mx-auto" : "w-full"
          }`}
          title="Upload new PDF"
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>New Document</span>}
        </Link>

        {/* Sidebar Collapse/Expand Toggle (Moved below the plus icon) */}
        <button
          onClick={toggleCollapse}
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex items-center justify-center gap-2 text-xs font-medium text-[#78716C] hover:text-[#18181B] hover:bg-[#EFE9DD] rounded-lg py-1.5 transition-colors ${
            collapsed ? "w-10 h-8 mx-auto" : "w-full px-2"
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-headline font-semibold transition-colors ${
            pathname === "/dashboard"
              ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
              : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title="All Documents"
        >
          <History className="w-4 h-4 flex-shrink-0 text-[#78716C]" />
          {!collapsed && <span>All Documents</span>}
        </Link>

        <Link
          href="/dashboard/upload"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-headline font-semibold transition-colors ${
            pathname === "/dashboard/upload"
              ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
              : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title="Chat with PDF"
        >
          <FileText className="w-4 h-4 flex-shrink-0 text-purple-600" />
          {!collapsed && <span>Chat with PDF</span>}
        </Link>

        <Link
          href="/dashboard/youtube"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-headline font-semibold transition-colors ${
            pathname === "/dashboard/youtube"
              ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
              : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title="YouTube Chat"
        >
          <Youtube className="w-4 h-4 flex-shrink-0 text-red-600" />
          {!collapsed && <span>YouTube Chat</span>}
        </Link>

        <Link
          href="/dashboard/docs"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-headline font-semibold transition-colors ${
            pathname === "/dashboard/docs"
              ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
              : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title="Memory Commands"
        >
          <BookOpen className="w-4 h-4 flex-shrink-0 text-amber-600" />
          {!collapsed && <span>Memory Commands</span>}
        </Link>
      </div>

      {/* Footer: Upgrade */}
      <div className="p-3 border-t border-[#E7E2D8]">
        {!collapsed ? (
          <div className="p-3 bg-white border border-[#E7E2D8] rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              <span className="text-xs font-headline font-bold text-[#18181B]">
                Unlimited Memory
              </span>
            </div>
            <p className="text-[11px] text-[#57534E] font-caslon leading-tight mb-2.5">
              Enhanced retention & cognitive loci
            </p>
            <UpgradeButton />
          </div>
        ) : (
          <div className="flex justify-center">
            <UpgradeButton compact={true} />
          </div>
        )}
      </div>
    </aside>
  );
}
