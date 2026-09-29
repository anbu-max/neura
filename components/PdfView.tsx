"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Loader2Icon,
  RotateCw,
  ZoomInIcon,
  ZoomOutIcon,
  FileText,
  ExternalLink,
  MonitorPlay,
  Layers,
} from "lucide-react";

// Use local worker for zero cross-origin issues & instant offline/localhost loading
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PdfPageItemProps {
  pageNumber: number;
  scale: number;
  onVisible: (page: number) => void;
}

function PdfPageItem({ pageNumber, scale, onVisible }: PdfPageItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(pageNumber === 1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Observer 1: Render when within 700px of viewport for smooth scrolling
    const renderObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
        }
      },
      { rootMargin: "700px 0px 700px 0px" }
    );
    renderObserver.observe(el);

    // Observer 2: Update active page counter when page is prominently in view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(pageNumber);
        }
      },
      { threshold: 0.25 }
    );
    visibilityObserver.observe(el);

    return () => {
      renderObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [pageNumber, onVisible]);

  return (
    <div
      id={`pdf-page-${pageNumber}`}
      ref={containerRef}
      className="mb-5 transition-all flex flex-col items-center justify-center rounded-xl overflow-hidden shadow-lg bg-white border border-[#E7E2D8]/80"
      style={{
        minHeight: `${650 * scale}px`,
        width: "fit-content",
      }}
    >
      {shouldRender ? (
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={false}
          loading={
            <div
              className="flex flex-col items-center justify-center text-gray-400 text-xs font-mono bg-white"
              style={{
                height: `${650 * scale}px`,
                width: `${460 * scale}px`,
              }}
            >
              <Loader2Icon className="animate-spin h-6 w-6 text-purple-600 mb-2" />
              <span>Loading Page {pageNumber}...</span>
            </div>
          }
        />
      ) : (
        <div
          className="flex flex-col items-center justify-center text-gray-300 text-xs font-mono bg-[#FAF8F5]/50"
          style={{
            height: `${650 * scale}px`,
            width: `${460 * scale}px`,
          }}
        >
          <span>Page {pageNumber}</span>
        </div>
      )}
    </div>
  );
}

function PdfView({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<string | Blob | null>(url);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"canvas" | "native">("canvas");
  const [hasError, setHasError] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url) return;
    setFile(url);
    let isMounted = true;

    // Fallback: If URL doesn't stream directly, fetch as blob
    const fetchFileFallback = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load PDF");
        const blob = await response.blob();
        if (isMounted) {
          setFile(blob);
        }
      } catch (e) {
        console.error("PDF load warning:", e);
      }
    };

    // If canvas doesn't report load success within 4s, trigger fallback or native view
    const timer = setTimeout(() => {
      if (isMounted && !isLoaded) {
        fetchFileFallback();
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [url, isLoaded]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setIsLoaded(true);
    setHasError(false);
  };

  const onDocumentLoadError = (err: Error): void => {
    console.warn("react-pdf failed to load, switching to native viewer:", err);
    setHasError(true);
    setViewMode("native");
  };

  const handlePageVisible = useCallback((p: number) => {
    setPageNumber(p);
  }, []);

  const scrollToPage = (target: number) => {
    if (!numPages) return;
    const clamped = Math.max(1, Math.min(numPages, target));
    setPageNumber(clamped);
    const targetElement = document.getElementById(`pdf-page-${clamped}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
      {/* Top Toolbar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E7E2D8] px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        {/* Page navigation & Mode */}
        <div className="flex items-center gap-1.5">
          {viewMode === "canvas" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs rounded-lg border-[#E7E2D8] text-[#57534E] hover:text-[#18181B]"
                disabled={pageNumber <= 1}
                onClick={() => scrollToPage(pageNumber - 1)}
              >
                Previous
              </Button>

              <span className="text-xs font-mono font-medium text-[#78716C] px-2">
                {pageNumber} / {numPages || "..."}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs rounded-lg border-[#E7E2D8] text-[#57534E] hover:text-[#18181B]"
                disabled={!numPages || pageNumber >= numPages}
                onClick={() => scrollToPage(pageNumber + 1)}
              >
                Next
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-headline font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Native Browser Engine</span>
            </div>
          )}
        </div>

        {/* Zoom & Rotation controls */}
        <div className="flex items-center gap-1">
          {viewMode === "canvas" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg border-[#E7E2D8] text-[#57534E] hover:text-[#18181B]"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg border-[#E7E2D8] text-[#57534E] hover:text-[#18181B]"
                disabled={scale >= 2.0}
                onClick={() => setScale((s) => Math.min(2.0, s * 1.15))}
                title="Zoom In"
              >
                <ZoomInIcon className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg border-[#E7E2D8] text-[#57534E] hover:text-[#18181B]"
                disabled={scale <= 0.6}
                onClick={() => setScale((s) => Math.max(0.6, s / 1.15))}
                title="Zoom Out"
              >
                <ZoomOutIcon className="w-3.5 h-3.5" />
              </Button>
            </>
          )}

          {/* Switch Viewer Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode((m) => (m === "canvas" ? "native" : "canvas"))}
            className="h-8 px-2.5 text-xs rounded-lg border-[#E7E2D8] text-purple-700 hover:bg-purple-50 flex items-center gap-1.5"
            title={viewMode === "canvas" ? "Switch to Native Viewer" : "Switch to Enhanced View"}
          >
            {viewMode === "canvas" ? (
              <>
                <MonitorPlay className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Native View</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enhanced View</span>
              </>
            )}
          </Button>

          {/* Open Raw PDF In New Tab */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 w-8 p-0 rounded-lg text-[#78716C] hover:text-[#18181B]"
            title="Open original PDF in new tab"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Main PDF Display Area with Smooth Continuous Scroll */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto p-4 flex justify-center items-start scroll-smooth"
      >
        {viewMode === "native" ? (
          <div className="w-full h-full min-h-[calc(100vh-120px)] rounded-2xl overflow-hidden border border-[#E7E2D8] shadow-sm bg-white">
            <iframe
              src={`${url}#toolbar=1&navpanes=0`}
              className="w-full h-full min-h-[calc(100vh-120px)] border-none"
              title="PDF Document Native View"
            />
          </div>
        ) : !file ? (
          <div className="flex flex-col items-center justify-center p-12 mt-16 text-center space-y-3">
            <Loader2Icon className="animate-spin h-10 w-10 text-purple-600" />
            <p className="text-sm font-headline font-bold text-gray-700">Loading document...</p>
            <p className="text-xs text-gray-400">Rendering preview directly on device</p>
          </div>
        ) : (
          <Document
            file={file}
            rotate={rotation}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center p-12 mt-16 text-center space-y-3">
                <Loader2Icon className="animate-spin h-10 w-10 text-purple-600" />
                <p className="text-sm font-headline font-bold text-gray-700">Preparing PDF pages...</p>
              </div>
            }
            className="flex flex-col items-center w-full"
          >
            <div className="flex flex-col items-center w-full pb-12">
              {Array.from(new Array(numPages || 0), (_, index) => (
                <PdfPageItem
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                  onVisible={handlePageVisible}
                />
              ))}
            </div>
          </Document>
        )}
      </div>
    </div>
  );
}

export default PdfView;
