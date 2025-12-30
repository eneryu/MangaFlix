'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Home, List, Settings,
  ArrowLeft, ZoomIn, ZoomOut, Maximize, Minimize,
  SkipBack, SkipForward, LayoutPanelLeft, MousePointer2,
  Command, Sparkles
} from 'lucide-react';
import { getChapterPages, getPageUrl, getMangaChapters, type ChapterPages, type Chapter } from '@/lib/manga-api';

interface ChapterPageProps {
  params: { id: string; chapterId: string };
}

export default function ChapterReaderPage({ params }: ChapterPageProps) {
  const { id, chapterId } = params;
  const router = useRouter();

  const [pagesData, setPagesData] = React.useState<ChapterPages | null>(null);
  const [allChapters, setAllChapters] = React.useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(-1);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [showUI, setShowUI] = React.useState(true);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLoading(true);
    // Remove Arabic language from API request
    Promise.all([
      getChapterPages(chapterId),
      getMangaChapters(id, ['en', 'ja'])
    ]).then(([pages, chapters]) => {
      setPagesData(pages);
      setAllChapters(chapters);
      const idx = chapters.findIndex(ch => ch.id === chapterId);
      setCurrentChapterIndex(idx);
      setCurrentPage(0);
      setLoading(false);
    });
  }, [id, chapterId]);


  const currentChapter = allChapters[currentChapterIndex];
  const prevChapter = allChapters[currentChapterIndex - 1];
  const nextChapter = allChapters[currentChapterIndex + 1];

  const pageUrls = pagesData
    ? pagesData.pages.map(p => getPageUrl(pagesData.baseUrl, pagesData.hash, p, 'data'))
    : [];

  const nextPage = () => {
    if (currentPage < pageUrls.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (nextChapter) {
      router.push(`/manga/${id}/chapter/${nextChapter.id}`);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
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
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div className="shimmer-bg" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div className="reader-container" ref={containerRef}>
      {/* Immersive Top Bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href={`/manga/${id}`} style={{ color: '#fff', textDecoration: 'none' }}>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '2px' }}>
              NOW READING
            </span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              CHAPTER {currentChapter?.chapter} {currentChapter?.title && <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}> — {currentChapter.title.toUpperCase()}</span>}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="glass-effect" onClick={toggleFullscreen} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}>
            <Maximize size={20} />
          </button>
          <button className="glass-effect" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}>
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Side Progress Dots (The "Virtual" Navigator) */}
      <div className="reader-sidebar">
        {pageUrls.map((_, i) => (
          <div
            key={i}
            className={`sidebar-dot ${i === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
            title={`Page ${i + 1}`}
          />
        ))}
      </div>

      {/* Virtual Page Panels Viewport */}
      <div className="reader-viewport" onClick={(e) => {
        const x = e.clientX;
        const w = window.innerWidth;
        if (x < w * 0.3) prevPage();
        else if (x > w * 0.7) nextPage();
      }}>
        <div className="panel-group">
          {pageUrls.map((url, i) => {
            let status = 'panel-next';
            if (i === currentPage) status = 'panel-active';
            if (i < currentPage) status = 'panel-prev';

            // Only render current and adjacent pages for performance
            if (Math.abs(i - currentPage) > 2) return null;

            return (
              <div key={i} className={`virtual-page-panel ${status}`}>
                <Image
                  src={url}
                  alt={`Page ${i + 1}`}
                  width={1000}
                  height={1500}
                  style={{ width: 'auto', height: '90vh', objectFit: 'contain' }}
                  priority={i === currentPage}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Indicators */}
      <div style={{
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div className="glass-effect" style={{ padding: '8px 24px', borderRadius: '100px', fontWeight: 900, fontSize: '14px', letterSpacing: '2px', background: 'rgba(0,255,170,0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
          PAGE {currentPage + 1} / {pageUrls.length}
        </div>
      </div>

      {/* Reader Controls Footer */}
      <div className="reader-bottom-nav">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-premium btn-outline"
            onClick={prevPage}
            disabled={currentPage === 0 && !prevChapter}
            style={{ padding: '12px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <SkipBack size={16} />
            PREVIOUS
          </button>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }} />

          <button
            className="btn-premium btn-fill"
            onClick={nextPage}
            style={{ padding: '12px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            NEXT
            <SkipForward size={16} />
          </button>
        </div>
      </div>

      {/* Custom Branding Watermark */}
      <div style={{ position: 'fixed', bottom: '20px', right: '30px', opacity: 0.3, pointerEvents: 'none' }}>
        <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '4px', color: '#fff' }}>
          ARCHIVED BY JACK
        </span>
      </div>
    </div>
  );
}