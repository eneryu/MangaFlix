import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MangaFlix - Stream Your Favorite Manga",
  description:
    "Discover and read thousands of manga titles. The ultimate manga streaming platform with a Netflix-like experience.",
  keywords: [
    "manga",
    "read manga",
    "manga online",
    "anime",
    "webtoon",
    "comics",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="no-referrer" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
