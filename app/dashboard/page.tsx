"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Flag,
  MessageSquare,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useLanguage } from "@/components/language-provider";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalMangas: 0,
    totalUsers: 0,
    totalReports: 0,
    totalComments: 0,
    totalViews: 0,
    newUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  // بيانات وهمية للرسوم البيانية
  const chartData = [
    {
      name: language === "ar" ? "يناير" : "Jan",
      users: 400,
      mangas: 240,
      views: 2400,
    },
    {
      name: language === "ar" ? "فبراير" : "Feb",
      users: 300,
      mangas: 139,
      views: 1398,
    },
    {
      name: language === "ar" ? "مارس" : "Mar",
      users: 200,
      mangas: 980,
      views: 3800,
    },
    {
      name: language === "ar" ? "أبريل" : "Apr",
      users: 278,
      mangas: 390,
      views: 3908,
    },
    {
      name: language === "ar" ? "مايو" : "May",
      users: 189,
      mangas: 480,
      views: 4800,
    },
    {
      name: language === "ar" ? "يونيو" : "Jun",
      users: 239,
      mangas: 380,
      views: 3800,
    },
    {
      name: language === "ar" ? "يوليو" : "Jul",
      users: 349,
      mangas: 430,
      views: 4300,
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // في التطبيق الحقيقي، استبدل بـ API call
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();

        // استخدام بيانات وهمية حاليًا
        const mockData = {
          totalMangas: 1250,
          totalUsers: 7532,
          totalReports: 123,
          totalComments: 8934,
          totalViews: 345928,
          newUsers: 245,
        };

        setStats(mockData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {language === "ar" ? "لوحة التحكم" : "Dashboard"}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {language === "ar" ? "مرحبًا، " : "Welcome, "}
            <span className="font-medium text-foreground">
              {session?.user?.name}
            </span>
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "إجمالي المانجا" : "Total Manga"}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalMangas.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "+20% من الشهر الماضي"
                : "+20% from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "إجمالي المستخدمين" : "Total Users"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? `+${stats.newUsers} مستخدم جديد هذا الشهر`
                : `+${stats.newUsers} new this month`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "إجمالي المشاهدات" : "Total Views"}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "+12% من الأسبوع الماضي"
                : "+12% from last week"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "البلاغات النشطة" : "Active Reports"}
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              {language === "ar" ? "تحتاج للمراجعة" : "Needs review"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "التعليقات" : "Comments"}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalComments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "+7% من الشهر الماضي"
                : "+7% from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "ar" ? "نمو المستخدمين" : "User Growth"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5.2%</div>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "معدل نمو المستخدمين الشهري"
                : "Monthly growth rate"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "نظرة عامة" : "Overview"}
            </CardTitle>
            <CardDescription>
              {language === "ar"
                ? "مقارنة للمستخدمين والمانجا والمشاهدات"
                : "Comparison of users, manga and views"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorMangas"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name={language === "ar" ? "المستخدمين" : "Users"}
                  />
                  <Area
                    type="monotone"
                    dataKey="mangas"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorMangas)"
                    name={language === "ar" ? "المانجا" : "Manga"}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#ffc658"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    name={language === "ar" ? "المشاهدات" : "Views"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "تم التحديث آخر مرة الساعة 3:45 م"
                : "Last updated at 3:45 PM"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
