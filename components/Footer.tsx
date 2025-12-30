"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer-enhanced">
            <div className="main-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2>MANGAFLIX</h2>
                        <p className="footer-desc">
                            The premier destination for high-quality manga streaming. Built
                            with passion for readers who demand the best experience.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4>DISCOVER</h4>
                        <div className="footer-links">
                            <Link href="/" className="footer-link">
                                Home
                            </Link>
                            <Link href="/search" className="footer-link">
                                Browse All
                            </Link>
                            <Link href="/library" className="footer-link">
                                My Library
                            </Link>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>ABOUT</h4>
                        <div className="footer-links">
                            <a
                                href="https://github.com/eneryu/MangaFlix"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                GitHub Repository
                            </a>
                            <a
                                href="https://mangadex.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                Data Source: MangaDex
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© 2024 MANGAFLIX. DESIGNED & DEVELOPED BY JACK.</span>
                    <div style={{ display: "flex", gap: "20px", opacity: 0.7 }}>
                        <span>VERSION 2.5.0</span>
                        <span>FRONTEND ONLY</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
