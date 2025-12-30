"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "فشل تسجيل الدخول",
          description: result.error,
        });
        return;
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بعودتك",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://assets.nflxext.com/ffe/siteui/vlv3/4da5d2b1-1b22-498d-90c7-1cf2599bf24e/66bcf404-3bf5-4e30-9a40-7e5c33577101/EG-en-20240205-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt="Background"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="container mx-auto">
          <Link href="/" className="inline-block">
            <h1 className="text-primary text-4xl font-bold">مانجا</h1>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="bg-black/80 p-8 sm:p-12 rounded-md w-full max-w-md text-white backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8 text-white">تسجيل الدخول</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary peer"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary right-4"
                >
                  البريد الإلكتروني
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary peer"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary right-4"
                >
                  كلمة المرور
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-md font-bold text-lg transition-colors"
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-zinc-700 w-full"></div>
              <div className="absolute bg-black/80 px-3 text-zinc-500">أو</div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-md font-bold transition-colors hover:bg-gray-200"
            >
              <FaGoogle />
              <span>تسجيل الدخول عبر Google</span>
            </button>

            <p className="text-gray-400 text-center">
              ليس لديك حساب؟{" "}
              <Link href="/signup" className="text-white hover:underline">
                سجل الآن
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
