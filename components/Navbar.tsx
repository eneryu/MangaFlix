'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, LayoutGrid } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="nav-wrapper">
            <div className={`nav-inner ${scrolled ? 'nav-solid' : 'nav-transparent'}`}>
                <Link href="/" className="nav-logo">
                    MANGA<span style={{ color: 'var(--text-main)', opacity: 0.5 }}>FLIX</span>
                </Link>

                <div className="nav-links">
                    <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                        Discover
                    </Link>
                    <Link href="/search" className={`nav-link ${pathname === '/search' ? 'active' : ''}`}>
                        Browse
                    </Link>
                    <Link href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>
                        Library
                    </Link>
                </div>

                <div className="nav-actions">
                    <Link href="/search" style={{ color: 'var(--text-dim)', transition: 'color 0.2s' }} className="hover:text-white">
                        <Search size={20} strokeWidth={2.5} />
                    </Link>
                    <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)' }} />
                    <Link
                        href="/profile"
                        style={{
                            width: '36px',
                            height: '36px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-main)'
                        }}
                    >
                        <User size={18} strokeWidth={2.5} />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
