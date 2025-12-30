"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Plus,
  Heart,
  Share2,
  Star,
  Clock,
  ChevronRight,
  ArrowLeft,
  Info,
  Sparkles,
  Command,
  Layers,
  Bookmark,
  User as UserIcon,
  ShieldCheck,
  Share,
} from "lucide-react";
import {
  getMangaDetails,
  getMangaChapters,
  getPopularManga,
  type Manga,
  type Chapter,
} from "@/lib/manga-api";
import Navbar from "@/components/Navbar";
import MangaCard from "@/components/MangaCard";

// Helper to summarize description
const summarize = (text: string, length: number = 300) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

function DetailPoster({ manga }: { manga: Manga }) {
  return (
    <div
      className="hero-poster-wrapper reveal-up"
      style={{ maxWidth: "380px" }}
    >
      <div className="hero-poster-card" style={{ transform: "none" }}>
        <Image
          src={manga.coverUrl}
          alt={manga.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "-20px",
          padding: "8px 16px",
          background: "var(--accent-primary)",
          color: "#000",
          fontWeight: 900,
          borderRadius: "4px",
          transform: "rotate(-5deg)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
          fontSize: "14px",
          letterSpacing: "1px",
        }}
      >
        TOP RATED
      </div>
    </div>
  );
}

function ChapterCardCreative({
  chapter,
  mangaId,
}: {
  chapter: Chapter;
  mangaId: string;
}) {
  return (
    <Link
      href={`/manga/${mangaId}/chapter/${chapter.id}`}
      className="glass-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "16px",
        borderRadius: "16px",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          background: "rgba(0, 255, 170, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-primary)",
        }}
      >
        <Play size={24} fill="currentColor" />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
          CHAPTER {chapter.chapter}
        </h4>
        <div
          style={{
            display: "flex",
            gap: "12px",
            fontSize: "12px",
            color: "var(--text-dim)",
            marginTop: "4px",
          }}
        >
          <span>
            {new Date(chapter.publishedAt).toLocaleDateString().toUpperCase()}
          </span>
          <span>•</span>
          <span>{chapter.pages || 0} PAGES</span>
        </div>
      </div>
      <ChevronRight size={18} style={{ color: "var(--text-dim)" }} />
    </Link>
  );
}

