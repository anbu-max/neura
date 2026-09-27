"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
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

function PdfView({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"canvas" | "native">("canvas");
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!url) return;
    let isMounted = true;

    const fetchFile = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load PDF");
        const blob = await response.blob();
        if (isMounted) {
          setFile(blob);
        }
      } catch (e) {
        console.error("Failed to fetch PDF:", e);
        if (isMounted) {
          setViewMode("native");
        }
      }
    };

    fetchFile();

    // Safety fallback: if Canvas doesn't render within 3.5s, switch to native viewer
    const timer = setTimeout(() => {
      if (isMounted && !isLoaded) {
        setViewMode("native");
      }
    }, 3500);

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
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
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
                onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
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

      {/* Main PDF Display Area */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
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
            className="flex flex-col items-center shadow-lg rounded-xl overflow-hidden bg-white"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-md"
            />
          </Document>
        )}
      </div>
    </div>
  );
}

export default PdfView;
