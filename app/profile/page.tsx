"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Book,
  PenTool,
  Award,
  Medal,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  level: number;
  exp: number;
  maxExp: number;
  score: number;
  mangas: any[];
  libraryEntries: any[];
  achievements: any[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      fetchUserProfile();
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/profile");
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("حدث خطأ أثناء تحميل الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">جاري التحميل...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session?.user || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>الرجاء تسجيل الدخول لعرض الملف الشخصي</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const percentToNextLevel = (profile.exp / profile.maxExp) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* بروفايل الشخصي */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="md:w-1/3 lg:w-1/4">
              <div className="bg-card rounded-lg overflow-hidden shadow-md p-6 relative netflix-gradient">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={profile.image || "/assets/images/default-avatar.png"}
                    alt={profile.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {profile.level}
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2">
                  {profile.name}
                </h1>

                <div className="flex items-center justify-center mb-4 gap-4">
                  <div className="flex items-center gap-1">
                    <Medal className="text-yellow-500 h-5 w-5" />
                    <span className="font-medium">{profile.score}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="text-blue-500 h-5 w-5" />
                    <span className="font-medium">
                      {profile.libraryEntries.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PenTool className="text-green-500 h-5 w-5" />
                    <span className="font-medium">{profile.mangas.length}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>المستوى {profile.level}</span>
                    <span>المستوى {profile.level + 1}</span>
                  </div>
                  <Progress value={percentToNextLevel} className="h-2" />
                  <div className="text-center text-sm mt-1">
                    {profile.exp} / {profile.maxExp} نقطة خبرة
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                  {profile.bio || "لم يتم إضافة نبذة عن المستخدم"}
                </p>

                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors">
                    <User size={18} />
                    <span>تعديل الملف الشخصي</span>
                  </button>
                  <button className="w-full flex items-center gap-2 py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors">
                    <Settings size={18} />
                    <span>الإعدادات</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 py-2 px-4 rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 lg:w-3/4">
              <Tabs defaultValue="library" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="library">مكتبتي</TabsTrigger>
                  <TabsTrigger value="mangaCreated">منشوراتي</TabsTrigger>
                  <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="bg-card rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">مكتبتي</h2>
                  {profile.libraryEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Book className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>لم تضف أي مانجا إلى مكتبتك بعد</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* هنا عرض عناصر المكتبة */}
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="mangaCreated"
                  className="bg-card rounded-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-6">منشوراتي</h2>
                  {profile.mangas.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <PenTool className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>لم تنشر أي مانجا بعد</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* هنا عرض المانجا التي تم إنشاؤها */}
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="achievements"
                  className="bg-card rounded-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-6">الإنجازات</h2>
                  {profile.achievements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>لم تحصل على إنجازات بعد</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* هنا عرض الإنجازات */}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
