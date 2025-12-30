'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer-enhanced">
            <div className="main-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2>MANGAFLIX</h2>
                        <p className="footer-desc">
                            The premier destination for high-quality manga streaming. Built with passion for readers who demand the best experience.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4>DISCOVER</h4>
                        <div className="footer-links">
                            <Link href="/popular" className="footer-link">Most Popular</Link>
                            <Link href="/latest" className="footer-link">New Releases</Link>
                            <Link href="/search?genre=action" className="footer-link">Action</Link>
                            <Link href="/search?genre=adventure" className="footer-link">Adventure</Link>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>ACCOUNT</h4>
                        <div className="footer-links">
                            <Link href="/auth/signin" className="footer-link">Sign In</Link>
                            <Link href="/auth/signup" className="footer-link">Join Free</Link>
                            <Link href="/library" className="footer-link">My Collection</Link>
                            <Link href="/settings" className="footer-link">Preferences</Link>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>SUPPORT</h4>
                        <div className="footer-links">
                            <Link href="/dmca" className="footer-link">DMCA</Link>
                            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link href="/terms" className="footer-link">Terms of Service</Link>
                            <Link href="/contact" className="footer-link">Contact Us</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© 2024 MANGAFLIX. DESIGNED & DEVELOPED BY JACK.</span>
                    <div style={{ display: 'flex', gap: '20px', opacity: 0.7 }}>
                        <span>VERSION 2.5.0</span>
                        <span>SERVER: US-EAST</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
