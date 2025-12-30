"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      // @ts-ignore - session.user.role قد لا يكون موجودًا في النوع الافتراضي
      const role = session?.user?.role;
      setUserRole(role);

      // التحقق من وجود صلاحيات الوصول للوحة التحكم
      if (role !== "ADMIN" && role !== "MODERATOR") {
        router.push("/");
      }
    }
  }, [status, router, session]);

  if (status === "loading" || !userRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (userRole !== "ADMIN" && userRole !== "MODERATOR") {
    return null;
  }

  return (
    <div className="bg-background">
      <Navbar />
      <div className="flex pt-16">
        <DashboardSidebar role={userRole} />
        <main className="flex-1 p-8">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  );
}
