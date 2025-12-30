import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
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

    const libraryEntries = await prisma.libraryEntry.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        manga: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            type: true,
            description: true,
            authorId: true,
            author: {
              select: {
                name: true,
              },
            },
            chapters: {
              select: {
                id: true,
                number: true,
              },
              orderBy: {
                number: "asc",
              },
            },
          },
        },
      },
    });

    return NextResponse.json(libraryEntries, { status: 200 });
  } catch (error) {
    console.error("Error fetching library:", error);
    return new NextResponse(JSON.stringify({ error: "حدث خطأ في الخادم" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { mangaId, status, currentChapter, isFavorite } = body;

    if (!mangaId) {
      return new NextResponse(
        JSON.stringify({ error: "معرّف المانجا مطلوب" }),
        { status: 400 },
      );
    }

    // تحقق مما إذا كان المستخدم لديه بالفعل مدخل مكتبة لهذا المانجا
    const existingEntry = await prisma.libraryEntry.findFirst({
      where: {
        userId: user.id,
        mangaId,
      },
    });

    if (existingEntry) {
      // تحديث المدخل الموجود
      const updatedEntry = await prisma.libraryEntry.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          status: status || existingEntry.status,
          currentChapter: currentChapter || existingEntry.currentChapter,
          isFavorite:
            isFavorite !== undefined ? isFavorite : existingEntry.isFavorite,
        },
        include: {
          manga: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              type: true,
            },
          },
        },
      });

      return NextResponse.json(updatedEntry, { status: 200 });
    } else {
      // إنشاء مدخل جديد
      const newEntry = await prisma.libraryEntry.create({
        data: {
          userId: user.id,
          mangaId,
          status: status || "PLAN_TO_READ",
          currentChapter: currentChapter || 0,
          isFavorite: isFavorite || false,
        },
        include: {
          manga: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              type: true,
            },
          },
        },
      });

      return NextResponse.json(newEntry, { status: 201 });
    }
  } catch (error) {
    console.error("Error managing library entry:", error);
    return new NextResponse(JSON.stringify({ error: "حدث خطأ في الخادم" }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get("id");

    if (!entryId) {
      return new NextResponse(JSON.stringify({ error: "معرّف المدخل مطلوب" }), {
        status: 400,
      });
    }

    // تحقق من أن المدخل ينتمي إلى المستخدم
    const entry = await prisma.libraryEntry.findUnique({
      where: {
        id: entryId,
      },
      select: {
        userId: true,
      },
    });

    if (!entry) {
      return new NextResponse(
        JSON.stringify({ error: "مدخل المكتبة غير موجود" }),
        { status: 404 },
      );
    }

    if (entry.userId !== user.id) {
      return new NextResponse(JSON.stringify({ error: "غير مسموح" }), {
        status: 403,
      });
    }

    // حذف المدخل
    await prisma.libraryEntry.delete({
      where: {
        id: entryId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "تم حذف مدخل المكتبة بنجاح" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting library entry:", error);
    return new NextResponse(JSON.stringify({ error: "حدث خطأ في الخادم" }), {
      status: 500,
    });
  }
}
