"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Settings,
  Bell,
  Shield,
  LogOut,
  Save,
  Upload,
  Trash2,
} from "lucide-react";

interface UserSettings {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  notifyNewManga: boolean;
  notifyNewChapter: boolean;
  notifyComments: boolean;
  notifySystem: boolean;
  theme: string;
  language: string;
}

export default function UserSettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    notifyNewManga: true,
    notifyNewChapter: true,
    notifyComments: true,
    notifySystem: true,
    theme: "system",
    language: "ar",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (status === "authenticated" && session.user) {
      const fetchUserSettings = async () => {
        setIsLoading(true);
        try {
          // في تطبيق حقيقي، استبدل بمكالمة API
          // const response = await fetch('/api/user/settings');
          // const data = await response.json();

          // محاكاة بيانات المستخدم
          setTimeout(() => {
            setSettings({
              name: session.user?.name || "",
              email: session.user?.email || "",
              bio: "أنا مهتم بالمانجا والأنمي، أحب القراءة والمشاهدة في أوقات فراغي!",
              avatar: session.user?.image || "",
              notifyNewManga: true,
              notifyNewChapter: true,
              notifyComments: true,
              notifySystem: true,
              theme: "system",
              language: language,
            });
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error("Error fetching user settings:", error);
          setIsLoading(false);
        }
      };

      fetchUserSettings();
    }
  }, [session, status, router, language]);

  const handleChange = (field: keyof UserSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    // تغيير اللغة فورًا إذا تم تحديثها
    if (field === "language") {
      setLanguage(value);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // في تطبيق حقيقي، أرسل البيانات إلى الخادم
      // await fetch('/api/user/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });

      // تحديث بيانات الجلسة
      await update({
        ...session,
        user: {
          ...session?.user,
          name: settings.name,
        },
      });

      // محاكاة طلب API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: language === "ar" ? "تم حفظ الإعدادات" : "Settings Saved",
        description:
          language === "ar"
            ? "تم تحديث إعداداتك الشخصية بنجاح"
            : "Your settings have been updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description:
          language === "ar"
            ? "حدث خطأ أثناء حفظ الإعدادات"
            : "An error occurred while saving settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleChange("avatar", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه."
          : "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        // في تطبيق حقيقي، أرسل طلب حذف إلى الخادم
        // await fetch('/api/user/delete', {
        //   method: 'DELETE'
        // });

        // محاكاة طلب API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
          title: language === "ar" ? "تم حذف الحساب" : "Account Deleted",
          description:
            language === "ar"
              ? "تم حذف حسابك بنجاح، وداعًا!"
              : "Your account has been deleted successfully, goodbye!",
          variant: "default",
        });

        router.push("/signin");
      } catch (error) {
        console.error("Error deleting account:", error);
        toast({
          title: language === "ar" ? "خطأ" : "Error",
          description:
            language === "ar"
              ? "حدث خطأ أثناء حذف الحساب"
              : "An error occurred while deleting your account",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">
        {language === "ar" ? "إعدادات الحساب" : "Account Settings"}
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            {language === "ar" ? "الملف الشخصي" : "Profile"}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            {language === "ar" ? "الإشعارات" : "Notifications"}
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="mr-2 h-4 w-4" />
            {language === "ar" ? "التفضيلات" : "Preferences"}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            {language === "ar" ? "الأمان" : "Security"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center justify-start gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={settings.avatar} alt={settings.name} />
                <AvatarFallback>{settings.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2 w-full">
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer flex items-center justify-center gap-2 py-2 px-4 border rounded-md hover:bg-secondary"
                >
                  <Upload className="h-4 w-4" />
                  {language === "ar" ? "تغيير الصورة" : "Change Avatar"}
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            <div className="md:w-2/3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === "ar" ? "الاسم" : "Name"}
                </Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  readOnly
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {language === "ar"
                    ? "لا يمكن تغيير البريد الإلكتروني"
                    : "Email cannot be changed"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {language === "ar" ? "نبذة عني" : "Bio"}
                </Label>
                <Textarea
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={4}
                  placeholder={
                    language === "ar"
                      ? "اكتب نبذة قصيرة عنك..."
                      : "Write a short bio about yourself..."
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "ar"
                ? "إعدادات الإشعارات"
                : "Notification Settings"}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyNewManga">
                    {language === "ar" ? "المانجا الجديدة" : "New Manga"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "إشعارات عند إضافة مانجا جديدة"
                      : "Notifications when new manga is added"}
                  </p>
                </div>
                <Switch
                  id="notifyNewManga"
                  checked={settings.notifyNewManga}
                  onCheckedChange={(checked) =>
                    handleChange("notifyNewManga", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyNewChapter">
                    {language === "ar" ? "الفصول الجديدة" : "New Chapters"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "إشعارات عند إضافة فصول جديدة للمانجا المفضلة"
                      : "Notifications when new chapters are added to your favorite manga"}
                  </p>
                </div>
                <Switch
                  id="notifyNewChapter"
                  checked={settings.notifyNewChapter}
                  onCheckedChange={(checked) =>
                    handleChange("notifyNewChapter", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyComments">
                    {language === "ar" ? "التعليقات" : "Comments"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "إشعارات عند الرد على تعليقاتك"
                      : "Notifications when someone replies to your comments"}
                  </p>
                </div>
                <Switch
                  id="notifyComments"
                  checked={settings.notifyComments}
                  onCheckedChange={(checked) =>
                    handleChange("notifyComments", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifySystem">
                    {language === "ar"
                      ? "إشعارات النظام"
                      : "System Notifications"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "إشعارات مهمة من النظام وتحديثات الموقع"
                      : "Important system notifications and site updates"}
                  </p>
                </div>
                <Switch
                  id="notifySystem"
                  checked={settings.notifySystem}
                  onCheckedChange={(checked) =>
                    handleChange("notifySystem", checked)
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {language === "ar" ? "تفضيلات الموقع" : "Site Preferences"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">
                  {language === "ar" ? "المظهر" : "Theme"}
                </Label>
                <select
                  id="theme"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.theme}
                  onChange={(e) => handleChange("theme", e.target.value)}
                >
                  <option value="light">
                    {language === "ar" ? "فاتح" : "Light"}
                  </option>
                  <option value="dark">
                    {language === "ar" ? "داكن" : "Dark"}
                  </option>
                  <option value="system">
                    {language === "ar" ? "تلقائي (حسب النظام)" : "System"}
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language-select">
                  {language === "ar" ? "اللغة" : "Language"}
                </Label>
                <select
                  id="language-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {language === "ar" ? "تغيير كلمة المرور" : "Change Password"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? "تغيير كلمة المرور الخاصة بك بشكل دوري يحافظ على أمان حسابك"
                  : "Changing your password regularly helps keep your account secure"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">
                  {language === "ar"
                    ? "كلمة المرور الحالية"
                    : "Current Password"}
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder={
                    language === "ar"
                      ? "أدخل كلمة المرور الحالية"
                      : "Enter current password"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">
                  {language === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder={
                    language === "ar"
                      ? "أدخل كلمة المرور الجديدة"
                      : "Enter new password"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  {language === "ar"
                    ? "تأكيد كلمة المرور الجديدة"
                    : "Confirm New Password"}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder={
                    language === "ar"
                      ? "أعد إدخال كلمة المرور الجديدة"
                      : "Re-enter new password"
                  }
                />
              </div>

              <Button>
                {language === "ar" ? "تحديث كلمة المرور" : "Update Password"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-destructive">
                  {language === "ar" ? "حذف الحساب" : "Delete Account"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ar"
                    ? "حذف حسابك سيؤدي إلى إزالة جميع بياناتك نهائيًا من الموقع"
                    : "Deleting your account will permanently remove all your data from our site"}
                </p>
              </div>

              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="mr-2 h-4 w-4" />
                {language === "ar" ? "حذف الحساب" : "Delete Account"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {language === "ar"
                    ? "تسجيل الخروج من جميع الأجهزة"
                    : "Sign Out From All Devices"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ar"
                    ? "سيتم تسجيل خروجك من جميع الأجهزة التي قمت بتسجيل الدخول إليها"
                    : "You will be signed out from all devices you are currently logged into"}
                </p>
              </div>

              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                {language === "ar"
                  ? "تسجيل الخروج من جميع الأجهزة"
                  : "Sign Out From All Devices"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving
            ? language === "ar"
              ? "جارِ الحفظ..."
              : "Saving..."
            : language === "ar"
              ? "حفظ الإعدادات"
              : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
