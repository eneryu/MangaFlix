'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Plus, Info, Heart, Share2 } from 'lucide-react';
import { type Manga } from '@/lib/manga-api';

export default function MangaCard({ manga, rank }: { manga: Manga; rank?: number }) {
    return (
        <div className="manga-card-v3 group">
            <Link href={`/manga/${manga.id}`} className="block relative w-full h-full">
                {/* Cover Image */}
                <div className="card-image-container">
                    <Image
                        src={manga.coverUrl}
                        alt={manga.title}
                        fill
                        className="card-image"
                        sizes="(max-width: 768px) 50vw, 200px"
                    />

                    {/* Rank Badge */}
                    {rank && rank <= 10 && (
                        <div className={`rank-badge ${rank <= 3 ? 'rank-top' : ''}`}>
                            #{rank}
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="status-badge">
                        {manga.status === 'completed' ? 'END' : 'ONGOING'}
                    </div>

                    {/* Hover Overlay with Details Inside */}
                    <div className="card-hover-overlay">
                        <div className="overlay-content">
                            <button className="play-button" onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/manga/${manga.id}`;
                            }}>
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
                                <span className="info-tag">{manga.year || '2024'}</span>
                                <span className="info-dot">•</span>
                                <span className="info-tag">{manga.genres?.[0] || 'Manga'}</span>
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
                        <Star size={12} fill="#ffc107" stroke="#ffc107" />
                        <span>4.9</span>
                    </div>
                    <span className="meta-separator">•</span>
                    <span className="chapter-count">CH. 124</span>
                </div>
            </div>
        </div>
    );
}
