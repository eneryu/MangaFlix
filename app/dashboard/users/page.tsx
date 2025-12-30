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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Search, 
  UserCog, 
  ShieldAlert, 
  UserX,
  User as UserIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/language-provider";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  level: number;
  createdAt: string;
  score: number;
  subscriptionTier: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const { language } = useLanguage();

  // Mock data - replace with actual API call in production
  const mockUsers: User[] = [
    {
      id: "1",
      name: "محمد أحمد",
      email: "jack@example.com",
      role: "ADMIN",
      level: 30,
      createdAt: "2023-05-10T10:00:00Z",
      score: 1250,
      subscriptionTier: "premium",
    },
    {
      id: "2",
      name: "علي حسن",
      email: "ali@example.com",
      role: "MODERATOR",
      level: 25,
      createdAt: "2023-06-15T10:00:00Z",
      score: 850,
      subscriptionTier: "standard",
    },
    {
      id: "3",
      name: "سارة محمود",
      email: "sara@example.com",
      role: "USER",
      level: 18,
      createdAt: "2023-07-20T10:00:00Z",
      score: 450,
      subscriptionTier: "free",
    },
    {
      id: "4",
      name: "خالد عمر",
      email: "khaled@example.com",
      role: "USER",
      level: 10,
      createdAt: "2023-08-25T10:00:00Z",
      score: 150,
      subscriptionTier: "free",
    },
    {
      id: "5",
      name: "ليلى كريم",
      email: "laila@example.com",
      role: "MODERATOR",
      level: 22,
      createdAt: "2023-09-05T10:00:00Z",
      score: 750,
      subscriptionTier: "standard",
    },
  ];

  useEffect(() => {
    // Check if user is admin or moderator
    if (session?.user && !['ADMIN', 'MODERATOR'].includes(session.user.role as string)) {
      router.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // In a real app, replace with API call
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [session, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // In a real app, make API call to update user role
      // await fetch(`/api/admin/users/${userId}/role`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ role: newRole })
      // });

      // Update local state to reflect changes
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as 'USER' | 'MODERATOR' | 'ADMIN' } : user
      ));

      toast({
        title: "تم تحديث الصلاحيات بنجاح",
        description: "تم تغيير صلاحيات المستخدم بنجاح",
      });
    } catch (error) {
      console.error("خطأ في تحديث الصلاحيات:", error);
      toast({
        variant: "destructive",
        title: "فشل تحديث الصلاحيات",
        description: "حدث خطأ أثناء تحديث صلاحيات المستخدم",
      });
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      // In a real app, make API call to ban user
      // await fetch(`/api/admin/users/${userId}/ban`, {
      //   method: 'POST'
      // });

      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId));

      toast({
        title: "تم حظر المستخدم بنجاح",
        description: "تم حظر المستخدم من الموقع",
      });
    } catch (error) {
      console.error("خطأ في حظر المستخدم:", error);
      toast({
        variant: "destructive",
        title: "فشل حظر المستخدم",
        description: "حدث خطأ أثناء حظر المستخدم",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const getRoleDisplayName = (role: string) => {
    if (language === 'ar') {
      switch (role) {
        case 'ADMIN': return 'مدير';
        case 'MODERATOR': return 'مشرف';
        case 'USER': return 'مستخدم';
        default: return role;
      }
    } else {
      return role.charAt(0) + role.slice(1).toLowerCase();
    }
  };

  const getSubscriptionTierDisplayName = (tier: string) => {
    if (language === 'ar') {
      switch (tier) {
        case 'premium': return 'بريميوم';
        case 'standard': return 'قياسي';
        case 'free': return 'مجاني';
        default: return tier;
      }
    } else {
      return tier.charAt(0).toUpperCase() + tier.slice(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
        </h1>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={language === 'ar' ? 'بحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={roleFilter ?? ''}
          onValueChange={(value) => setRoleFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language === 'ar' ? 'جميع الصلاحيات' : 'All roles'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              {language === 'ar' ? 'جميع الصلاحيات' : 'All roles'}
            </SelectItem>
            <SelectItem value="ADMIN">
              {language === 'ar' ? 'مدير' : 'Admin'}
            </SelectItem>
            <SelectItem value="MODERATOR">
              {language === 'ar' ? 'مشرف' : 'Moderator'}
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
              <TableHead>{language === 'ar' ? 'المستخدم' : 'User'}</TableHead>
              <TableHead>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
              <TableHead>{language === 'ar' ? 'الصلاحية' : 'Role'}</TableHead>
              <TableHead>{language === 'ar' ? 'المستوى' : 'Level'}</TableHead>
              <TableHead>{language === 'ar' ? 'النقاط' : 'Score'}</TableHead>
              <TableHead>{language === 'ar' ? 'نوع الاشتراك' : 'Subscription'}</TableHead>
              <TableHead>{language === 'ar' ? 'تاريخ التسجيل' : 'Joined'}</TableHead>
              <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'MODERATOR' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell>{user.score.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.subscriptionTier === 'premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.subscriptionTier === 'standard' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getSubscriptionTierDisplayName(user.subscriptionTier)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/profile/${user.id}`)}>
                          <UserIcon className="mr-2 h-4 w-4" />
                          {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                        </DropdownMenuItem>
                        
                        {session?.user?.role === 'ADMIN' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(user.id, 'USER')}
                              disabled={user.role === 'USER'}
                            >
                              <UserIcon className="mr-2 h-4 w-4" />
                              {language === 'ar' ? 'تعيين كمستخدم' : 'Set as User'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(user.id, 'MODERATOR')}
                              disabled={user.role === 'MODERATOR'}
                            >
                              <ShieldAlert className="mr-2 h-4 w-4" />
                              {language === 'ar' ? 'تعيين كمشرف' : 'Set as Moderator'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRoleChange(user.id, 'ADMIN')}
                              disabled={user.role === 'ADMIN'}
                            >
                              <UserCog className="mr-2 h-4 w-4" />
                              {language === 'ar' ? 'تعيين كمدير' : 'Set as Admin'}
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleBanUser(user.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          {language === 'ar' ? 'حظر المستخدم' : 'Ban User'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 