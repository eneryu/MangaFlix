import axios from "axios";

// Use our own API proxy to bypass CORS
const API_BASE = typeof window !== "undefined" ? "/api" : "https://api.mangadex.org";
const MANGADEX_API = "https://api.mangadex.org";

export interface MangaStatistics {
    rating: {
        average: number;
        bayesian: number;
    };
    follows: number;
}

export interface Manga {
    id: string;
    title: string;
    titleAr?: string;
    titleJa?: string;
    description: string;
    descriptionAr?: string;
    coverUrl: string;
    status: "ongoing" | "completed" | "hiatus" | "cancelled";
    year?: number;
    genres: string[];
    rating?: number;
    follows?: number;
    totalChapters?: number;
    availableLanguages?: string[];
    author?: string;
    artist?: string;
}

export interface Chapter {
    id: string;
    chapter: string;
    title: string;
    language: string;
    pages: number;
    publishedAt: string;
    scanlationGroup?: string;
}

export interface ChapterPages {
    baseUrl: string;
    hash: string;
    pages: string[];
    pagesHQ: string[];
}

// Clean description from links and markdown
function cleanDescription(text: string): string {
    if (!text) return "";

    // Remove markdown links: [text](url)
    let cleaned = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

    // Remove remaining URLs
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, "");

    // Remove markdown formatting
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1"); // Bold
    cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1"); // Italic
    cleaned = cleaned.replace(/__([^_]+)__/g, "$1"); // Bold
    cleaned = cleaned.replace(/_([^_]+)_/g, "$1"); // Italic

    // Remove "---" separators
    cleaned = cleaned.replace(/---+/g, "");

    // Remove "Links:" sections and everything after
    cleaned = cleaned.replace(/\*\*Links:\*\*[\s\S]*/gi, "");
    cleaned = cleaned.replace(/Links:[\s\S]*/gi, "");

    // Remove extra whitespace
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n").trim();

    return cleaned;
}

