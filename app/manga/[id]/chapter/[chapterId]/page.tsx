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
  X,
  Globe,
  BookOpen,
  Layers,
  Monitor,
  Book,
  Scroll,
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
  const [zoom, setZoom] = React.useState(100);
  const [cinemaMode, setCinemaMode] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLoading(true);
    const selectedLangs = language === "all" ? ["en", "ar", "ja"] : [language];
    Promise.all([
      getChapterPages(chapterId),
      getMangaChapters(id, selectedLangs),
    ]).then(([pages, chapters]) => {
      setPagesData(pages);
      setAllChapters(chapters);
      const idx = chapters.findIndex((ch) => ch.id === chapterId);
      setCurrentChapterIndex(idx);
      setCurrentPage(0);
      setLoading(false);
    });
  }, [id, chapterId, language]);

  const currentChapter = allChapters[currentChapterIndex];
  const prevChapter = allChapters[currentChapterIndex - 1];
  const nextChapter = allChapters[currentChapterIndex + 1];

  const pageUrls = pagesData
    ? pagesData.pages.map((p) =>
      getPageUrl(pagesData.baseUrl, pagesData.hash, p, "data"),
    )
    : [];

  const nextPage = () => {
    if (readMode === "double" && currentPage < pageUrls.length - 2) {
      setCurrentPage((prev) => prev + 2);
    } else if (currentPage < pageUrls.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else if (nextChapter) {
      router.push(`/manga/${id}/chapter/${nextChapter.id}`);
    }
  };

  const prevPage = () => {
    if (readMode === "double" && currentPage > 1) {
      setCurrentPage((prev) => prev - 2);
    } else if (currentPage > 0) {
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

  const toggleCinemaMode = () => {
    setCinemaMode(!cinemaMode);
    if (!cinemaMode) {
      setZoom(100);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "c" || e.key === "C") toggleCinemaMode();
      if (e.key === "+") setZoom((prev) => Math.min(prev + 10, 200));
      if (e.key === "-") setZoom((prev) => Math.max(prev - 10, 50));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, cinemaMode]);

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
    <div className="reader-container" ref={containerRef} style={{ background: cinemaMode ? "#0a0a0a" : "#000" }}>
      {/* Top Navigation Bar */}
      {!cinemaMode && (
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
              "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
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

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={toggleCinemaMode}
              style={{
                background: cinemaMode ? "rgba(0, 255, 170, 0.2)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${cinemaMode ? "var(--accent-primary)" : "rgba(255,255,255,0.1)"}`,
                padding: "10px",
                borderRadius: "12px",
                color: "#fff",
                cursor: "pointer",
              }}
              title="Cinema Mode (C)"
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={toggleFullscreen}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "10px",
                borderRadius: "12px",
                color: "#fff",
                cursor: "pointer",
              }}
              title="Fullscreen (F)"
            >
              <Maximize size={20} />
            </button>
            <button
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
      )}

      {/* Settings Panel */}
      {showSettings && !cinemaMode && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "40px",
            zIndex: 101,
            background: "rgba(0, 0, 0, 0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 255, 170, 0.2)",
            borderRadius: "20px",
            padding: "28px",
            minWidth: "340px",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(0, 255, 170, 0.1)",
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.5px"
            }}>
              ⚙️ SETTINGS
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Language Selection */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--text-dim)",
              marginBottom: "12px",
              letterSpacing: "1px"
            }}>
              <Globe size={16} />
              TRANSLATION
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { value: "en", label: "🇬🇧 English", icon: "🌍" },
                { value: "ar", label: "🇸🇦 Arabic", icon: "📖" },
                { value: "ja", label: "🇯🇵 Japanese", icon: "㊗️" },
                { value: "all", label: "🌐 All Languages", icon: "🗺️" },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  style={{
                    padding: "12px 16px",
                    background: language === lang.value
                      ? "rgba(0, 255, 170, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${language === lang.value ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "10px",
                    color: language === lang.value ? "var(--accent-primary)" : "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{lang.icon}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Read Mode */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--text-dim)",
              marginBottom: "12px",
              letterSpacing: "1px"
            }}>
              <BookOpen size={16} />
              READING MODE
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { value: "single", label: "Single Page", icon: "📄" },
                { value: "double", label: "Double Page (Book)", icon: "📖" },
                { value: "webtoon", label: "Webtoon (Scroll)", icon: "📜" },
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
                    borderRadius: "10px",
                    color: readMode === mode.value ? "var(--accent-primary)" : "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    textAlign: "left",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Control */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--text-dim)",
              marginBottom: "12px",
              letterSpacing: "1px"
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ZoomIn size={16} />
                ZOOM
              </span>
              <span style={{ color: "var(--accent-primary)" }}>{zoom}%</span>
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => setZoom(Math.max(zoom - 10, 50))}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={() => setZoom(100)}
                style={{
                  flex: 2,
                  padding: "10px",
                  background: "rgba(0, 255, 170, 0.1)",
                  border: "1px solid rgba(0, 255, 170, 0.3)",
                  borderRadius: "8px",
                  color: "var(--accent-primary)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "13px"
                }}
              >
                RESET
              </button>
              <button
                onClick={() => setZoom(Math.min(zoom + 10, 200))}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Progress Dots */}
      {!cinemaMode && (
        <div style={{
          position: "fixed",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "8px",
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "100px",
          backdropFilter: "blur(10px)"
        }}>
          {pageUrls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentPage(i);
              }}
              style={{
                width: i === currentPage ? "14px" : "10px",
                height: i === currentPage ? "14px" : "10px",
                borderRadius: "50%",
                background: i === currentPage
                  ? "var(--accent-primary)"
                  : i < currentPage
                    ? "rgba(0, 255, 170, 0.3)"
                    : "rgba(255, 255, 255, 0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                boxShadow: i === currentPage ? "0 0 10px rgba(0, 255, 170, 0.5)" : "none",
              }}
              title={`Page ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Page Viewer */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: cinemaMode ? "0" : "80px",
          paddingBottom: cinemaMode ? "0" : "120px",
        }}
        onClick={(e) => {
          if (cinemaMode) {
            const x = e.clientX;
            const w = window.innerWidth;
            if (x < w * 0.3) prevPage();
            else if (x > w * 0.7) nextPage();
          }
        }}
      >
        {readMode === "webtoon" ? (
          <div style={{ maxWidth: "900px", width: "100%" }}>
            {pageUrls.map((url, i) => (
              <Image
                key={i}
                src={url}
                alt={`Page ${i + 1}`}
                width={900}
                height={1350}
                style={{
                  width: `${zoom}%`,
                  height: "auto",
                  margin: "0 auto",
                  display: "block",
                }}
                unoptimized
              />
            ))}
          </div>
        ) : readMode === "double" && currentPage < pageUrls.length - 1 ? (
          <div style={{ display: "flex", gap: "16px", transform: `scale(${zoom / 100})` }}>
            <Image
              src={pageUrls[currentPage]}
              alt={`Page ${currentPage + 1}`}
              width={700}
              height={1050}
              style={{
                width: "auto",
                height: "88vh",
                objectFit: "contain",
              }}
              unoptimized
            />
            <Image
              src={pageUrls[currentPage + 1]}
              alt={`Page ${currentPage + 2}`}
              width={700}
              height={1050}
              style={{
                width: "auto",
                height: "88vh",
                objectFit: "contain",
              }}
              unoptimized
            />
          </div>
        ) : (
          <Image
            src={pageUrls[currentPage]}
            alt={`Page ${currentPage + 1}`}
            width={1200}
            height={1800}
            style={{
              width: "auto",
              height: cinemaMode ? "100vh" : "88vh",
              objectFit: "contain",
              transform: `scale(${zoom / 100})`,
            }}
            priority
            unoptimized
          />
        )}
      </div>

      {/* Page Indicator */}
      {!cinemaMode && (
        <div
          style={{
            position: "fixed",
            top: "85px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            padding: "10px 28px",
            borderRadius: "100px",
            fontWeight: 900,
            fontSize: "15px",
            letterSpacing: "2px",
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid rgba(0, 255, 170, 0.4)",
            color: "var(--accent-primary)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)"
          }}
        >
          {currentPage + 1} / {pageUrls.length}
        </div>
      )}

      {/* Bottom Navigation */}
      {!cinemaMode && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 90,
            display: "flex",
            gap: "16px",
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(20px)",
            padding: "16px 24px",
            borderRadius: "100px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)"
          }}
        >
          <button
            className="btn-premium btn-outline"
            onClick={prevPage}
            disabled={currentPage === 0 && !prevChapter}
            style={{
              padding: "14px 32px",
              fontSize: "14px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderRadius: "100px",
              letterSpacing: "1px"
            }}
          >
            <SkipBack size={18} />
            PREV
          </button>

          <button
            className="btn-premium btn-fill"
            onClick={nextPage}
            style={{
              padding: "14px 32px",
              fontSize: "14px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderRadius: "100px",
              letterSpacing: "1px"
            }}
          >
            NEXT
            <SkipForward size={18} />
          </button>
        </div>
      )}

      {/* Cinema Mode Hint */}
      {cinemaMode && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "rgba(0, 0, 0, 0.8)",
          padding: "12px 20px",
          borderRadius: "12px",
          fontSize: "12px",
          color: "var(--text-dim)",
          zIndex: 50,
          animation: "fadeIn 0.5s"
        }}>
          <div style={{ marginBottom: "4px", fontWeight: 600, color: "#fff" }}>🎬 Cinema Mode</div>
          <div>← Click Left | Click Right →</div>
          <div>Press C to exit</div>
        </div>
      )}
    </div>
  );
}
