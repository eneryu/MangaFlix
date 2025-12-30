'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, BookOpen, Clock, Star, Sparkles, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Reuse the creative card style
function LibraryCard({ title, coverUrl, status, progress }: { title: string, coverUrl: string, status: string, progress: number }) {
  return (
    <div className="manga-card-v2" style={{ width: '100%' }}>
      <div className="card-image-wrap">
        <Image
          src={coverUrl}
          alt={title}
          fill
          className="card-img"
        />
        <div className="card-overlay-modern">
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span className="hero-label" style={{ fontSize: '9px', padding: '2px 8px' }}>{status.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <div className="card-info-stack">
        <h3 className="card-title-v2">{title}</h3>
        <div className="card-meta-v2">
          <Clock size={12} />
          <span>CHAPTER {progress}</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>80% DONE</span>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [activeFilter, setActiveFilter] = React.useState('All');
  const filters = ['All', 'Reading', 'Completed', 'On Hold', 'Plan to Read'];

  // Placeholder data for the library
  const libraryData = [
    { title: "SOLO LEVELING", coverUrl: "https://uploads.mangadex.org/covers/32d76d19-8a05-4d29-9ef9-af39ca7a1cb6/6027a3c3-d9d1-447a-8531-1e9671d18f8e.jpg", status: "Reading", progress: 124 },
    { title: "ONE PIECE", coverUrl: "https://uploads.mangadex.org/covers/a1c1105e-f089-4b6c-9419-f9c264a4d651/7f23c965-6490-410a-810a-e3743521d966.jpg", status: "Reading", progress: 1105 },
    { title: "BERSERK", coverUrl: "https://uploads.mangadex.org/covers/80151fe1-4a87-4d92-938b-d748f22036c6/e562164c-f06b-4e11-82c5-3a059d4f05fa.jpg", status: "Completed", progress: 375 },
    { title: "VAGABOND", coverUrl: "https://uploads.mangadex.org/covers/d8f9e61c-5296-485a-8d69-2f22384a2-3f8/77d54e5a-2735-4202-a160-5f284e369b76.jpg", status: "On Hold", progress: 327 },
  ];

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-deep)', paddingTop: '120px' }}>
      <Navbar />

      <div className="main-container">
        <header className="reveal-up" style={{ marginBottom: '60px' }}>
          <div className="hero-label">
            <BookOpen size={12} style={{ marginRight: '6px' }} />
            PERSONAL ARCHIVE
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '40px' }}>
            MY <span className="text-gradient">COLLECTION</span>
          </h1>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="glass-effect" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4px 20px', borderRadius: '100px' }}>
              <Search size={18} style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search collection..."
                style={{ background: 'transparent', border: 'none', color: '#fff', padding: '12px', flex: 1, outline: 'none', fontWeight: 600 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: activeFilter === f ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: activeFilter === f ? '#000' : 'var(--text-dim)',
                    border: '1px solid',
                    borderColor: activeFilter === f ? 'transparent' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="reveal-up" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '40px 30px' }}>
            {libraryData.map((item, i) => (
              <LibraryCard key={i} {...item} />
            ))}
          </div>
        </section>

        {libraryData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--glass-border)', borderRadius: '24px' }}>
            <Sparkles size={48} style={{ color: 'var(--text-dim)', marginBottom: '20px', opacity: 0.3 }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>YOUR ARCHIVE IS EMPTY</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '32px' }}>Start your journey by adding some titles to your collection.</p>
            <Link href="/" className="btn-premium btn-fill">EXPLORE TRENDS</Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer-modern" style={{ marginTop: '100px' }}>
      <div className="main-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
          <span>© 2024 MANGAFLIX. DESIGNED & DEVELOPED BY JACK.</span>
          <span>ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
}