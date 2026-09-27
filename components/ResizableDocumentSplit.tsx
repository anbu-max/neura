"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import PdfView from "./PdfView";
import Chat from "./Chat";
import { GripVertical } from "lucide-react";

interface ResizableDocumentSplitProps {
  id: string;
  url: string;
}

export default function ResizableDocumentSplit({
  id,
  url,
}: ResizableDocumentSplitProps) {
  const [pdfWidthPercent, setPdfWidthPercent] = useState<number>(55);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDragging = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const totalWidth = rect.width;

      if (totalWidth <= 0) return;

      const newPercent = (currentX / totalWidth) * 100;
      // Clamp between 25% and 75%
      const clamped = Math.min(75, Math.max(25, newPercent));
      setPdfWidthPercent(clamped);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[#FAF8F5] ${
        isDragging ? "select-none cursor-col-resize" : ""
      }`}
    >
      {/* Invisible overlay while dragging to prevent iframes from capturing mouse events */}
      {isDragging && (
        <div className="absolute inset-0 z-50 cursor-col-resize bg-transparent" />
      )}

      {/* Left Panel: PDF Viewer */}
      <div
        style={
          isDesktop
            ? { width: `${pdfWidthPercent}%`, flexShrink: 0 }
            : undefined
        }
        className="w-full h-1/2 lg:h-full overflow-hidden flex flex-col bg-[#F5F2EB]/40 transition-[width] duration-75"
      >
        <PdfView url={url} />
      </div>

      {/* Draggable Divider Handle (Desktop) */}
      <div
        onPointerDown={startDragging}
        className={`hidden lg:flex w-2.5 hover:w-3 active:w-3 bg-[#E7E2D8] hover:bg-purple-500 active:bg-purple-600 transition-all cursor-col-resize z-30 flex-shrink-0 items-center justify-center group ${
          isDragging ? "bg-purple-600 w-3 shadow-md" : ""
        }`}
        title="Drag left or right to resize PDF and Chat"
      >
        <div className="w-5 h-10 rounded-full bg-white border border-[#DCD5C8] shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-purple-300 transition-all pointer-events-none">
          <GripVertical className="w-3.5 h-3.5 text-[#78716C] group-hover:text-purple-600" />
        </div>
      </div>

      {/* Divider Line (Mobile) */}
      <div className="lg:hidden h-px bg-[#E7E2D8] w-full flex-shrink-0" />

      {/* Right Panel: AI Chat */}
      <div
        style={
          isDesktop
            ? { width: `${100 - pdfWidthPercent}%`, flexShrink: 0 }
            : undefined
        }
        className="w-full h-1/2 lg:h-full overflow-hidden flex flex-col bg-white flex-1 min-w-[280px] transition-[width] duration-75"
      >
        <Chat id={id} />
      </div>
    </div>
  );
}
