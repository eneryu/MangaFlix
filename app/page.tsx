"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Plus,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
  Flame,
  Zap,
  Heart,
  Bookmark,
  Swords,
  Trophy,
  Loader2,
} from "lucide-react";
import { getPopularManga, getLatestManga, type Manga } from "@/lib/manga-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MangaCard from "@/components/MangaCard";

// Helper to summarize description
const summarize = (text: string, length: number = 180) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// ==================== CREATIVE HERO ====================
function HeroShowcase({ mangas }: { mangas: Manga[] }) {
  const [index, setIndex] = React.useState(0);
  const current = mangas[index];

  React.useEffect(() => {
    if (mangas.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % Math.min(mangas.length, 5));
    }, 8000);
    return () => clearInterval(timer);
  }, [mangas]);

  if (!current) return <div className="hero-showcase shimmer-bg" />;

  return (
    <section className="hero-showcase">
      <div className="hero-bg-parallax">
        <Image
          src={current.coverUrl}
          alt=""
          fill
          className="hero-bg-image"
          priority
        />
        <div className="hero-mask" />
        <div className="hero-bottom-fade" />
      </div>

      <div className="hero-main-content">
        <div className="hero-text-block reveal-up">
          <div className="hero-label">
            <Sparkles size={12} style={{ marginRight: "6px" }} />
            FEATURED MASTERPIECE
          </div>
          <h1 className="hero-display-title">{current.title}</h1>
          {current.titleAr && (
            <span
              style={{
                display: "block",
                fontSize: "1.2rem",
                color: "var(--accent-primary)",
                fontWeight: 700,
                marginBottom: "16px",
                letterSpacing: "1px",
              }}
            >
              {current.titleAr}
            </span>
          )}
          <p className="hero-summary">
            {summarize(
              current.description ||
                "Embark on an epic journey where legends are born and destiny is forged in the fires of adventure.",
            )}
          </p>
          <div className="hero-actions-row">
            <Link
              href={`/manga/${current.id}`}
              className="btn-premium btn-fill"
            >
              <Play size={20} fill="currentColor" />
              READ NOW
            </Link>
            <Link
              href={`/manga/${current.id}`}
              className="btn-premium btn-outline"
            >
              VIEW DETAILS
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div
          className="hero-poster-wrapper reveal-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="hero-poster-card">
            <Image
              src={current.coverUrl}
              alt={current.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== CREATIVE ROW ====================
function CreativeRow({
  title,
  subtitle,
  icon: Icon,
  mangas,
  loading,
  wide = false,
}: {
  title: string;
  subtitle: string;
  icon?: any;
  mangas: Manga[];
  loading: boolean;
  wide?: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = dir === "left" ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="row-container main-container">
      <div className="row-header">
        <div className="row-title-stack">
          <span className="row-subtitle">
            {Icon && (
              <Icon
                size={12}
                style={{ marginRight: "6px", verticalAlign: "middle" }}
              />
            )}
            {subtitle}
          </span>
          <h2 className="row-main-title">{title}</h2>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => scroll("left")}
            className="btn-premium btn-outline"
            style={{ padding: "10px", borderRadius: "50%" }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="btn-premium btn-outline"
            style={{ padding: "10px", borderRadius: "50%" }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="cards-slider" ref={scrollRef}>
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="manga-card-v3 shimmer-bg"
                  style={{
                    minWidth: "200px",
                    aspectRatio: "2/3",
                    borderRadius: "12px",
                  }}
                />
              ))
          : mangas.map((m, i) => (
              <div key={m.id} style={{ minWidth: wide ? "320px" : "200px" }}>
                <MangaCard
                  manga={m}
                  rank={subtitle.includes("TOP") ? i + 1 : undefined}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

// ==================== MAIN HOME PAGE ====================
export default function Home() {
  const [popular, setPopular] = React.useState<Manga[]>([]);
  const [latest, setLatest] = React.useState<Manga[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Infinite scroll simulation
  const [page, setPage] = React.useState(1);
  const [moreSections, setMoreSections] = React.useState<string[]>([]);
  const [loadingMore, setLoadingMore] = React.useState(false);

  React.useEffect(() => {
    Promise.all([getPopularManga(30), getLatestManga(30)])
      .then(([pop, lat]) => {
        setPopular(pop);
        setLatest(lat);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setMoreSections((prev) => [...prev, `section-${prev.length + 1}`]);
      setLoadingMore(false);
    }, 1500);
  };

  // Infinite scroll listener
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !loadingMore &&
        moreSections.length < 5
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, moreSections]);

  return (
    <main style={{ paddingBottom: "0" }}>
      <Navbar />

      <HeroShowcase mangas={popular.slice(0, 5)} />

      <div className="section-wrapper">
        <CreativeRow
          title="TRENDING CREATIONS"
          subtitle="TOP OF THE WEEK"
          icon={Flame}
          mangas={popular.slice(0, 15)}
          loading={loading}
        />

        <CreativeRow
          title="RECENT UPDATES"
          subtitle="FRESHLY ADDED"
          icon={Clock}
          mangas={latest.slice(0, 15)}
          loading={loading}
        />

        {/* Dynamic Break Section */}
        <div
          className="main-container"
          style={{ marginBottom: "80px", marginTop: "40px" }}
        >
          <div
            className="glass-effect"
            style={{
              borderRadius: "24px",
              padding: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:
                "linear-gradient(135deg, rgba(0, 255, 170, 0.08), rgba(0, 184, 255, 0.08))",
              overflow: "hidden",
              position: "relative",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div style={{ position: "relative", zIndex: 5, maxWidth: "500px" }}>
              <div className="hero-label">PREMIUM EXPERIENCE</div>
              <h2
                style={{
                  fontSize: "3rem",
                  fontWeight: 900,
                  marginBottom: "16px",
                  letterSpacing: "-2px",
                }}
              >
                JOIN THE INNER CIRCLE
              </h2>
              <p
                style={{
                  color: "var(--text-dim)",
                  marginBottom: "32px",
                  fontSize: "1.1rem",
                }}
              >
                Unlock personalized tracking, early access to new chapters, and
                a refined interface designed for the ultimate reader.
              </p>
              <button className="btn-premium btn-fill">CREATE ACCOUNT</button>
            </div>
            {popular[5] && (
              <div
                style={{
                  position: "absolute",
                  right: "-5%",
                  bottom: "-10%",
                  opacity: 0.15,
                  transform: "rotate(-5deg)",
                }}
              >
                <Image
                  src={popular[5].coverUrl}
                  alt=""
                  width={500}
                  height={750}
                  style={{ borderRadius: "24px" }}
                />
              </div>
            )}
          </div>
        </div>

        <CreativeRow
          title="ACTION & BATTLE"
          subtitle="ADRENALINE RUSH"
          icon={Swords}
          mangas={popular
            .filter(
              (m) =>
                m.genres?.map((g) => g.toLowerCase()).includes("action") ||
                true,
            )
            .slice(0, 15)}
          loading={loading}
        />

        <CreativeRow
          title="FAN FAVORITES"
          subtitle="MOST BOOKMARKED"
          icon={Trophy}
          mangas={popular.slice(15, 30)}
          loading={loading}
        />

        <CreativeRow
          title="MODERN ROMANCE"
          subtitle="HEART & SOUL"
          icon={Heart}
          mangas={latest
            .filter(
              (m) =>
                m.genres?.map((g) => g.toLowerCase()).includes("romance") ||
                true,
            )
            .slice(0, 15)}
          loading={loading}
        />

        {/* Dynamically Loaded Sections */}
        {moreSections.map((sec, i) => (
          <CreativeRow
            key={sec}
            title={i % 2 === 0 ? "HIDDEN GEMS" : "NEXT GEN HITS"}
            subtitle={i % 2 === 0 ? "UNDER RATED" : "RISING STARS"}
            icon={Compass}
            mangas={
              i % 2 === 0
                ? [...latest].reverse().slice(0, 15)
                : [...popular].reverse().slice(0, 15)
            }
            loading={loading}
          />
        ))}

        {loadingMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <Loader2
              className="animate-spin"
              size={40}
              style={{ color: "var(--accent-primary)" }}
            />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
