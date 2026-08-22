import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, RefreshCw, Code, Sparkles, ExternalLink } from "lucide-react";

interface ClinicalHtmlRendererProps {
  htmlCode: string;
  className?: string;
  defaultHeight?: string;
}

export const ClinicalHtmlRenderer: React.FC<ClinicalHtmlRendererProps> = ({
  htmlCode,
  className = "",
  defaultHeight = "650px"
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(defaultHeight);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const rawCode = (htmlCode || "").trim();

  // Detect if HTML is an interactive web app / full document or contains JavaScript
  const isInteractiveApp = 
    /<script/i.test(rawCode) ||
    /<!DOCTYPE/i.test(rawCode) ||
    /<html/i.test(rawCode) ||
    /<head/i.test(rawCode) ||
    /onclick=/i.test(rawCode) ||
    /onload=/i.test(rawCode);

  useEffect(() => {
    if (isInteractiveApp && iframeRef.current) {
      // Refresh iframe content on code change
      try {
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(rawCode);
          doc.close();
        }
      } catch (err) {
        console.error("Iframe doc write error:", err);
      }
    }
  }, [rawCode, isInteractiveApp]);

  if (!rawCode) {
    return (
      <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
        هیچ کد HTML برای نمایش وجود ندارد.
      </div>
    );
  }

  // If it's an interactive HTML applet / full document with JS (e.g., Chart.js, Malamed Anesthesia Guide)
  if (isInteractiveApp) {
    return (
      <div className={`my-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl overflow-hidden transition-all ${isFullscreen ? "fixed inset-2 z-[99999] bg-slate-950 flex flex-col m-0 rounded-2xl" : "relative"}`}>
        {/* Top Control Bar for Interactive HTML App */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-white text-[11px] sm:text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              برنامه تعاملی و ویجت هوشمند HTML5
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-mono rounded-md border border-emerald-500/30">
              JS Executable
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (iframeRef.current) {
                  const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                  if (doc) {
                    doc.open();
                    doc.write(rawCode);
                    doc.close();
                  }
                }
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="بارگذاری مجدد برنامه"
            >
              <RefreshCw className="w-3 h-3 text-emerald-400" />
              بازنشانی
            </button>
            
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3 h-3 text-amber-400" /> خروج از حالت بزرگ‌نما
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3 text-teal-400" /> تمام‌صفحه
                </>
              )}
            </button>
          </div>
        </div>

        {/* Iframe Viewport Container */}
        <div className={`w-full bg-white transition-all ${isFullscreen ? "flex-1 h-full" : ""}`}>
          <iframe
            ref={iframeRef}
            title="Interactive Clinical App"
            srcDoc={rawCode}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            className="w-full border-none transition-all"
            style={{
              height: isFullscreen ? "100%" : iframeHeight,
              minHeight: isFullscreen ? "100%" : "550px"
            }}
          />
        </div>
      </div>
    );
  }

  // Standard static HTML markup (tables, styled divs, blockquotes)
  return (
    <div 
      className={`my-4 overflow-x-auto text-xs md:text-sm leading-relaxed html-render-content ${className}`}
      dangerouslySetInnerHTML={{ __html: rawCode }}
    />
  );
};
