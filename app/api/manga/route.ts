import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { sendNewMangaNotification } from "@/lib/services/pusher";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "غير مسموح" }),
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "المستخدم غير موجود" }),
        { status: 404 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      type, 
      status, 
      coverImage, 
      bannerImage,
      genres, 
      isExplicit, 
      isOriginal,
      isPublished
    } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !description || !type || !status || !coverImage || !genres || genres.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "جميع الحقول المطلوبة يجب تعبئتها" }),
        { status: 400 }
      );
    }

    // إنشاء المانجا الجديدة
    const newManga = await prisma.manga.create({
      data: {
        title,
        description,
        type,
        status,
        coverImage,
        bannerImage: bannerImage || null,
        isExplicit: isExplicit || false,
        isOriginal: isOriginal || false,
        isPublished: isPublished || false,
        authorId: user.id,
        genres: {
          connect: genres.map((genreId: string) => ({ id: genreId })),
        }
      },
      include: {
        genres: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
      },
    });

    // إذا تم النشر، أرسل إشعارًا
    if (isPublished) {
      await sendNewMangaNotification({
        mangaId: newManga.id,
        title: newManga.title,
        coverImage: newManga.coverImage,
        authorName: newManga.author.name || "مؤلف غير معروف",
        authorImage: newManga.author.image || "/assets/images/default-avatar.png",
      });
    }

    // زيادة نقاط الخبرة للمستخدم
    const expPoints = 100; // نقاط خبرة لإنشاء مانجا جديدة
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        exp: {
          increment: expPoints,
        }
      }
    });

    // تحقق ما إذا كان المستخدم قد وصل إلى مستوى جديد
    const updatedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        level: true,
        exp: true,
        maxExp: true,
      },
    });

    if (updatedUser && updatedUser.exp >= updatedUser.maxExp) {
      // ترقية المستوى وإعادة ضبط نقاط الخبرة
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          level: {
            increment: 1,
          },
          exp: updatedUser.exp - updatedUser.maxExp,
          maxExp: Math.floor(updatedUser.maxExp * 1.5), // زيادة حد الخبرة المطلوب للمستوى التالي
          score: {
            increment: 50, // نقاط إضافية للمستوى الجديد
          }
        }
      });
    }

    return NextResponse.json(newManga, { status: 201 });
  } catch (error) {
    console.error("Error creating manga:", error);
    return new NextResponse(
      JSON.stringify({ error: "حدث خطأ في الخادم" }),
      { status: 500 }
    );
  }
} 