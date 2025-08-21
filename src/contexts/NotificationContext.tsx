"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { APICalls } from '@/api/api-calls';

interface Notification {
  id: number;
  type: string;
  isRead: boolean;
  createdAt: string;
  auditLog?: {
    cpNumber?: string;
    user?: {
      name: string;
    };
  };
}

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  initialized: boolean;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  refreshNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  getDashboardNotifications: () => Promise<any>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markMultipleAsRead: (notificationIds: number[]) => Promise<void>;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const refreshNotifications = async () => {
    try {
      setLoading(true);
      // Reset pagination when refreshing
      setCurrentPage(1);
      setHasMore(true);
      
      const data = await APICalls.getNotificationsPaginated(1, pageSize);
      const records = data?.records || [];
      setUnreadCount(data?.totalUnreadCount || 0);
      setTotalCount(data?.totalRecords || 0);
      setNotifications(records);
      setHasMore(data?.hasMore || false);
      setInitialized(true);
      console.log("Notifications refreshed:", data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNotifications = async () => {
    // Check if we already have all notifications loaded
    if (loading || notifications.length >= totalCount) {
      return;
    }
    
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const data = await APICalls.getNotificationsPaginated(nextPage, pageSize);
      const newRecords = data?.records || [];
      
      setNotifications(prev => [...prev, ...newRecords]);
      setCurrentPage(nextPage);
      
      // Update totalCount if it comes from API response
      if (data?.totalCount) {
        setTotalCount(data.totalCount);
      }
      
      // Update hasMore based on if we have all notifications
      setHasMore(notifications.length + newRecords.length < totalCount);
    } catch (error) {
      console.error("Failed to load more notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardNotifications = async () => {
    try {
      const data = await APICalls.getDashboardNotifications();
      // console.log("Dashboard notifications:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch dashboard notifications:", error);
      throw error;
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await APICalls.markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
      // Decrease unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      console.log("Notification marked as read:", notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await APICalls.markAllNotificationsAsRead();
      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      // Reset unread count
      setUnreadCount(0);
      console.log("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMultipleAsRead = async (notificationIds: number[]) => {
    try {
      setLoading(true);
      await APICalls.markMultipleNotificationsAsRead(notificationIds);
      // Update local state
      const unreadNotificationsBeingMarked = notifications.filter(notif => 
        notificationIds.includes(notif.id) && !notif.isRead
      ).length;
      
      setNotifications(prev =>
        prev.map(notif =>
          notificationIds.includes(notif.id)
            ? { ...notif, isRead: true }
            : notif
        )
      );
      // Decrease unread count by the number of unread notifications being marked
      setUnreadCount(prev => Math.max(0, prev - unreadNotificationsBeingMarked));
      console.log("Selected notifications marked as read:", notificationIds);
    } catch (error) {
      console.error("Failed to mark selected notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };
  // Remove automatic refresh on mount - let components control when to initialize

  const value: NotificationContextType = {
    notifications,
    loading,
    initialized,
    hasMore,
    totalCount,
    currentPage,
    refreshNotifications,
    loadMoreNotifications,
    getDashboardNotifications,
    markAsRead,
    markAllAsRead,
    markMultipleAsRead,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
