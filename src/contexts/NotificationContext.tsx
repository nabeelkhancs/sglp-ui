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
  refreshNotifications: () => Promise<void>;
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

  const refreshNotifications = async () => {
    try {
      setLoading(true);
      const data = await APICalls.getNotifications();
      const records = data?.records || [];
      setUnreadCount(data?.totalUnreadCount);
      setNotifications(records);
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

  const getDashboardNotifications = async () => {
    try {
      const data = await APICalls.getDashboardNotifications();
      console.log("Dashboard notifications:", data);
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
      setNotifications(prev =>
        prev.map(notif =>
          notificationIds.includes(notif.id)
            ? { ...notif, isRead: true }
            : notif
        )
      );
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
    refreshNotifications,
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
