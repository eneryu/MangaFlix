import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { sendNewChapterNotification } from "@/lib/services/pusher";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const mangaId = params.id;

    const chapters = await prisma.chapter.findMany({
      where: {
        mangaId,
        isPublished: true,
      },
      orderBy: {
        number: "desc",
      },
      include: {
        _count: {
          select: {
            pages: true,
          },
        },
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return new NextResponse(JSON.stringify({ error: "حدث خطأ في الخادم" }), {
      status: 500,
    });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: "غير مسموح" }), {
        status: 401,
      });
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
      return new NextResponse(JSON.stringify({ error: "المستخدم غير موجود" }), {
        status: 404,
      });
    }

    const mangaId = params.id;

    // تحقق من ملكية المانجا
    const manga = await prisma.manga.findUnique({
      where: {
        id: mangaId,
      },
      select: {
        id: true,
        title: true,
        authorId: true,
        coverImage: true,
      },
    });

    if (!manga) {
      return new NextResponse(JSON.stringify({ error: "المانجا غير موجودة" }), {
        status: 404,
      });
    }

    if (manga.authorId !== user.id) {
      return new NextResponse(
        JSON.stringify({ error: "غير مسموح - لست مؤلف هذه المانجا" }),
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, number, isPublished, pages } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !number || !pages || pages.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "جميع الحقول المطلوبة يجب تعبئتها" }),
        { status: 400 },
      );
    }

    // إنشاء الفصل الجديد مع الصفحات
    const newChapter = await prisma.chapter.create({
      data: {
        title,
        number,
        isPublished,
        mangaId,
        pages: {
          create: pages.map((page: { imageUrl: string; order: number }) => ({
            imageUrl: page.imageUrl,
            order: page.order,
          })),
        },
      },
      include: {
        pages: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // إذا تم النشر، أرسل إشعارًا
    if (isPublished) {
      await sendNewChapterNotification(mangaId, {
        chapterId: newChapter.id,
        mangaTitle: manga.title,
        chapterNumber: newChapter.number,
        chapterTitle: newChapter.title,
        coverImage: manga.coverImage,
      });
    }

    // زيادة نقاط الخبرة للمستخدم
    const expPoints = 50; // نقاط خبرة لإنشاء فصل جديد
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        exp: {
          increment: expPoints,
        },
      },
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
            increment: 25, // نقاط إضافية للمستوى الجديد
          },
        },
      });
    }

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return new NextResponse(JSON.stringify({ error: "حدث خطأ في الخادم" }), {
      status: 500,
    });
  }
}
