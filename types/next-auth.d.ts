import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * تعديل نوع جلسة المستخدم لتشمل المعلومات الإضافية
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "USER" | "MODERATOR" | "ADMIN";
      level: number;
      exp: number;
      score: number;
    };
  }
} 