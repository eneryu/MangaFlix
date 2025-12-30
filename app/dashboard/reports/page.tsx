"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MoreHorizontal, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Flag,
  User
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";

interface ReportedUser {
  id: string;
  name: string;
  email: string;
}

interface Report {
  id: string;
  reportType: 'MANGA' | 'CHAPTER' | 'COMMENT' | 'USER';
  reason: string;
  details: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  reportedItemId: string;
  reportedItemTitle?: string;
  reportedUser?: ReportedUser;
  reporterName: string;
  reporterId: string;
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const { language } = useLanguage();

  // البيانات الوهمية - استبدلها بمكالمة API حقيقية في الإنتاج
  const mockReports: Report[] = [
    {
      id: "1",
      reportType: "MANGA",
      reason: "محتوى غير مناسب",
      details: "يحتوي هذا المانجا على مشاهد عنيفة بشكل مبالغ فيه ولا يتناسب مع التصنيف العمري.",
      status: "PENDING",
      createdAt: "2023-10-15T10:00:00Z",
      reportedItemId: "manga-123",
      reportedItemTitle: "ون بيس",
      reporterName: "أحمد خالد",
      reporterId: "user-456",
    },
    {
      id: "2",
      reportType: "COMMENT",
      reason: "خطاب كراهية",
      details: "هذا التعليق يحتوي على ألفاظ غير لائقة ويهاجم مجموعة معينة.",
      status: "PENDING",
      createdAt: "2023-10-18T12:30:00Z",
      reportedItemId: "comment-789",
      reporterName: "سارة محمد",
      reporterId: "user-567",
    },
    {
      id: "3",
      reportType: "USER",
      reason: "سلوك مسيء",
      details: "هذا المستخدم يقوم بنشر تعليقات مسيئة باستمرار ويتحرش بالمستخدمين الآخرين.",
      status: "RESOLVED",
      createdAt: "2023-10-20T15:45:00Z",
      reportedItemId: "user-789",
      reportedUser: {
        id: "user-789",
        name: "خالد عمر",
        email: "khaled@example.com",
      },
      reporterName: "علي حسن",
      reporterId: "user-890",
    },
    {
      id: "4",
      reportType: "CHAPTER",
      reason: "حقوق النشر",
      details: "هذا الفصل منسوخ من موقع آخر ويخالف حقوق النشر.",
      status: "REJECTED",
      createdAt: "2023-10-22T09:15:00Z",
      reportedItemId: "chapter-456",
      reportedItemTitle: "هجوم العمالقة - الفصل 45",
      reporterName: "فاطمة أحمد",
      reporterId: "user-123",
    },
    {
      id: "5",
      reportType: "MANGA",
      reason: "ترجمة خاطئة",
      details: "هناك أخطاء كثيرة في ترجمة هذا المانجا تؤثر على فهم القصة.",
      status: "PENDING",
      createdAt: "2023-10-25T14:00:00Z",
      reportedItemId: "manga-789",
      reportedItemTitle: "ناروتو",
      reporterName: "محمد خالد",
      reporterId: "user-234",
    },
  ];

  useEffect(() => {
    // التحقق مما إذا كان المستخدم مشرفًا أو مديرًا
    if (session?.user && !['ADMIN', 'MODERATOR'].includes(session.user.role as string)) {
      router.push('/dashboard');
      return;
    }

    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // في تطبيق حقيقي، استبدل بمكالمة API
        // const response = await fetch('/api/admin/reports');
        // const data = await response.json();
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [session, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleResolveReport = async (reportId: string) => {
    // في تطبيق حقيقي، قم بمكالمة API
    // await fetch(`/api/admin/reports/${reportId}/resolve`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ note: actionNote })
    // });

    // تحديث الحالة المحلية لتعكس التغييرات
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'RESOLVED' } : report
    ));

    toast({
      title: language === 'ar' ? 'تم حل البلاغ' : 'Report Resolved',
      description: language === 'ar' 
        ? 'تم تحديث حالة البلاغ بنجاح'
        : 'Report status has been updated successfully',
      variant: 'default',
    });

    setIsDialogOpen(false);
    setActionNote("");
  };

