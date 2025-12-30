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
      include: {
        mangas: {
          orderBy: {
            createdAt: "desc",
          },
          take: 8,
        },
        libraryEntries: {
          include: {
            manga: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 8,
        },
        achievements: true,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "المستخدم غير موجود" }), {
        status: 404,
      });
    }

    // نعدل User للسماح بإرسال كائن بدون كلمة المرور
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new NextResponse(JSON.stringify({ error: "حدث خطأ في الخادم" }), {
      status: 500,
    });
  }
}
