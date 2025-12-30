import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json([]);
    }

    // بحث المانجا
    const mangas = await prisma.manga.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          {
            author: {
              name: { contains: query, mode: "insensitive" },
            },
          },
          {
            genres: {
              some: {
                name: { contains: query, mode: "insensitive" },
              },
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
        chapters: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    // تحويل النتائج للشكل المطلوب
    const formattedResults = mangas.map((manga: any) => {
      const avgRating =
        manga.totalRating > 0 ? manga.totalRating / manga.reviewCount : 0;

      return {
        id: manga.id,
        title: manga.title,
        coverImage: manga.coverImage,
        type: manga.type,
        status: manga.status,
        genres: manga.genres,
        author: manga.author,
        rating: avgRating,
        chapterCount: manga.chapters.length,
        reviewCount: manga._count.reviews,
      };
    });

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Error searching:", error);
    return new NextResponse(JSON.stringify({ error: "حدث خطأ في الخادم" }), {
      status: 500,
    });
  }
}
