"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, StarHalf, Plus, Heart, Share2 } from "lucide-react";
import { type Manga } from "@/lib/manga-api";

// Get star color based on rating
function getStarColor(rating: number): string {
    if (rating >= 8) return "#00ffaa"; // Green
    if (rating >= 6) return "#ffa500"; // Orange
    return "#ff4444"; // Red
}

// Render rating stars
function RatingStars({ rating }: { rating: number }) {
    const normalizedRating = (rating / 10) * 5; // Convert 0-10 to 0-5
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    const color = getStarColor(rating);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {[...Array(5)].map((_, i) => {
                if (i < fullStars) {
                    return <Star key={i} size={12} fill={color} stroke={color} />;
                } else if (i === fullStars && hasHalfStar) {
                    return <StarHalf key={i} size={12} fill={color} stroke={color} />;
                } else {
                    return <Star key={i} size={12} stroke="rgba(255,255,255,0.3)" fill="none" />;
                }
            })}
        </div>
    );
}

export default function MangaCard({
    manga,
    rank,
    showChapterCount = false,
}: {
    manga: Manga;
    rank?: number;
    showChapterCount?: boolean;
}) {
    const rating = manga.rating || 0;
    const totalChapters = manga.totalChapters || 0;

    return (
        <div className="manga-card-v3 group">
            <Link
                href={`/manga/${manga.id}`}
                className="block relative w-full h-full"
            >
                {/* Cover Image */}
                <div className="card-image-container">
                    <Image
                        src={manga.coverUrl}
                        alt={manga.title}
                        fill
                        className="card-image"
                        sizes="(max-width: 768px) 50vw, 200px"
                        unoptimized
                    />

                    {/* Rank Badge */}
                    {rank && rank <= 10 && (
                        <div className={`rank-badge ${rank <= 3 ? "rank-top" : ""}`}>
                            #{rank}
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="status-badge">
                        {manga.status === "completed" ? "END" : "ONGOING"}
                    </div>

                    {/* Hover Overlay with Details Inside */}
                    <div className="card-hover-overlay">
                        <div className="overlay-content">
                            <button
                                className="play-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `/manga/${manga.id}`;
                                }}
                            >
                                <Play size={24} fill="currentColor" className="ml-1" />
                            </button>

                            <div className="action-row">
                                <button className="icon-btn" title="Add to Library">
                                    <Plus size={18} />
                                </button>
                                <button className="icon-btn" title="Like">
                                    <Heart size={18} />
                                </button>
                                <button className="icon-btn" title="Share">
                                    <Share2 size={18} />
                                </button>
                            </div>

                            <div className="mini-info">
                                <span className="info-tag">{manga.year || "2024"}</span>
                                <span className="info-dot">•</span>
                                <span className="info-tag">{manga.genres?.[0] || "Manga"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Info Below Card */}
            <div className="card-info">
                <Link href={`/manga/${manga.id}`} className="card-title">
                    {manga.title}
                </Link>
                <div className="card-meta">
                    <div className="rating">
                        <RatingStars rating={rating} />
                        <span style={{ marginLeft: "6px", fontSize: "13px", fontWeight: 700 }}>
                            {rating > 0 ? rating.toFixed(1) : "N/A"}
                        </span>
                    </div>
                    <span className="meta-separator">•</span>
                    <span className="chapter-count">
                        {totalChapters > 0 ? `CH. ${totalChapters}` : showChapterCount ? "CH. N/A" : `${manga.status.toUpperCase()}`}
                    </span>
                </div>
            </div>
        </div>
    );
}
