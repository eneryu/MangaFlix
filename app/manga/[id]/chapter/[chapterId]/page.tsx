"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  X,
  Globe,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Monitor,
  Book,
  Scroll,
  FileText,
} from "lucide-react";
import {
  getChapterPages,
  getPageUrl,
  getMangaChapters,
  getMangaDetails,
  type ChapterPages,
  type Chapter,
  type Manga,
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
  const [mangaDetails, setMangaDetails] = React.useState<Manga | null>(null);
  const [availableLanguages, setAvailableLanguages] = React.useState<string[]>([]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Load manga details to get available languages
  React.useEffect(() => {
    getMangaDetails(id).then((manga) => {
      if (manga) {
        setMangaDetails(manga);
        setAvailableLanguages(manga.availableLanguages || ["en"]);
      }
    });
  }, [id]);

  React.useEffect(() => {
    setLoading(true);
    const selectedLangs = language === "all"
      ? availableLanguages
      : [language];

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
  }, [id, chapterId, language, availableLanguages]);

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

  // Language display names
  const languageNames: Record<string, { name: string; flag: string }> = {
    en: { name: "English", flag: "🇬🇧" },
    ar: { name: "العربية", flag: "🇸🇦" },
    ja: { name: "日本語", flag: "🇯🇵" },
    es: { name: "Español", flag: "🇪🇸" },
    fr: { name: "Français", flag: "🇫🇷" },
    de: { name: "Deutsch", flag: "🇩🇪" },
    pt: { name: "Português", flag: "🇵🇹" },
    it: { name: "Italiano", flag: "🇮🇹" },
    ru: { name: "Русский", flag: "🇷🇺" },
    zh: { name: "中文", flag: "🇨🇳" },
    ko: { name: "한국어", flag: "🇰🇷" },
  };

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

      {/* Settings Panel - Redesigned with Grid */}
      {showSettings && !cinemaMode && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "40px",
            zIndex: 101,
            background: "rgba(6, 7, 10, 0.98)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(0, 255, 170, 0.2)",
            borderRadius: "24px",
            padding: "32px",
            width: "420px",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(0, 255, 170, 0.1)",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Settings size={24} style={{ color: "var(--accent-primary)" }} />
              <h3 style={{
                fontSize: "22px",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.5px"
              }}>
                Reader Settings
              </h3>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                color: "#fff",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s"
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Language Selection */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--text-dim)",
              marginBottom: "16px",
              letterSpacing: "1.5px",
              textTransform: "uppercase"
            }}>
              <Globe size={16} />
              Translation
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px"
            }}>
              {availableLanguages.map((lang) => {
                const langInfo = languageNames[lang] || { name: lang.toUpperCase(), flag: "🌐" };
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    style={{
                      padding: "14px 16px",
                      background: language === lang
                        ? "linear-gradient(135deg, rgba(0, 255, 170, 0.15), rgba(0, 184, 255, 0.15))"
                        : "rgba(255, 255, 255, 0.03)",
                      border: `1.5px solid ${language === lang ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.08)"}`,
                      borderRadius: "12px",
                      color: language === lang ? "#fff" : "var(--text-dim)",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 700,
                      textAlign: "left",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{langInfo.flag}</span>
                    <span>{langInfo.name}</span>
                  </button>
                );
              })}
              {/* All Languages Option */}
              <button
                onClick={() => setLanguage("all")}
                style={{
                  padding: "14px 16px",
                  background: language === "all"
                    ? "linear-gradient(135deg, rgba(0, 255, 170, 0.15), rgba(0, 184, 255, 0.15))"
                    : "rgba(255, 255, 255, 0.03)",
                  border: `1.5px solid ${language === "all" ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.08)"}`,
                  borderRadius: "12px",
                  color: language === "all" ? "#fff" : "var(--text-dim)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  gridColumn: availableLanguages.length % 2 === 0 ? "span 2" : "auto"
                }}
              >
                <Globe size={20} />
                <span>All Available</span>
              </button>
            </div>
          </div>

          {/* Read Mode */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--text-dim)",
              marginBottom: "16px",
              letterSpacing: "1.5px",
              textTransform: "uppercase"
            }}>
              <BookOpen size={16} />
              Reading Mode
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {[
                { value: "single", label: "Single Page", icon: FileText, desc: "One page at a time" },
                { value: "double", label: "Double Page", icon: Book, desc: "Two pages like a book" },
                { value: "webtoon", label: "Webtoon Scroll", icon: Scroll, desc: "Continuous scrolling" },
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    onClick={() => setReadMode(mode.value as ReadMode)}
                    style={{
                      padding: "16px 18px",
                      background: readMode === mode.value
                        ? "linear-gradient(135deg, rgba(0, 255, 170, 0.15), rgba(0, 184, 255, 0.15))"
                        : "rgba(255, 255, 255, 0.03)",
                      border: `1.5px solid ${readMode === mode.value ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.08)"}`,
                      borderRadius: "12px",
                      color: readMode === mode.value ? "#fff" : "var(--text-dim)",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 700,
                      textAlign: "left",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <Icon size={22} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div>{mode.label}</div>
                      <div style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        opacity: 0.7,
                        marginTop: "2px"
                      }}>
                        {mode.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom Control */}
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: 800,
              color: "var(--text-dim)",
              marginBottom: "16px",
              letterSpacing: "1.5px",
              textTransform: "uppercase"
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ZoomIn size={16} />
                Zoom Level
              </span>
              <span style={{
                color: "var(--accent-primary)",
                fontSize: "16px",
                fontWeight: 900
              }}>
                {zoom}%
              </span>
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              gap: "10px",
              alignItems: "center"
            }}>
              <button
                onClick={() => setZoom(Math.max(zoom - 10, 50))}
                style={{
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={() => setZoom(100)}
                style={{
                  padding: "12px",
                  background: "linear-gradient(135deg, rgba(0, 255, 170, 0.15), rgba(0, 184, 255, 0.15))",
                  border: "1px solid rgba(0, 255, 170, 0.3)",
                  borderRadius: "10px",
                  color: "var(--accent-primary)",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: "14px",
                  letterSpacing: "1px",
                  transition: "all 0.2s"
                }}
              >
                RESET
              </button>
              <button
                onClick={() => setZoom(Math.min(zoom + 10, 200))}
                style={{
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}
              >
                <ZoomIn size={20} />
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
          padding: "12px 8px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "100px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.05)"
        }}>
          {pageUrls.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: i === currentPage ? "14px" : "10px",
                height: i === currentPage ? "14px" : "10px",
                borderRadius: "50%",
                background: i === currentPage
                  ? "var(--accent-primary)"
                  : i < currentPage
                    ? "rgba(0, 255, 170, 0.3)"
                    : "rgba(255, 255, 255, 0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                boxShadow: i === currentPage ? "0 0 12px rgba(0, 255, 170, 0.6)" : "none",
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
            padding: "12px 32px",
            borderRadius: "100px",
            fontWeight: 900,
            fontSize: "16px",
            letterSpacing: "2px",
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(0, 255, 170, 0.4)",
            color: "var(--accent-primary)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 170, 0.2)"
          }}
        >
          {currentPage + 1} / {pageUrls.length}
        </div>
      )}

      {/*Bottom Navigation */}
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
          background: "rgba(0, 0, 0, 0.9)",
          padding: "16px 24px",
          borderRadius: "16px",
          fontSize: "13px",
          color: "var(--text-dim)",
          zIndex: 50,
          border: "1px solid rgba(0, 255, 170, 0.2)"
        }}>
          <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Monitor size={16} />
            Cinema Mode Active
          </div>
          <div style={{ fontSize: "12px" }}>← Click Left | Click Right →</div>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>Press C to exit</div>
        </div>
      )}
    </div>
  );
}
