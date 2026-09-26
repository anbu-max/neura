"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MessageSquare,
  Plus,
  History,
  FileText,
  Youtube,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Folder,
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
        collapsed ? "w-20 min-w-[5rem]" : "w-64 min-w-[16rem]"
      }`}
    >
      {/* Top Header: Brand + Collapse Toggle + New Button */}
      <div className="p-4 border-b border-[#E7E2D8] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Logo Mark */}
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            {!collapsed && (
              <span className="font-headline font-black text-xl tracking-tight text-[#18181B] group-hover:text-purple-600 transition-colors whitespace-nowrap">
                Chat<span className="text-purple-600">PDF</span>
              </span>
            )}
          </Link>

          <button
            onClick={toggleCollapse}
            type="button"
            aria-label="Toggle sidebar"
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#18181B] hover:bg-[#EFE9DD] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-[#18181B]" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-[#78716C]" />
            )}
          </button>
        </div>

        {/* "+ New" Action Button */}
        <Link
          href="/dashboard/upload"
          className={`flex items-center justify-center gap-2 bg-white border border-[#E7E2D8] hover:border-purple-500 hover:text-purple-700 text-[#18181B] font-headline font-bold rounded-xl py-2 px-3 shadow-2xs hover:shadow-xs transition-all duration-200 text-xs sm:text-sm group ${
            collapsed ? "px-1" : ""
          }`}
          title="Start new chat"
        >
          <Plus className="w-4 h-4 text-purple-600 group-hover:rotate-90 transition-transform duration-200" />
          {!collapsed && <span>New Document</span>}
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Section: Chats */}
        <div>
          {!collapsed ? (
            <div className="flex items-center gap-2 text-[11px] font-headline font-bold text-[#78716C] uppercase tracking-wider px-3 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#78716C]" />
              <span>Chats</span>
            </div>
          ) : (
            <div className="flex justify-center mb-2" title="Chats">
              <MessageSquare className="w-4 h-4 text-[#78716C]" />
            </div>
          )}

          <div className="space-y-1">
            <Link
              href="/dashboard/upload"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-headline font-semibold transition-all ${
                pathname === "/dashboard/upload"
                  ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
                  : "text-[#57534E] hover:text-purple-700 hover:bg-[#F5F1E8]"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title="Start your first chat"
            >
              <Plus className="w-4 h-4 flex-shrink-0 text-purple-600" />
              {!collapsed && (
                <span className="truncate">Start your first chat</span>
              )}
            </Link>
          </div>
        </div>

        {/* Section: History */}
        <div>
          {!collapsed ? (
            <div className="flex items-center gap-2 text-[11px] font-headline font-bold text-[#78716C] uppercase tracking-wider px-3 mb-2">
              <Folder className="w-3.5 h-3.5 text-[#78716C]" />
              <span>History</span>
            </div>
          ) : (
            <div className="flex justify-center mb-2" title="History">
              <History className="w-4 h-4 text-[#78716C]" />
            </div>
          )}

          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-headline font-semibold transition-colors ${
                pathname === "/dashboard"
                  ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
                  : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title="Documents History"
            >
              <FileText className="w-4 h-4 flex-shrink-0 text-[#78716C]" />
              {!collapsed && <span className="truncate">All Documents</span>}
            </Link>
          </div>
        </div>

        {/* Section: Tools */}
        <div>
          {!collapsed ? (
            <div className="text-[11px] font-headline font-bold text-[#78716C] uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
              <span>Tools</span>
            </div>
          ) : (
            <div className="h-px bg-[#E7E2D8] my-2" />
          )}

          <div className="space-y-1">
            {/* Tool 1: Chat with PDF */}
            <Link
              href="/dashboard/upload"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-headline font-semibold transition-colors ${
                pathname === "/dashboard/upload"
                  ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
                  : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title="Chat with PDF"
            >
              <FileText className="w-4 h-4 flex-shrink-0 text-purple-600" />
              {!collapsed && <span>Chat with PDF</span>}
            </Link>

            {/* Tool 2: Chat with YouTube Videos */}
            <Link
              href="/dashboard/youtube"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-headline font-semibold transition-colors ${
                pathname === "/dashboard/youtube"
                  ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
                  : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title="YouTube Chat"
            >
              <Youtube className="w-4 h-4 flex-shrink-0 text-red-600" />
              {!collapsed && <span>YouTube Chat</span>}
            </Link>

            {/* Tool 3: Memory Techniques Docs */}
            <Link
              href="/dashboard/docs"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-headline font-semibold transition-colors ${
                pathname === "/dashboard/docs"
                  ? "bg-[#EFE9DD] text-[#18181B] font-bold border border-[#DCD5C8]"
                  : "text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#18181B]"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title="Memory Techniques & Slash Commands"
            >
              <BookOpen className="w-4 h-4 flex-shrink-0 text-amber-600" />
              {!collapsed && <span>Memory Commands</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer / Unlimited Memory & Upgrade */}
      <div className="p-3 border-t border-[#E7E2D8] bg-[#FAF8F5]">
        {!collapsed ? (
          <div className="p-3 bg-white border border-[#E7E2D8] rounded-2xl relative overflow-hidden shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              <span className="text-xs font-headline font-bold text-[#18181B]">
                Unlimited Memory
              </span>
            </div>
            <p className="text-[11px] text-[#57534E] font-caslon leading-tight mb-2.5">
              Enhanced retention & cognitive loci recall
            </p>
            <div className="w-full">
              <UpgradeButton />
            </div>
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
