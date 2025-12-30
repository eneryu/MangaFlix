"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "en";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
};

const translations = {
  // الترجمات المشتركة العامة
  ar: {
    "home": "الرئيسية",
    "manga": "المانجا",
    "novels": "الروايات",
    "profile": "الملف الشخصي",
    "library": "المكتبة",
    "settings": "الإعدادات",
    "signin": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "search": "بحث",
    "logout": "تسجيل الخروج",
    "chapters": "الفصول",
    "read": "قراءة",
    "add_to_library": "إضافة للمكتبة",
    "comments": "التعليقات",
    "like": "إعجاب",
    "likes": "إعجابات",
    "share": "مشاركة",
    "reading": "قيد القراءة",
    "completed": "مكتمل",
    "on_hold": "متوقف",
    "dropped": "متروك",
    "plan_to_read": "في قائمة القراءة",
    "author": "المؤلف",
    "status": "الحالة",
    "genres": "التصنيفات",
    "published": "منشور",
    "rating": "التقييم",
    "description": "الوصف",
    "notifications": "الإشعارات",
    "mark_as_read": "تعليم كمقروء",
    "level": "المستوى",
    "exp": "نقاط الخبرة",
    "score": "النقاط",
    "upload": "رفع",
    "submit": "إرسال",
    "cancel": "إلغاء",
    "save": "حفظ",
    "edit": "تعديل",
    "delete": "حذف",
    "confirm": "تأكيد",
    "admin": "المسؤول",
    "moderator": "المشرف",
    "user": "المستخدم",
  },
  en: {
    "home": "Home",
    "manga": "Manga",
    "novels": "Novels",
    "profile": "Profile",
    "library": "Library",
    "settings": "Settings",
    "signin": "Sign In",
    "signup": "Sign Up",
    "search": "Search",
    "logout": "Logout",
    "chapters": "Chapters",
    "read": "Read",
    "add_to_library": "Add to Library",
    "comments": "Comments",
    "like": "Like",
    "likes": "Likes",
    "share": "Share",
    "reading": "Reading",
    "completed": "Completed",
    "on_hold": "On Hold",
    "dropped": "Dropped",
    "plan_to_read": "Plan to Read",
    "author": "Author",
    "status": "Status",
    "genres": "Genres",
    "published": "Published",
    "rating": "Rating",
    "description": "Description",
    "notifications": "Notifications",
    "mark_as_read": "Mark as Read",
    "level": "Level",
    "exp": "EXP",
    "score": "Score",
    "upload": "Upload",
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "confirm": "Confirm",
    "admin": "Admin",
    "moderator": "Moderator",
    "user": "User",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLanguage = "ar",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // قراءة اللغة المخزنة في المتصفح
    const savedLanguage = localStorage.getItem("language") as Language;
    
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
  };

  const value = {
    language,
    setLanguage,
    translations: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function t(key: string): string {
  const { language, translations } = useLanguage();
  return translations[key] || key;
} 