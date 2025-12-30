"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  Plus,
  X,
  Move,
  Info,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface MangaInfo {
  id: string;
  title: string;
  type: 'MANGA' | 'NOVEL';
  coverImage: string;
  authorId: string;
  isPublished: boolean;
}

interface ChapterPage {
  id: string;
  imageUrl: string;
  order: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

// مكون للصفحة القابلة للسحب
const DraggablePage = ({ 
  page, 
  index, 
  movePage, 
  removePage 
}: { 
  page: ChapterPage; 
  index: number; 
  movePage: (dragIndex: number, hoverIndex: number) => void;
  removePage: (index: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'PAGE',
    item: { type: 'PAGE', id: page.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: 'PAGE',
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // لا تستبدل العناصر مع نفسها
      if (dragIndex === hoverIndex) {
        return;
      }
      
      movePage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  
  drag(drop(ref));
  
  return (
    <div 
      ref={ref}
      className={`relative border rounded-md overflow-hidden ${isDragging ? 'opacity-50' : ''}`}
    >
      <img 
        src={page.imageUrl} 
        alt={`صفحة ${page.order + 1}`} 
        className="w-full h-40 object-cover"
      />
      <div className="absolute top-0 left-0 p-1 bg-black/50 text-white rounded-br-md">
        {page.order + 1}
      </div>
      <button 
        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-md"
        onClick={() => removePage(index)}
      >
        <X size={16} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-2 py-1 flex justify-center">
        <Move size={16} className="cursor-move" />
      </div>
    </div>
  );
};

export default function UploadChapterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const mangaId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingManga, setIsFetchingManga] = useState(true);
  const [manga, setManga] = useState<MangaInfo | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    number: 1,
    isPublished: false,
  });
  
  const [chapterPages, setChapterPages] = useState<ChapterPage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      fetchMangaInfo();
    }
  }, [status, router, mangaId]);

  const fetchMangaInfo = async () => {
    setIsFetchingManga(true);
    try {
      const { data } = await axios.get(`/api/manga/${mangaId}`);
      setManga(data);
      
      // الحصول على أعلى رقم فصل
      const { data: chapters } = await axios.get(`/api/manga/${mangaId}/chapters`);
      if (chapters.length > 0) {
        // افتراض أن الفصول مرتبة بشكل تنازلي
        const highestNumber = chapters[0].number;
        setFormData(prev => ({ ...prev, number: highestNumber + 1 }));
      }
    } catch (error) {
      console.error("Error fetching manga:", error);
      toast.error("حدث خطأ أثناء تحميل معلومات المانجا");
    } finally {
      setIsFetchingManga(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setFormData(prev => ({ ...prev, number: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      
      // إنشاء روابط مؤقتة للصور
      const newPages = files.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        imageUrl: URL.createObjectURL(file),
        order: chapterPages.length + index,
      }));
      
      setChapterPages(prev => [...prev, ...newPages]);
    }
  };

  const movePage = (dragIndex: number, hoverIndex: number) => {
    const draggedPage = chapterPages[dragIndex];
    const newPages = [...chapterPages];
    newPages.splice(dragIndex, 1);
    newPages.splice(hoverIndex, 0, draggedPage);
    
    // تحديث ترتيب الصفحات
    const updatedPages = newPages.map((page, index) => ({
      ...page,
      order: index,
    }));
    
    setChapterPages(updatedPages);
  };

  const removePage = (index: number) => {
    const newPages = [...chapterPages];
    newPages.splice(index, 1);
    
    // تحديث ترتيب الصفحات
    const updatedPages = newPages.map((page, index) => ({
      ...page,
      order: index,
    }));
    
    setChapterPages(updatedPages);
    
    // تحديث قائمة الملفات المحددة
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!manga) return;
    
    if (chapterPages.length === 0) {
      toast.error("يجب إضافة صفحة واحدة على الأقل");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // رفع الصور أولاً
      // في التطبيق الحقيقي، سترفع الصور إلى خدمة مثل Cloudinary أو AWS S3
      // هنا نفترض أننا نستخدم عناوين URL وهمية
      
      const uploadedImages = chapterPages.map((page, index) => ({
        imageUrl: `https://example.com/images/chapter-${Date.now()}-${index}.jpg`,
        order: page.order,
      }));
      
      // إنشاء الفصل الجديد
      const chapterData = {
        title: formData.title,
        number: formData.number,
        isPublished: publish,
        pages: uploadedImages,
      };
      
      const { data } = await axios.post(`/api/manga/${mangaId}/chapters`, chapterData);
      
      toast.success(publish ? "تم نشر الفصل بنجاح" : "تم حفظ الفصل كمسودة");
      
      // التوجيه إلى صفحة المانجا
      router.push(`/manga/${mangaId}`);
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast.error("حدث خطأ أثناء إنشاء الفصل");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isFetchingManga) {
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

  if (!manga) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">المانجا غير موجودة</h2>
            <p className="text-muted-foreground mb-6">
              لم نتمكن من العثور على المانجا المطلوبة
            </p>
            <Button onClick={() => router.push("/")}>
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">إضافة فصل جديد</h1>
            
            <div className="mb-8 bg-card p-4 rounded-lg flex items-center gap-6">
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="w-24 h-36 object-cover rounded-md"
              />
              <div>
                <h2 className="text-xl font-bold">{manga.title}</h2>
                <p className="text-muted-foreground mb-2">
                  {manga.type === 'MANGA' ? 'مانجا' : 'رواية'}
                </p>
                {!manga.isPublished && (
                  <div className="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-md inline-flex items-center gap-1">
                    <Info size={14} />
                    <span className="text-sm">هذه المانجا غير منشورة</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-6">معلومات الفصل</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="title" className="block text-sm font-medium mb-1">
                    عنوان الفصل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="أدخل عنوان الفصل"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="number" className="block text-sm font-medium mb-1">
                    رقم الفصل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    type="number"
                    min="1"
                    value={formData.number}
                    onChange={handleNumberChange}
                    placeholder="رقم الفصل"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-6">صفحات الفصل</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-6">
                <BookOpen className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">اسحب الصور هنا أو انقر للاختيار</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="page-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="page-upload">اختر صور الفصل</label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  يمكنك اختيار صفحات متعددة في المرة الواحدة
                </p>
              </div>
              
              {chapterPages.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">الصفحات المختارة ({chapterPages.length})</h3>
                    <p className="text-sm text-muted-foreground">اسحب لتغيير الترتيب</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {chapterPages.map((page, index) => (
                      <DraggablePage
                        key={page.id}
                        page={page}
                        index={index}
                        movePage={movePage}
                        removePage={removePage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">نشر الفصل</h2>
              
              <div className="flex items-center mb-6">
                <input
                  id="isPublished"
                  name="isPublished"
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isPublished" className="mr-2 text-sm">
                  نشر الفصل فوراً
                </Label>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
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
                      نشر الفصل
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد من نشر الفصل؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        بمجرد النشر، سيكون الفصل متاحًا لجميع المستخدمين. تأكد من مراجعة الصفحات.
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
        </main>

        <Footer />
      </div>
    </DndProvider>
  );
} 