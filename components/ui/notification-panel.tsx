"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { pusherClient, EVENTS } from "@/lib/services/pusher";
import axios from "axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationPanel() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // جلب الإشعارات
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session?.user?.id]);

  // الاستماع للإشعارات الجديدة
  useEffect(() => {
    if (session?.user?.id) {
      const channel = pusherClient.subscribe(`user-${session.user.id}`);

      channel.bind(EVENTS.NEW_NOTIFICATION, (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        pusherClient.unsubscribe(`user-${session.user.id}`);
      };
    }
  }, [session?.user?.id]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/notifications");
      setNotifications(data.notifications);
      setUnreadCount(
        data.notifications.filter((n: Notification) => !n.read).length,
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put("/api/notifications/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!session?.user) return null;

  return (
    <div className="relative">
      {/* زر الإشعارات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-secondary transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* لوحة الإشعارات */}
      {isOpen && (
        <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-80 md:w-96 bg-card rounded-md shadow-lg border border-border z-50 overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-bold">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                لا توجد إشعارات
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border hover:bg-muted/30 transition-colors relative ${
                    !notification.read ? "bg-muted/20" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-primary hover:text-primary/80 p-1 rounded-full hover:bg-muted transition-colors"
                        title="تعليم كمقروء"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-border">
            <Link
              href="/notifications"
              className="text-center block w-full text-sm text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              عرض كل الإشعارات
            </Link>
          </div>
        </div>
      )}

      {/* الخلفية الشفافة لإغلاق اللوحة عند النقر خارجها */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
