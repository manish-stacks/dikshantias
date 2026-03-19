import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/lib/store/auth.store";



export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const useNotificationWeb = () => {
    const {user} = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all notifications + derive unread count locally
  const fetchNotifications = async () => {
    try {
        
      const res = await axiosInstance.get(`/notifications/my`);

      if (res.data.success) {
        const data = res.data.data as Notification[];
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (error: any) {
      console.error("Fetch notifications error:", error.response?.data || error);
      // You can replace this with a toast library if you want
    } finally {
      setLoading(false);
    }
  };

  // Separate unread count endpoint (kept for consistency with original API)
  const fetchUnreadCount = async () => {
    try {
      const res = await axiosInstance.get(`/notifications/unread-count`);
      if (res.data.success) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.error("Unread count error:", error);
    }
  };

  // Mark all as read (optimistic update)
  const markAllAsRead = async () => {
    try {
      await axiosInstance.post(
        `/notifications/mark-all-read`
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  // Public refresh function (web equivalent of pull-to-refresh)
  const refetch = async () => {
    setLoading(true);
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    refetch,
  };
};