  const handleRejectReport = async (reportId: string) => {
    // في تطبيق حقيقي، قم بمكالمة API
    // await fetch(`/api/admin/reports/${reportId}/reject`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ note: actionNote })
    // });

    // تحديث الحالة المحلية لتعكس التغييرات
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'REJECTED' } : report
    ));

    toast({
      title: language === 'ar' ? 'تم رفض البلاغ' : 'Report Rejected',
      description: language === 'ar' 
        ? 'تم تحديث حالة البلاغ بنجاح'
        : 'Report status has been updated successfully',
      variant: 'default',
    });

    setIsDialogOpen(false);
    setActionNote("");
  };

  const viewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      (report.reportedItemTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? report.status === statusFilter : true;
    const matchesType = typeFilter ? report.reportType === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getReportTypeLabel = (type: string) => {
    if (language === 'ar') {
      switch (type) {
        case 'MANGA': return 'مانجا';
        case 'CHAPTER': return 'فصل';
        case 'COMMENT': return 'تعليق';
        case 'USER': return 'مستخدم';
        default: return type;
      }
    } else {
      return type.charAt(0) + type.slice(1).toLowerCase();
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case 'PENDING': return 'قيد المراجعة';
        case 'RESOLVED': return 'تم الحل';
        case 'REJECTED': return 'مرفوض';
        default: return status;
      }
    } else {
      switch (status) {
        case 'PENDING': return 'Pending';
        case 'RESOLVED': return 'Resolved';
        case 'REJECTED': return 'Rejected';
        default: return status.charAt(0) + status.slice(1).toLowerCase();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {language === 'ar' ? 'إدارة البلاغات' : 'Reports Management'}
        </h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={statusFilter ?? ''}
          onValueChange={(value) => setStatusFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language === 'ar' ? 'جميع الحالات' : 'All statuses'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              {language === 'ar' ? 'جميع الحالات' : 'All statuses'}
            </SelectItem>
            <SelectItem value="PENDING">
              {language === 'ar' ? 'قيد المراجعة' : 'Pending'}
            </SelectItem>
            <SelectItem value="RESOLVED">
              {language === 'ar' ? 'تم الحل' : 'Resolved'}
            </SelectItem>
            <SelectItem value="REJECTED">
              {language === 'ar' ? 'مرفوض' : 'Rejected'}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={typeFilter ?? ''}
          onValueChange={(value) => setTypeFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language === 'ar' ? 'جميع الأنواع' : 'All types'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              {language === 'ar' ? 'جميع الأنواع' : 'All types'}
            </SelectItem>
            <SelectItem value="MANGA">
              {language === 'ar' ? 'مانجا' : 'Manga'}
            </SelectItem>
            <SelectItem value="CHAPTER">
              {language === 'ar' ? 'فصل' : 'Chapter'}
            </SelectItem>
            <SelectItem value="COMMENT">
              {language === 'ar' ? 'تعليق' : 'Comment'}
            </SelectItem>
            <SelectItem value="USER">
              {language === 'ar' ? 'مستخدم' : 'User'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'ar' ? 'النوع' : 'Type'}</TableHead>
              <TableHead>{language === 'ar' ? 'السبب' : 'Reason'}</TableHead>
              <TableHead>{language === 'ar' ? 'العنصر' : 'Item'}</TableHead>
              <TableHead>{language === 'ar' ? 'المبلغ' : 'Reporter'}</TableHead>
              <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
              <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  {language === 'ar' ? 'لا توجد بلاغات' : 'No reports found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant={
                      report.reportType === 'MANGA' ? 'default' :
                      report.reportType === 'CHAPTER' ? 'secondary' :
                      report.reportType === 'COMMENT' ? 'outline' :
                      'destructive'
                    }>
                      {getReportTypeLabel(report.reportType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={report.reason}>
                    {report.reason}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={report.reportedItemTitle || report.reportedUser?.name || report.reportedItemId}>
                    {report.reportedItemTitle || report.reportedUser?.name || `ID: ${report.reportedItemId.substring(0, 10)}...`}
                  </TableCell>
                  <TableCell>{report.reporterName}</TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      report.status === 'PENDING' ? 'outline' :
                      report.status === 'RESOLVED' ? 'success' :
                      'destructive'
                    }>
                      {getStatusLabel(report.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">
                            {language === 'ar' ? 'فتح القائمة' : 'Open menu'}
                          </span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {language === 'ar' ? 'الإجراءات' : 'Actions'}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => viewDetails(report)}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        </DropdownMenuItem>
                        
                        {report.status === 'PENDING' && (
                          <>
                            {report.reportType === 'USER' && (
                              <DropdownMenuItem onClick={() => router.push(`/profile/${report.reportedItemId}`)}>
                                <User className="mr-2 h-4 w-4" />
                                {language === 'ar' ? 'عرض ملف المستخدم' : 'View User Profile'}
                              </DropdownMenuItem>
                            )}
                            
                            {(report.reportType === 'MANGA' || report.reportType === 'CHAPTER') && (
                              <DropdownMenuItem onClick={() => router.push(`/${report.reportType.toLowerCase()}/${report.reportedItemId}`)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {language === 'ar' ? 'عرض المحتوى' : 'View Content'}
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedReport(report);
                                setIsDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              {language === 'ar' ? 'تأكيد البلاغ' : 'Resolve Report'}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedReport(report);
                                setIsDialogOpen(true);
                              }}
                            >
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              {language === 'ar' ? 'رفض البلاغ' : 'Reject Report'}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'تفاصيل البلاغ' : 'Report Details'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? `بلاغ عن ${selectedReport?.reportType === 'MANGA' ? 'مانجا' 
                    : selectedReport?.reportType === 'CHAPTER' ? 'فصل' 
                    : selectedReport?.reportType === 'COMMENT' ? 'تعليق' 
                    : 'مستخدم'}`
                : `Report about ${selectedReport?.reportType?.toLowerCase()}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">
                  {language === 'ar' ? 'النوع:' : 'Type:'}
                </h4>
                <p className="text-sm">
                  {getReportTypeLabel(selectedReport.reportType)}
                </p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">
                  {language === 'ar' ? 'السبب:' : 'Reason:'}
                </h4>
                <p className="text-sm">{selectedReport.reason}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">
                  {language === 'ar' ? 'التفاصيل:' : 'Details:'}
                </h4>
                <p className="text-sm whitespace-pre-wrap">{selectedReport.details}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">
                  {language === 'ar' ? 'تم الإبلاغ بواسطة:' : 'Reported by:'}
                </h4>
                <p className="text-sm">{selectedReport.reporterName}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">
                  {language === 'ar' ? 'تاريخ الإبلاغ:' : 'Report date:'}
                </h4>
                <p className="text-sm">{formatDate(selectedReport.createdAt)}</p>
              </div>
              
              {selectedReport.status === 'PENDING' && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">
                    {language === 'ar' ? 'ملاحظات الإجراء:' : 'Action notes:'}
                  </h4>
                  <Textarea
                    placeholder={
                      language === 'ar' 
                        ? 'أضف ملاحظات حول الإجراء المتخذ (اختياري)' 
                        : 'Add notes about the action taken (optional)'
                    }
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          )}
          
          {selectedReport?.status === 'PENDING' && (
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => handleRejectReport(selectedReport.id)}
                className="mr-2"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'رفض البلاغ' : 'Reject Report'}
              </Button>
              <Button 
                onClick={() => handleResolveReport(selectedReport.id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'تأكيد البلاغ' : 'Resolve Report'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 