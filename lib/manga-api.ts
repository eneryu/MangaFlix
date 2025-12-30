import axios from "axios";

// Use our own API proxy to bypass CORS
const API_BASE = typeof window !== "undefined" ? "/api" : "https://api.mangadex.org";
const MANGADEX_API = "https://api.mangadex.org";

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

// Status translations
const statusMap: Record<string, string> = {
    ongoing: "مستمر",
    completed: "مكتمل",
    hiatus: "متوقف",
    cancelled: "ملغي",
};

// Genre translations
const genreMap: Record<string, string> = {
    action: "أكشن",
    adventure: "مغامرات",
    comedy: "كوميديا",
    drama: "دراما",
    fantasy: "فانتازيا",
    horror: "رعب",
    mystery: "غموض",
    psychological: "نفسي",
    romance: "رومانسي",
    "sci-fi": "خيال علمي",
    "slice of life": "شريحة من الحياة",
    sports: "رياضة",
    supernatural: "خارق للطبيعة",
    thriller: "إثارة",
    tragedy: "مأساة",
    shounen: "شونين",
    shoujo: "شوجو",
    seinen: "سينين",
    josei: "جوسي",
    isekai: "إيسيكاي",
    mecha: "ميكا",
    "martial arts": "فنون قتالية",
    "school life": "حياة مدرسية",
    historical: "تاريخي",
    music: "موسيقى",
};

function translateStatus(status: string): string {
    return statusMap[status] || status;
}

function translateGenre(genre: string): string {
    return genreMap[genre.toLowerCase()] || genre;
}

// Get cover URL from cover filename
function getCoverUrl(mangaId: string, coverFileName: string): string {
    return `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.512.jpg`;
}

// Parse manga from API response
function parseManga(data: any, coverFileName?: string): Manga {
    const attrs = data.attributes;
    const titles = attrs.title || {};
    const descriptions = attrs.description || {};
    const altTitles = attrs.altTitles || [];

    // Find Arabic title if available
    let titleAr = altTitles.find((t: any) => t.ar)?.ar;

    // Get genres/tags
    const genres = (attrs.tags || [])
        .filter(
            (tag: any) =>
                tag.attributes?.group === "genre" || tag.attributes?.group === "theme",
        )
        .map((tag: any) => translateGenre(tag.attributes?.name?.en || ""))
        .filter(Boolean);

    return {
        id: data.id,
        title:
            titles.en ||
            titles["ja-ro"] ||
            (Object.values(titles)[0] as string) ||
            "Untitled",
        titleAr,
        titleJa: titles.ja,
        description:
            descriptions.en || (Object.values(descriptions)[0] as string) || "",
        descriptionAr: descriptions.ar,
        coverUrl: coverFileName
            ? getCoverUrl(data.id, coverFileName)
            : "/placeholder-cover.jpg",
        status: attrs.status || "ongoing",
        year: attrs.year,
        genres,
        author: data.relationships?.find((r: any) => r.type === "author")
            ?.attributes?.name,
        artist: data.relationships?.find((r: any) => r.type === "artist")
            ?.attributes?.name,
    };
}

// Fetch popular manga
export async function getPopularManga(limit = 20): Promise<Manga[]> {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("order[followedCount]", "desc");
        params.append("includes[]", "cover_art");
        params.append("includes[]", "author");
        params.append("includes[]", "artist");
        params.append("availableTranslatedLanguage[]", "en");
        params.append("availableTranslatedLanguage[]", "ar");
        params.append("contentRating[]", "safe");
        params.append("contentRating[]", "suggestive");

        const response = await axios.get(`${API_BASE}/manga?${params.toString()}`);

        return response.data.data.map((manga: any) => {
            const coverRel = manga.relationships?.find(
                (r: any) => r.type === "cover_art",
            );
            return parseManga(manga, coverRel?.attributes?.fileName);
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
        params.append("availableTranslatedLanguage[]", "en");
        params.append("availableTranslatedLanguage[]", "ar");
        params.append("contentRating[]", "safe");
        params.append("contentRating[]", "suggestive");

        const response = await axios.get(`${API_BASE}/manga?${params.toString()}`);

        return response.data.data.map((manga: any) => {
            const coverRel = manga.relationships?.find(
                (r: any) => r.type === "cover_art",
            );
            return parseManga(manga, coverRel?.attributes?.fileName);
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
        params.append("limit", limit.toString());
        params.append("title", query);
        params.append("includes[]", "cover_art");
        params.append("includes[]", "author");
        params.append("includes[]", "artist");
        params.append("contentRating[]", "safe");
        params.append("contentRating[]", "suggestive");

        const response = await axios.get(`${API_BASE}/manga?${params.toString()}`);

        return response.data.data.map((manga: any) => {
            const coverRel = manga.relationships?.find(
                (r: any) => r.type === "cover_art",
            );
            return parseManga(manga, coverRel?.attributes?.fileName);
        });
    } catch (error) {
        console.error("Error searching manga:", error);
        return [];
    }
}

// Get single manga details
export async function getMangaDetails(id: string): Promise<Manga | null> {
    try {
        const response = await axios.get(`${API_BASE}/manga/${id}`);

        const manga = response.data.data;
        const coverRel = manga.relationships?.find(
            (r: any) => r.type === "cover_art",
        );
        return parseManga(manga, coverRel?.attributes?.fileName);
    } catch (error) {
        console.error("Error fetching manga details:", error);
        return null;
    }
}

// Get manga chapters (sorted by chapter number)
export async function getMangaChapters(
    mangaId: string,
    languages = ["en", "ar"],
): Promise<Chapter[]> {
    try {
        const params = new URLSearchParams();
        params.append("limit", "500");
        languages.forEach((lang) => params.append("translatedLanguage[]", lang));
        params.append("order[chapter]", "asc");
        params.append("includes[]", "scanlation_group");

        const response = await axios.get(
            `${API_BASE}/manga/${mangaId}/chapters?${params.toString()}`,
        );

        return response.data.data.map((ch: any) => ({
            id: ch.id,
            chapter: ch.attributes.chapter || "0",
            title: ch.attributes.title || `الفصل ${ch.attributes.chapter}`,
            language: ch.attributes.translatedLanguage,
            pages: ch.attributes.pages,
            publishedAt: ch.attributes.publishAt,
            scanlationGroup: ch.relationships?.find(
                (r: any) => r.type === "scanlation_group",
            )?.attributes?.name,
        }));
    } catch (error) {
        console.error("Error fetching manga chapters:", error);
        return [];
    }
}

// Get chapter pages for reading
export async function getChapterPages(
    chapterId: string,
): Promise<ChapterPages | null> {
    try {
        const response = await axios.get(`${API_BASE}/chapter/${chapterId}`);
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

// Build full page URL
export function getPageUrl(
    baseUrl: string,
    hash: string,
    filename: string,
    quality: "data" | "data-saver" = "data",
): string {
    return `${baseUrl}/${quality}/${hash}/${filename}`;
}

// Export translations for UI
export { statusMap, genreMap, translateStatus, translateGenre };
