import Pusher from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "eu",
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
  },
);

// أحداث الإشعارات
export const EVENTS = {
  NEW_NOTIFICATION: "new-notification",
  NEW_CHAPTER: "new-chapter",
  NEW_MANGA: "new-manga",
  NEW_COMMENT: "new-comment",
  NEW_LIKE: "new-like",
};

// إرسال إشعار لمستخدم معين
export const sendNotificationToUser = async (
  userId: string,
  notification: any,
) => {
  return await pusherServer.trigger(
    `user-${userId}`,
    EVENTS.NEW_NOTIFICATION,
    notification,
  );
};

// إرسال إشعار بفصل جديد لمتابعي المانجا
export const sendNewChapterNotification = async (
  mangaId: string,
  chapterData: any,
) => {
  return await pusherServer.trigger(
    `manga-${mangaId}`,
    EVENTS.NEW_CHAPTER,
    chapterData,
  );
};

// إرسال إشعار للكل بمانجا جديدة
export const sendNewMangaNotification = async (mangaData: any) => {
  return await pusherServer.trigger(
    "public-channel",
    EVENTS.NEW_MANGA,
    mangaData,
  );
};
