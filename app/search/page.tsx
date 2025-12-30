"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search as SearchIcon,
  X,
  Star,
  Loader2,
  Sparkles,
  Filter,
} from "lucide-react";
import { searchManga, getPopularManga, type Manga } from "@/lib/manga-api";
import Navbar from "@/components/Navbar";
import MangaCard from "@/components/MangaCard";

const genres = [
  "All",
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
];

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Manga[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Manga[]>([]);
  const [selectedGenre, setSelectedGenre] = React.useState("All");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    getPopularManga(24).then(setSuggestions);
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    const data = await searchManga(query, 40);
    setResults(data);
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const displayedManga = hasSearched ? results : suggestions;

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-deep)", paddingTop: "120px" }}
    >
      <Navbar />

      <div className="main-container">
        {/* Creative Search Header */}
        <div
          className="reveal-up"
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div className="hero-label" style={{ marginBottom: "16px" }}>
            <Sparkles size={12} style={{ marginRight: "6px" }} />
            DISCOVER THE UNKNOWN
          </div>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 900,
              marginBottom: "40px",
              letterSpacing: "-2px",
            }}
          >
            EXPLORE THE <span className="text-gradient">MULTIVERSE</span>
          </h1>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <form
              onSubmit={handleSearch}
              className="glass-effect"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 8px 8px 24px",
                borderRadius: "100px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              <SearchIcon size={24} style={{ color: "var(--text-dim)" }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Titles, creators, or genres..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  padding: "16px",
                  fontSize: "18px",
                  outline: "none",
                  fontWeight: 500,
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-dim)",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              )}
              <button
                type="submit"
                className="btn-premium btn-fill"
                style={{ borderRadius: "100px" }}
              >
                SEARCH
              </button>
            </form>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    background:
                      selectedGenre === g
                        ? "var(--accent-primary)"
                        : "rgba(255,255,255,0.05)",
                    color: selectedGenre === g ? "#000" : "var(--text-dim)",
                    border: "1px solid",
                    borderColor:
                      selectedGenre === g
                        ? "transparent"
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="reveal-up" style={{ animationDelay: "0.2s" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyBetween: "space-between",
              marginBottom: "32px",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              {hasSearched
                ? `FOUND ${results.length} TITLES`
                : "POPULAR CREATIONS"}
            </h2>
            <div
              style={{
                display: "flex",
                gap: "10px",
                color: "var(--text-dim)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <Filter size={16} />
              SORT: RELEVANCE
            </div>
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "100px",
              }}
            >
              <Loader2
                className="animate-spin"
                size={40}
                style={{ color: "var(--accent-primary)" }}
              />
            </div>
          ) : displayedManga.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "40px 30px",
              }}
            >
              {displayedManga.map((m) => (
                <div key={m.id} style={{ width: "100%" }}>
                  <MangaCard manga={m} />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "100px 0",
                color: "var(--text-dim)",
              }}
            >
              <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                NO UNIVERSES FOUND MATCHING YOUR SEARCH.
              </p>
              <button
                onClick={clearSearch}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-primary)",
                  cursor: "pointer",
                  marginTop: "16px",
                  fontWeight: 700,
                }}
              >
                CLEAR FILTERS AND TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer-modern" style={{ marginTop: "100px" }}>
      <div className="main-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "var(--text-dim)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          <span>© 2024 MANGAFLIX. DESIGNED & DEVELOPED BY JACK.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <span>BACK TO HOME</span>
            <span>REPOSITORY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
