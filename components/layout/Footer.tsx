import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">مانجا</h3>
            <p className="text-muted-foreground">
              منصة مانجا هي أفضل مكان للقراء والمؤلفين لاكتشاف ومشاركة المانجا والروايات
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/manga" className="text-muted-foreground hover:text-primary transition-colors">
                  المانجا
                </Link>
              </li>
              <li>
                <Link href="/novels" className="text-muted-foreground hover:text-primary transition-colors">
                  الروايات
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-muted-foreground hover:text-primary transition-colors">
                  المؤلفين
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">حسابك</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/signin" className="text-muted-foreground hover:text-primary transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                  إنشاء حساب
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  الملف الشخصي
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-muted-foreground hover:text-primary transition-colors">
                  مكتبتي
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">معلومات</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>
            تطوير: <a href="https://github.com/eneryu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Jack</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 