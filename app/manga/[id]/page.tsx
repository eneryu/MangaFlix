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
  StarHalf,
  Clock,
  ChevronRight,
  ArrowLeft,
  Info,
  Sparkles,
  Bookmark,
  Share,
  Copy,
  Check,
} from "lucide-react";
import {
  getMangaDetails,
  getMangaChapters,
  getRelatedManga,
  type Manga,
  type Chapter,
} from "@/lib/manga-api";
import Navbar from "@/components/Navbar";
import MangaCard from "@/components/MangaCard";

// Get star color and render stars
function RatingDisplay({ rating }: { rating: number }) {
  const normalizedRating = (rating / 10) * 5;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;

  const getColor = (r: number) => {
    if (r >= 8) return "#00ffaa";
    if (r >= 6) return "#ffa500";
    return "#ff4444";
  };

  const color = getColor(rating);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={18} fill={color} stroke={color} />;
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} size={18} fill={color} stroke={color} />;
          } else {
            return <Star key={i} size={18} stroke="rgba(255,255,255,0.2)" fill="none" />;
          }
        })}
      </div>
      <span style={{
        fontSize: "20px",
        fontWeight: 900,
        color,
        marginLeft: "4px"
      }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function DetailPoster({ manga }: { manga: Manga }) {
  return (
    <div
      className="reveal-up"
      style={{ maxWidth: "380px", position: "relative" }}
    >
      <div style={{
        position: "relative",
        aspectRatio: "2/3",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <Image
          src={manga.coverUrl}
          alt={manga.title}
          fill
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "-20px",
          padding: "10px 20px",
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          color: "#000",
          fontWeight: 900,
          borderRadius: "8px",
          transform: "rotate(-5deg)",
          boxShadow: "0 15px 30px rgba(0, 255, 170, 0.4)",
          fontSize: "14px",
          letterSpacing: "1.5px",
          zIndex: 10
        }}
      >
        ⭐ {manga.rating ? `${manga.rating.toFixed(1)} RATED` : "TOP RATED"}
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
        padding: "18px",
        borderRadius: "16px",
        textDecoration: "none",
        color: "inherit",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(0, 255, 170, 0.15), rgba(0, 184, 255, 0.15))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-primary)",
          flexShrink: 0
        }}
      >
        <Play size={26} fill="currentColor" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: "17px",
          fontWeight: 800,
          color: "#fff",
          marginBottom: "6px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          CHAPTER {chapter.chapter}
          {chapter.title && ` - ${chapter.title}`}
        </h4>
        <div
          style={{
            display: "flex",
            gap: "12px",
            fontSize: "13px",
            color: "var(--text-dim)",
            fontWeight: 600
          }}
        >
          <span>
            {new Date(chapter.publishedAt).toLocaleDateString("en-US", {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }).toUpperCase()}
          </span>
          <span>•</span>
          <span>{chapter.language.toUpperCase()}</span>
          {chapter.pages > 0 && (
            <>
              <span>•</span>
              <span>{chapter.pages} PAGES</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight size={20} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
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
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getMangaDetails(id).then(async (mangaData) => {
      if (mangaData) {
        setManga(mangaData);

        // Get chapters
        const chaptersData = await getMangaChapters(id, mangaData.availableLanguages || ["en"]);
        setChapters(chaptersData);

        // Get related manga by genre
        const genreTagIds = mangaData.genres || [];
        const relatedData = await getRelatedManga(id, genreTagIds, 6);
        setRelated(relatedData);

        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: manga?.title || "Manga",
      text: `Check out ${manga?.title} on MangaFlix!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          unoptimized
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
            gridTemplateColumns: "380px 1fr",
            gap: "80px",
            marginBottom: "100px",
          }}
        >
          {/* Left Column: Visuals */}
          <div className="reveal-up">
            <DetailPoster manga={manga} />
            <div
              style={{
                marginTop: "32px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "12px",
              }}
            >
              <button
                className="btn-premium btn-fill"
                onClick={() => {
                  if (chapters.length > 0) {
                    window.location.href = `/manga/${id}/chapter/${chapters[0].id}`;
                  }
                }}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Bookmark size={18} />
                START READING
              </button>
              <button
                className="btn-premium btn-outline"
                onClick={handleShare}
                style={{
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                title="Share"
              >
                {copied ? <Check size={18} /> : <Share size={18} />}
              </button>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="reveal-up" style={{ animationDelay: "0.1s" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
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
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  background: "var(--text-dark)",
                  borderRadius: "50%",
                }}
              />
              {manga.rating && <RatingDisplay rating={manga.rating} />}
            </div>

            <h1
              style={{
                fontSize: "4.5rem",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-3px",
                marginBottom: "24px",
                color: "#fff",
              }}
            >
              {manga.title}
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "32px",
              }}
            >
              {manga.genres.map((g, i) => (
                <span
                  key={i}
                  className="glass-effect"
                  style={{
                    padding: "8px 18px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-dim)",
                    letterSpacing: "0.5px"
                  }}
                >
                  {g.toUpperCase()}
                </span>
              ))}
            </div>

            <p
              style={{
                fontSize: "1.15rem",
                lineHeight: 1.7,
                color: "var(--text-dim)",
                maxWidth: "750px",
                marginBottom: "48px",
              }}
            >
              {manga.description ||
                "Enter a realm of unparalleled storytelling. This series invites you on an extraordinary journey of visual and narrative discovery."}
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
                  ORIGINAL NAME
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
                  AUTHOR/ARTIST
                </span>
                <span
                  style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}
                >
                  {manga.author || manga.artist || "Unknown"}
                </span>
              </div>
              {manga.follows && (
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
                    FOLLOWERS
                  </span>
                  <span
                    style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}
                  >
                    {manga.follows.toLocaleString()}
                  </span>
                </div>
              )}
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
                  CHAPTERS
                </span>
                <span
                  style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}
                >
                  {chapters.length} Available
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
              CHAPTERS ({chapters.length})
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
              YOU MAY LIKE ({related.length})
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
                  gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
                  gap: "16px",
                }}
              >
                {chapters.slice(0, 50).map((c) => (
                  <ChapterCardCreative key={c.id} chapter={c} mangaId={id} />
                ))}
                {chapters.length === 0 && (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "var(--text-dim)",
                    gridColumn: "1/-1"
                  }}>
                    <p style={{ fontSize: "16px", fontWeight: 600 }}>
                      No chapters available yet. Check back later!
                    </p>
                  </div>
                )}
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
                    <MangaCard manga={m} showChapterCount={false} />
                  </div>
                ))}
                {related.length === 0 && (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "var(--text-dim)",
                    gridColumn: "1/-1"
                  }}>
                    <p style={{ fontSize: "16px", fontWeight: 600 }}>
                      No related manga found. Explore more titles!
                    </p>
                  </div>
                )}
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
