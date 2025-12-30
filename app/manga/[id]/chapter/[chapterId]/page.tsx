"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Settings,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  LayoutPanelLeft,
  MousePointer2,
  Command,
  Sparkles,
  X,
  Globe,
  BookOpen,
  Layers,
} from "lucide-react";
import {
  getChapterPages,
  getPageUrl,
  getMangaChapters,
  type ChapterPages,
  type Chapter,
} from "@/lib/manga-api";

interface ChapterPageProps {
  params: { id: string; chapterId: string };
}

type ReadMode = "single" | "double" | "webtoon";

export default function ChapterReaderPage({ params }: ChapterPageProps) {
  const { id, chapterId } = params;
  const router = useRouter();

  const [pagesData, setPagesData] = React.useState<ChapterPages | null>(null);
  const [allChapters, setAllChapters] = React.useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(-1);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [readMode, setReadMode] = React.useState<ReadMode>("single");
  const [language, setLanguage] = React.useState<string>("en");
  const [showSettings, setShowSettings] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      getChapterPages(chapterId),
      getMangaChapters(id, ["en"]),
    ]).then(([pages, chapters]) => {
      setPagesData(pages);
      setAllChapters(chapters);
      const idx = chapters.findIndex((ch) => ch.id === chapterId);
      setCurrentChapterIndex(idx);
      setCurrentPage(0);
      setLoading(false);
    });
  }, [id, chapterId]);

  const currentChapter = allChapters[currentChapterIndex];
  const prevChapter = allChapters[currentChapterIndex - 1];
  const nextChapter = allChapters[currentChapterIndex + 1];

  const pageUrls = pagesData
    ? pagesData.pages.map((p) =>
      getPageUrl(pagesData.baseUrl, pagesData.hash, p, "data"),
    )
    : [];

  const nextPage = () => {
    if (currentPage < pageUrls.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else if (nextChapter) {
      router.push(`/manga/${id}/chapter/${nextChapter.id}`);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else if (prevChapter) {
      router.push(`/manga/${id}/chapter/${prevChapter.id}`);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
        }}
      >
        <div
          className="shimmer-bg"
          style={{ width: "60px", height: "60px", borderRadius: "50%" }}
        />
      </div>
    );
  }

  return (
    <div className="reader-container" ref={containerRef}>
      {/* Top Navigation Bar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link
            href={`/manga/${id}`}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 800,
                color: "var(--accent-primary)",
                letterSpacing: "2px",
              }}
            >
              NOW READING
            </span>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              CHAPTER {currentChapter?.chapter}
            </h2>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <button
            className="glass-effect"
            onClick={toggleFullscreen}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "10px",
              borderRadius: "12px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Maximize size={20} />
          </button>
          <button
            className="glass-effect"
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: showSettings ? "rgba(0, 255, 170, 0.2)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${showSettings ? "var(--accent-primary)" : "rgba(255,255,255,0.1)"}`,
              padding: "10px",
              borderRadius: "12px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "40px",
            zIndex: 101,
            background: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            minWidth: "300px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#fff"
              }}>
                READER SETTINGS
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Read Mode */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--text-dim)",
                marginBottom: "12px",
                letterSpacing: "1px"
              }}>
                <BookOpen size={14} style={{ display: "inline", marginRight: "6px" }} />
                READING MODE
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { value: "single", label: "Single Page" },
                  { value: "double", label: "Double Page (Book)" },
                  { value: "webtoon", label: "Webtoon (Scroll)" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setReadMode(mode.value as ReadMode)}
                    style={{
                      padding: "12px 16px",
                      background: readMode === mode.value
                        ? "rgba(0, 255, 170, 0.15)"
                        : "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${readMode === mode.value ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "8px",
                      color: readMode === mode.value ? "var(--accent-primary)" : "#fff",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Progress Dots */}
      <div style={{
        position: "fixed",
        left: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxHeight: "60vh",
        overflowY: "auto",
      }}>
        {pageUrls.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            style={{
              width: i === currentPage ? "12px" : "8px",
              height: i === currentPage ? "12px" : "8px",
              borderRadius: "50%",
              background: i === currentPage ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.3)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            title={`Page ${i + 1}`}
          />
        ))}
      </div>

      {/* Page Viewer */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          paddingTop: "80px",
          paddingBottom: "120px",
        }}
        onClick={(e) => {
          const x = e.clientX;
          const w = window.innerWidth;
          if (x < w * 0.3) prevPage();
          else if (x > w * 0.7) nextPage();
        }}
      >
        {readMode === "webtoon" ? (
          // Webtoon mode - show all pages vertically
          <div style={{ maxWidth: "800px", width: "100%" }}>
            {pageUrls.map((url, i) => (
              <Image
                key={i}
                src={url}
                alt={`Page ${i + 1}`}
                width={800}
                height={1200}
                style={{
                  width: "100%",
                  height: "auto",
                  marginBottom: "4px",
                }}
                unoptimized
              />
            ))}
          </div>
        ) : readMode === "double" && currentPage < pageUrls.length - 1 ? (
          // Double page mode
          <div style={{ display: "flex", gap: "8px" }}>
            <Image
              src={pageUrls[currentPage]}
              alt={`Page ${currentPage + 1}`}
              width={600}
              height={900}
              style={{
                width: "auto",
                height: "85vh",
                objectFit: "contain",
              }}
              unoptimized
            />
            <Image
              src={pageUrls[currentPage + 1]}
              alt={`Page ${currentPage + 2}`}
              width={600}
              height={900}
              style={{
                width: "auto",
                height: "85vh",
                objectFit: "contain",
              }}
              unoptimized
            />
          </div>
        ) : (
          // Single page mode
          <Image
            src={pageUrls[currentPage]}
            alt={`Page ${currentPage + 1}`}
            width={1000}
            height={1500}
            style={{
              width: "auto",
              height: "85vh",
              objectFit: "contain",
            }}
            priority
            unoptimized
          />
        )}
      </div>

      {/* Page Indicator - Moved to Top Right */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          padding: "8px 24px",
          borderRadius: "100px",
          fontWeight: 900,
          fontSize: "14px",
          letterSpacing: "2px",
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 255, 170, 0.3)",
          color: "var(--accent-primary)",
        }}
      >
        {currentPage + 1} / {pageUrls.length}
      </div>

      {/* Bottom Navigation - Redesigned */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          padding: "20px 40px",
          background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          display: "flex",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <button
          className="btn-premium btn-outline"
          onClick={prevPage}
          disabled={currentPage === 0 && !prevChapter}
          style={{
            padding: "14px 28px",
            fontSize: "14px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <SkipBack size={18} />
          PREVIOUS
        </button>

        <button
          className="btn-premium btn-fill"
          onClick={nextPage}
          style={{
            padding: "14px 28px",
            fontSize: "14px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          NEXT
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}
