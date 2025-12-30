"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  X,
  Tag,
  Info,
  Book,
  Star 
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Genre {
  id: string;
  name: string;
}

export default function UploadMangaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "MANGA", // MANGA أو NOVEL
    status: "ONGOING", // ONGOING, COMPLETED, HIATUS, CANCELLED
    coverImage: "",
    bannerImage: "",
    genres: [] as string[],
    isExplicit: false,
    isOriginal: true,
    isFeatured: false,
    isPublished: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      fetchGenres();
    }
  }, [status, router]);

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get("/api/genres");
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      toast.error("حدث خطأ أثناء تحميل الأنواع");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleGenreChange = (genreId: string) => {
    setFormData(prev => {
      if (prev.genres.includes(genreId)) {
        return {
          ...prev,
          genres: prev.genres.filter(id => id !== genreId)
        };
      } else {
        return {
          ...prev,
          genres: [...prev.genres, genreId]
        };
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'coverImage' | 'bannerImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // هنا يمكنك تنفيذ رفع الملف إلى خادم الصور الخاص بك
    // في هذا المثال، سنفترض أننا نضيف عنوان URL وهمي
    
    // في التطبيق الفعلي، ستقوم برفع الصورة إلى خدمة مثل Cloudinary أو AWS S3
    // const formData = new FormData();
    // formData.append('file', file);
    // const { data } = await axios.post('/api/upload', formData);
    // setFormData(prev => ({ ...prev, [type]: data.url }));

    // لأغراض العرض التوضيحي، سنستخدم فقط نص بديل
    const dummyUrl = `https://example.com/images/${type}-${Date.now()}.jpg`;
    setFormData(prev => ({ ...prev, [type]: dummyUrl }));
    toast.success("تم رفع الصورة بنجاح (هذه رسالة تجريبية فقط)");
  };

  const handleSubmit = async (publish: boolean) => {
    setIsLoading(true);
    
    try {
      // إعداد بيانات الإرسال
      const submitData = {
        ...formData,
        isPublished: publish,
      };
      
      // إرسال البيانات إلى الخادم
      const { data } = await axios.post("/api/manga", submitData);
      
      toast.success(publish ? "تم نشر المانجا بنجاح" : "تم حفظ المانجا كمسودة");
      
      // التوجيه إلى صفحة المانجا
      router.push(`/manga/${data.id}`);
    } catch (error) {
      console.error("Error creating manga:", error);
      toast.error("حدث خطأ أثناء إنشاء المانجا");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (status === "loading") {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">إضافة مانجا جديدة</h1>
          
          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <div className={`w-16 h-2 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <div className={`w-16 h-2 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">الخطوة {currentStep} من 3</span>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md">
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">معلومات أساسية</h2>
                
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    العنوان <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="أدخل عنوان المانجا"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    الوصف <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="اكتب وصفاً للمانجا"
                    rows={5}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-1">
                      النوع <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANGA">مانجا</SelectItem>
                        <SelectItem value="NOVEL">رواية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-1">
                      الحالة <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONGOING">مستمر</SelectItem>
                        <SelectItem value="COMPLETED">مكتمل</SelectItem>
                        <SelectItem value="HIATUS">متوقف مؤقتًا</SelectItem>
                        <SelectItem value="CANCELLED">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <input
                      id="isOriginal"
                      name="isOriginal"
                      type="checkbox"
                      checked={formData.isOriginal}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isOriginal" className="mr-2 text-sm">
                      عمل أصلي
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="isExplicit"
                      name="isExplicit"
                      type="checkbox"
                      checked={formData.isExplicit}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isExplicit" className="mr-2 text-sm">
                      محتوى للكبار فقط (+18)
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">الصور والتصنيفات</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      صورة الغلاف <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">اسحب الصورة هنا أو انقر للاختيار</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'coverImage')}
                        className="hidden"
                        id="cover-upload"
                      />
                      <Button asChild size="sm" variant="outline">
                        <label htmlFor="cover-upload">اختر صورة</label>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        نسبة 2:3 هي الأفضل، الحد الأقصى 2MB
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      صورة البانر (اختياري)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">صورة خلفية لصفحة التفاصيل</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'bannerImage')}
                        className="hidden"
                        id="banner-upload"
                      />
                      <Button asChild size="sm" variant="outline">
                        <label htmlFor="banner-upload">اختر صورة</label>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        نسبة 16:9 هي الأفضل، الحد الأقصى 4MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الأنواع (اختر على الأقل واحد) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.genres.map(genreId => {
                      const genre = genres.find(g => g.id === genreId);
                      return genre ? (
                        <div 
                          key={genre.id} 
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span className="text-sm">{genre.name}</span>
                          <button
                            type="button"
                            onClick={() => handleGenreChange(genre.id)}
                            className="text-primary/70 hover:text-primary"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {genres.map(genre => (
                      <div key={genre.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`genre-${genre.id}`}
                          checked={formData.genres.includes(genre.id)}
                          onChange={() => handleGenreChange(genre.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`genre-${genre.id}`} className="mr-2 text-sm">
                          {genre.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">مراجعة ونشر</h2>
                
                <div className="bg-card border rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <Info size={16} /> معلومات أساسية
                      </h3>
                      <ul className="text-sm space-y-2">
                        <li><span className="font-medium">العنوان:</span> {formData.title}</li>
                        <li><span className="font-medium">النوع:</span> {formData.type === 'MANGA' ? 'مانجا' : 'رواية'}</li>
                        <li><span className="font-medium">الحالة:</span> {
                          formData.status === 'ONGOING' ? 'مستمر' :
                          formData.status === 'COMPLETED' ? 'مكتمل' :
                          formData.status === 'HIATUS' ? 'متوقف مؤقتًا' : 'ملغي'
                        }</li>
                        <li><span className="font-medium">عمل أصلي:</span> {formData.isOriginal ? 'نعم' : 'لا'}</li>
                        <li><span className="font-medium">محتوى للكبار:</span> {formData.isExplicit ? 'نعم' : 'لا'}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <Tag size={16} /> التصنيفات
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {formData.genres.map(genreId => {
                          const genre = genres.find(g => g.id === genreId);
                          return genre ? (
                            <span 
                              key={genre.id} 
                              className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
                            >
                              {genre.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Book size={16} /> الوصف
                    </h3>
                    <p className="text-sm whitespace-pre-line">{formData.description}</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">قم بنشر المانجا أو احفظها كمسودة</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    يمكنك نشر المانجا الآن لتكون متاحة للجميع، أو حفظها كمسودة للتعديل عليها لاحقًا.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSubmit(false)}
                      disabled={isLoading}
                    >
                      حفظ كمسودة
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button disabled={isLoading}>
                          نشر المانجا
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد من نشر المانجا؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            بمجرد النشر، ستكون المانجا متاحة لجميع المستخدمين. تأكد من مراجعة جميع المعلومات.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleSubmit(true)}>
                            {isLoading ? "جاري النشر..." : "نشر"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronRight className="ml-2 h-4 w-4" /> السابق
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={nextStep}>
                  التالي <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 