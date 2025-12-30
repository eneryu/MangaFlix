"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Save, Globe, Shield, BellRing, Upload, Settings } from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  enableRegistration: boolean;
  enableComments: boolean;
  enableReports: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  maxUploadSize: number;
  defaultUserRole: string;
  contactEmail: string;
  termsAndConditions: string;
  privacyPolicy: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "مانجا جاك",
    siteDescription: "منصة لقراءة المانجا والروايات اليابانية",
    enableRegistration: true,
    enableComments: true,
    enableReports: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxUploadSize: 10,
    defaultUserRole: "USER",
    contactEmail: "contact@example.com",
    termsAndConditions: "# شروط الاستخدام\n\nهذه هي شروط استخدام الموقع...",
    privacyPolicy: "# سياسة الخصوصية\n\nنحن نحترم خصوصيتك...",
  });

  useEffect(() => {
    // التحقق مما إذا كان المستخدم مديرًا
    if (session?.user && session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // في تطبيق حقيقي، استبدل بمكالمة API
        // const response = await fetch('/api/admin/settings');
        // const data = await response.json();
        // setSettings(data);
        
        // هنا نستخدم البيانات الافتراضية المحددة مسبقًا
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [session, router]);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // في تطبيق حقيقي، قم بإرسال البيانات إلى الخادم
      // await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      // محاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: language === 'ar' ? 'تم حفظ الإعدادات' : 'Settings Saved',
        description: language === 'ar' 
          ? 'تم تحديث إعدادات الموقع بنجاح'
          : 'Site settings have been updated successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'حدث خطأ أثناء حفظ الإعدادات'
          : 'An error occurred while saving settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
        </h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            {language === 'ar' ? 'عام' : 'General'}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            {language === 'ar' ? 'الأمان' : 'Security'}
          </TabsTrigger>
          <TabsTrigger value="content">
            <Upload className="mr-2 h-4 w-4" />
            {language === 'ar' ? 'المحتوى' : 'Content'}
          </TabsTrigger>
          <TabsTrigger value="legal">
            <Settings className="mr-2 h-4 w-4" />
            {language === 'ar' ? 'قانوني' : 'Legal'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">
                  {language === 'ar' ? 'اسم الموقع' : 'Site Name'}
                </Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  {language === 'ar' ? 'البريد الإلكتروني للتواصل' : 'Contact Email'}
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">
                {language === 'ar' ? 'وصف الموقع' : 'Site Description'}
              </Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
              />
              <Label htmlFor="maintenanceMode">
                {language === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => handleChange('enableRegistration', checked)}
              />
              <Label htmlFor="enableRegistration">
                {language === 'ar' ? 'تمكين التسجيل' : 'Enable Registration'}
              </Label>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="defaultUserRole">
                {language === 'ar' ? 'الصلاحية الافتراضية للمستخدمين الجدد' : 'Default User Role'}
              </Label>
              <select
                id="defaultUserRole"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={settings.defaultUserRole}
                onChange={(e) => handleChange('defaultUserRole', e.target.value)}
              >
                <option value="USER">{language === 'ar' ? 'مستخدم' : 'User'}</option>
                <option value="MODERATOR">{language === 'ar' ? 'مشرف' : 'Moderator'}</option>
                <option value="ADMIN">{language === 'ar' ? 'مدير' : 'Admin'}</option>
              </select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableComments"
                checked={settings.enableComments}
                onCheckedChange={(checked) => handleChange('enableComments', checked)}
              />
              <Label htmlFor="enableComments">
                {language === 'ar' ? 'تمكين التعليقات' : 'Enable Comments'}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enableReports"
                checked={settings.enableReports}
                onCheckedChange={(checked) => handleChange('enableReports', checked)}
              />
              <Label htmlFor="enableReports">
                {language === 'ar' ? 'تمكين البلاغات' : 'Enable Reports'}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleChange('enableNotifications', checked)}
              />
              <Label htmlFor="enableNotifications">
                {language === 'ar' ? 'تمكين الإشعارات' : 'Enable Notifications'}
              </Label>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="maxUploadSize">
                {language === 'ar' ? 'الحد الأقصى لحجم الملفات (ميجابايت)' : 'Max Upload Size (MB)'}
              </Label>
              <Input
                id="maxUploadSize"
                type="number"
                min="1"
                max="100"
                value={settings.maxUploadSize}
                onChange={(e) => handleChange('maxUploadSize', parseInt(e.target.value))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="termsAndConditions">
                {language === 'ar' ? 'شروط الاستخدام' : 'Terms and Conditions'}
              </Label>
              <Textarea
                id="termsAndConditions"
                value={settings.termsAndConditions}
                onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                rows={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="privacyPolicy">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Label>
              <Textarea
                id="privacyPolicy"
                value={settings.privacyPolicy}
                onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                rows={10}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving 
            ? (language === 'ar' ? 'جارِ الحفظ...' : 'Saving...') 
            : (language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings')}
        </Button>
      </div>
    </div>
  );
} 