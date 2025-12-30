"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Users, 
  Flag, 
  BarChart, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark,
  Shield,
  Bell,
  MessageSquare,
  Tag
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface DashboardSidebarProps {
  role: string;
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { language } = useLanguage();
  
  // تعيين حالة الانهيار بناءً على حجم الشاشة عند التحميل الأولي
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getLinkClasses = (path: string) => {
    const base = "flex items-center gap-3 px-4 py-3 rounded-md transition-colors";
    const active = "bg-primary text-primary-foreground";
    const inactive = "hover:bg-secondary/50";
    
    return `${base} ${pathname === path ? active : inactive}`;
  };

  // تعريف قائمة الروابط المتاحة للمشرف
  const moderatorLinks = [
    { 
      href: "/dashboard", 
      label: language === "ar" ? "لوحة التحكم" : "Dashboard", 
      icon: <BarChart size={20} /> 
    },
    { 
      href: "/dashboard/manga", 
      label: language === "ar" ? "المانجا" : "Manga", 
      icon: <BookOpen size={20} /> 
    },
    { 
      href: "/dashboard/reports", 
      label: language === "ar" ? "البلاغات" : "Reports", 
      icon: <Flag size={20} /> 
    },
    { 
      href: "/dashboard/comments", 
      label: language === "ar" ? "التعليقات" : "Comments", 
      icon: <MessageSquare size={20} /> 
    },
  ];

  // روابط إضافية للمسؤول
  const adminLinks = [
    { 
      href: "/dashboard/users", 
      label: language === "ar" ? "المستخدمين" : "Users", 
      icon: <Users size={20} /> 
    },
    { 
      href: "/dashboard/genres", 
      label: language === "ar" ? "التصنيفات" : "Genres", 
      icon: <Tag size={20} /> 
    },
    { 
      href: "/dashboard/notifications", 
      label: language === "ar" ? "الإشعارات" : "Notifications", 
      icon: <Bell size={20} /> 
    },
    { 
      href: "/dashboard/settings", 
      label: language === "ar" ? "الإعدادات" : "Settings", 
      icon: <Settings size={20} /> 
    },
  ];

  // تحديد قائمة الروابط بناءً على دور المستخدم
  const links = role === "ADMIN" 
    ? [...moderatorLinks, ...adminLinks] 
    : moderatorLinks;

  return (
    <aside 
      className={`h-[calc(100vh-64px)] bg-card border-e border-border transition-all duration-300 sticky top-16 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-2 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6 px-2 py-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              <span className="font-bold">
                {role === "ADMIN" 
                  ? (language === "ar" ? "المسؤول" : "Admin") 
                  : (language === "ar" ? "المشرف" : "Moderator")
                }
              </span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-secondary/50 ml-auto"
          >
            {collapsed 
              ? (language === "ar" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)
              : (language === "ar" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />)
            }
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={getLinkClasses(link.href)}
              title={collapsed ? link.label : undefined}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
} 