function getCoverUrl(mangaId: string, fileName: string): string {
    return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.512.jpg`;
}

// Parse manga from API response
function parseManga(data: any, coverFileName?: string, stats?: MangaStatistics): Manga {
    const attrs = data.attributes;
    const titles = attrs.title || {};
    const descriptions = attrs.description || {};
    const altTitles = attrs.altTitles || [];

    // Get genres/tags (English only)
    const genres = (attrs.tags || [])
        .filter(
            (tag: any) =>
                tag.attributes?.group === "genre" || tag.attributes?.group === "theme",
        )
        .map((tag: any) => tag.attributes?.name?.en || "")
        .filter(Boolean);

    // Clean description
    const rawDesc = descriptions.en || (Object.values(descriptions)[0] as string) || "";
    const cleanedDesc = cleanDescription(rawDesc);

    // Get available languages
    const availableLanguages = attrs.availableTranslatedLanguage || [];

    return {
        id: data.id,
        title:
            titles.en ||
            titles["ja-ro"] ||
            (Object.values(titles)[0] as string) ||
            "Untitled",
        titleAr: undefined,
        titleJa: titles.ja,
        description: cleanedDesc,
        descriptionAr: undefined,
        coverUrl: coverFileName
            ? getCoverUrl(data.id, coverFileName)
            : "/placeholder-cover.jpg",
        status: attrs.status || "ongoing",
        year: attrs.year,
        genres,
        rating: stats?.rating?.bayesian || stats?.rating?.average,
        follows: stats?.follows,
        availableLanguages,
        author: data.relationships?.find((r: any) => r.type === "author")
            ?.attributes?.name,
        artist: data.relationships?.find((r: any) => r.type === "artist")
            ?.attributes?.name,
    };
}

// Fetch manga statistics
export async function getMangaStatistics(mangaIds: string[]): Promise<Record<string, MangaStatistics>> {
    try {
        const params = new URLSearchParams();
        mangaIds.forEach(id => params.append("manga[]", id));

        const response = await axios.get(`${MANGADEX_API}/statistics/manga?${params.toString()}`);
        return response.data.statistics || {};
    } catch (error) {
        console.error("Error fetching manga statistics:", error);
        return {};
    }
}

// Fetch popular manga with statistics
export async function getPopularManga(limit = 20): Promise<Manga[]> {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("order[followedCount]", "desc");
        params.append("includes[]", "cover_art");
        params.append("includes[]", "author");
        params.append("includes[]", "artist");
        params.append("availableTranslatedLanguage[]", "en");
        params.append("contentRating[]", "safe");
        params.append("contentRating[]", "suggestive");

        const response = await axios.get(`${API_BASE}/manga?${params.toString()}`);
        const mangas = response.data.data;

        // Get statistics for all mangas
        const mangaIds = mangas.map((m: any) => m.id);
        const stats = await getMangaStatistics(mangaIds);

        return mangas.map((manga: any) => {
            const coverRel = manga.relationships?.find(
                (r: any) => r.type === "cover_art",
            );
            return parseManga(manga, coverRel?.attributes?.fileName, stats[manga.id]);
        });
    } catch (error) {
        console.error("Error fetching popular manga:", error);
        return [];
    }
}

// Fetch latest updated manga
export async function getLatestManga(limit = 20): Promise<Manga[]> {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("order[latestUploadedChapter]", "desc");
        params.append("includes[]", "cover_art");
        params.append("includes[]", "author");
        params.append("includes[]", "artist");
        params.append("contentRating[]", "safe");
        params.append("contentRating[]", "suggestive");

        const response = await axios.get(`${API_BASE}/manga?${params.toString()}`);
        const mangas = response.data.data;

        // Get statistics
        const mangaIds = mangas.map((m: any) => m.id);
        const stats = await getMangaStatistics(mangaIds);

        return mangas.map((manga: any) => {
            const coverRel = manga.relationships?.find(
                (r: any) => r.type === "cover_art",
            );
            return parseManga(manga, coverRel?.attributes?.fileName, stats[manga.id]);
        });
    } catch (error) {
        console.error("Error fetching latest manga:", error);
        return [];
    }
}

// Search manga
export async function searchManga(query: string, limit = 20): Promise<Manga[]> {
    try {
        const params = new URLSearchParams();
        params.append("title", query);
        params.append("limit", limit.toString());
        params.append("includes[]", "cover_art");
        params.append("includes[]", "author");
        params.append("includes[]", "artist");
        params.append("contentRating[]", "safe");
        params.append("contentRating[]", "suggestive");

        const response = await axios.get(`${API_BASE}/manga?${params.toString()}`);
        const mangas = response.data.data;

        const mangaIds = mangas.map((m: any) => m.id);
        const stats = await getMangaStatistics(mangaIds);

        return mangas.map((manga: any) => {
            const coverRel = manga.relationships?.find(
                (r: any) => r.type === "cover_art",
            );
            return parseManga(manga, coverRel?.attributes?.fileName, stats[manga.id]);
        });
    } catch (error) {
        console.error("Error searching manga:", error);
        return [];
    }
}

// Get manga details
export async function getMangaDetails(id: string): Promise<Manga | null> {
    try {
        const params = new URLSearchParams();
        params.append("includes[]", "cover_art");
        params.append("includes[]", "author");
        params.append("includes[]", "artist");

        const response = await axios.get(`${API_BASE}/manga/${id}?${params.toString()}`);
        const manga = response.data.data;

        // Get statistics
        const stats = await getMangaStatistics([id]);

        const coverRel = manga.relationships?.find(
            (r: any) => r.type === "cover_art",
        );

        return parseManga(manga, coverRel?.attributes?.fileName, stats[id]);
    } catch (error) {
        console.error("Error fetching manga details:", error);
        return null;
    }
}

// Get related manga by genre
export async function getRelatedManga(mangaId: string, genres: string[], limit = 6): Promise<Manga[]> {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("order[relevance]", "desc");
        params.append("includes[]", "cover_art");

        // Add genre tags
        genres.slice(0, 3).forEach(genre => {
            params.append("includedTags[]", genre);
        });

        // Exclude current manga
        params.append("excludedIds[]", mangaId);

        params.append("contentRating[]", "safe");
        params.append("contentRating[]", "suggestive");

        const response = await axios.get(`${API_BASE}/manga?${params.toString()}`);
        const mangas = response.data.data;

        const mangaIds = mangas.map((m: any) => m.id);
        const stats = await getMangaStatistics(mangaIds);

        return mangas.map((manga: any) => {
            const coverRel = manga.relationships?.find(
                (r: any) => r.type === "cover_art",
            );
            return parseManga(manga, coverRel?.attributes?.fileName, stats[manga.id]);
        });
    } catch (error) {
        console.error("Error fetching related manga:", error);
        return [];
    }
}

// Get manga chapters with count
export async function getMangaChapters(
    mangaId: string,
    languages: string[] = ["en"],
): Promise<Chapter[]> {
    try {
        const params = new URLSearchParams();
        params.append("manga", mangaId);
        params.append("limit", "500");
        params.append("order[chapter]", "desc");
        params.append("translatedLanguage[]", languages.join(","));

        const response = await axios.get(`${API_BASE}/chapter?${params.toString()}`);

        return response.data.data.map((chapter: any) => ({
            id: chapter.id,
            chapter: chapter.attributes.chapter || "0",
            title: chapter.attributes.title || "",
            language: chapter.attributes.translatedLanguage,
            pages: chapter.attributes.pages || 0,
            publishedAt: chapter.attributes.publishAt || chapter.attributes.createdAt,
            scanlationGroup: chapter.relationships?.find(
                (r: any) => r.type === "scanlation_group",
            )?.attributes?.name,
        }));
    } catch (error) {
        console.error("Error fetching chapters:", error);
        return [];
    }
}

// Get chapter pages
export async function getChapterPages(chapterId: string): Promise<ChapterPages | null> {
    try {
        const response = await axios.get(`${API_BASE}/at-home/server/${chapterId}`);
        const data = response.data;

        return {
            baseUrl: data.baseUrl,
            hash: data.chapter.hash,
            pages: data.chapter.data,
            pagesHQ: data.chapter.dataSaver,
        };
    } catch (error) {
        console.error("Error fetching chapter pages:", error);
        return null;
    }
}

// Get page URL
export function getPageUrl(
    baseUrl: string,
    hash: string,
    page: string,
    quality: "data" | "data-saver" = "data",
): string {
    return `${baseUrl}/${quality}/${hash}/${page}`;
}
