"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, BookOpen } from "lucide-react";

interface MangaCardProps {
  id: string;
  title: string;
  coverImage: string;
  rating?: number;
  status?: string;
  authorName?: string;
  type?: "MANGA" | "NOVEL";
  chapterCount?: number;
  currentChapter?: number;
}

const MangaCard = ({
  id,
  title,
  coverImage,
  rating = 0,
  status = "",
  authorName = "",
  type,
  chapterCount,
  currentChapter,
}: MangaCardProps) => {
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all bg-card">
      <Link href={`/manga/${id}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold py-1 px-2 rounded-full">
            {status}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="font-bold text-sm truncate">{title}</h3>
            <p className="text-xs text-gray-300">{authorName}</p>
          </div>
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/manga/${id}`}>
          <h3 className="font-bold text-foreground truncate mb-1">{title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground truncate mb-2">
          {authorName}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star size={14} className="text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <BookOpen size={14} className="text-muted-foreground mr-1" />
            <span className="text-sm text-muted-foreground">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaCard;