export default function MangaPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [manga, setManga] = React.useState<Manga | null>(null);
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [related, setRelated] = React.useState<Manga[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<
    "chapters" | "info" | "related"
  >("chapters");

  React.useEffect(() => {
    Promise.all([
      getMangaDetails(id),
      getMangaChapters(id, ["en", "ar"]),
      getPopularManga(10),
    ])
      .then(([mangaData, chaptersData, relatedData]) => {
        setManga(mangaData);
        setChapters(chaptersData);
        setRelated(relatedData.filter((m) => m.id !== id).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-deep)",
        }}
      >
        <div
          className="shimmer-bg"
          style={{ width: "60px", height: "60px", borderRadius: "50%" }}
        />
      </div>
    );
  }

  if (!manga) return null;

  return (
    <div className="detail-view-container">
      <Navbar />

      {/* Dynamic Immersive Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
        <Image
          src={manga.coverUrl}
          alt=""
          fill
          style={{
            objectFit: "cover",
            filter: "blur(100px) opacity(0.3) saturate(1.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, transparent, var(--bg-deep) 80%)",
          }}
        />
      </div>

      <div
        className="main-container"
        style={{ position: "relative", zIndex: 10 }}
      >
        {/* Breadcrumbs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "40px",
            color: "var(--text-dim)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            EXPLORE
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--text-main)" }}>
            {manga.title.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "80px",
            marginBottom: "100px",
          }}
        >
          {/* Left Column: Visuals */}
          <div className="reveal-up">
            <DetailPoster manga={manga} />
            <div
              style={{
                marginTop: "40px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <button
                className="btn-premium btn-fill"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Bookmark size={18} />
                COLLECTION
              </button>
              <button
                className="btn-premium btn-outline"
                style={{ padding: "16px" }}
              >
                <Share size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="reveal-up" style={{ animationDelay: "0.1s" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <span className="hero-label" style={{ marginBottom: 0 }}>
                {manga.status.toUpperCase()}
              </span>
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  background: "var(--text-dark)",
                  borderRadius: "50%",
                }}
              />
              <span
                style={{
                  color: "var(--text-dim)",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {manga.year || "2024"}
              </span>
            </div>

            <h1
              style={{
                fontSize: "4.5rem",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-3px",
                marginBottom: "16px",
                color: "#fff",
              }}
            >
              {manga.title}
            </h1>

            {manga.titleAr && (
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "var(--accent-primary)",
                  fontWeight: 700,
                  marginBottom: "24px",
                  letterSpacing: "1px",
                }}
              >
                {manga.titleAr}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "32px",
              }}
            >
              {manga.genres.map((g, i) => (
                <span
                  key={i}
                  className="glass-effect"
                  style={{
                    padding: "6px 16px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-dim)",
                  }}
                >
                  {g.toUpperCase()}
                </span>
              ))}
            </div>

            <p
              style={{
                fontSize: "1.2rem",
                lineHeight: 1.6,
                color: "var(--text-dim)",
                maxWidth: "750px",
                marginBottom: "48px",
              }}
            >
              {summarize(
                manga.description ||
                  "Enter a realm of unparalleled storytelling. This series invites you on an extraordinary journey of visual and narrative discovery.",
              )}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "40px",
                padding: "32px",
                border: "1px solid var(--glass-border)",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "var(--text-dark)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                  }}
                >
                  ORGINAL NAME
                </span>
                <span
                  style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}
                >
                  {manga.titleJa || manga.title}
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "var(--text-dark)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                  }}
                >
                  LEAD ARTIST
                </span>
                <span
                  style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}
                >
                  {manga.author || "JACK"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="reveal-up" style={{ animationDelay: "0.3s" }}>
          <div
            style={{
              display: "flex",
              gap: "40px",
              borderBottom: "1px solid var(--glass-border)",
              marginBottom: "40px",
              paddingBottom: "20px",
            }}
          >
            <button
              onClick={() => setActiveTab("chapters")}
              style={{
                background: "none",
                border: "none",
                color:
                  activeTab === "chapters"
                    ? "var(--accent-primary)"
                    : "var(--text-dim)",
                fontSize: "1.1rem",
                fontWeight: 800,
                cursor: "pointer",
                position: "relative",
                letterSpacing: "1px",
              }}
            >
              CHAPTERS
              {activeTab === "chapters" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-21px",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "var(--accent-primary)",
                    borderRadius: "10px",
                  }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("related")}
              style={{
                background: "none",
                border: "none",
                color:
                  activeTab === "related"
                    ? "var(--accent-primary)"
                    : "var(--text-dim)",
                fontSize: "1.1rem",
                fontWeight: 800,
                cursor: "pointer",
                position: "relative",
                letterSpacing: "1px",
              }}
            >
              YOU MAY LIKE
              {activeTab === "related" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-21px",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "var(--accent-primary)",
                    borderRadius: "10px",
                  }}
                />
              )}
            </button>
          </div>

          <div style={{ minHeight: "400px" }}>
            {activeTab === "chapters" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "20px",
                }}
              >
                {chapters.map((c) => (
                  <ChapterCardCreative key={c.id} chapter={c} mangaId={id} />
                ))}
              </div>
            )}

            {activeTab === "related" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "30px",
                }}
              >
                {related.map((m) => (
                  <div key={m.id} style={{ width: "100%" }}>
                    <MangaCard manga={m} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer-modern">
      <div className="main-container">
        <div
          style={{
            paddingTop: "40px",
            borderTop: "1px solid var(--glass-border)",
            display: "flex",
            justifyContent: "space-between",
            color: "var(--text-dim)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          <span>© 2024 MANGAFLIX. DESIGNED & DEVELOPED BY JACK.</span>
          <span>ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
}
