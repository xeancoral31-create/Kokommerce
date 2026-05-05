import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    created_at: string;
    is_read: boolean;
    data?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { isSignedIn } = useAuth();

    const fetchNotifications = async () => {
        if (!isSignedIn) return;
        try {
            const prefix = window.location.pathname.startsWith('/seller') ? '/seller' : '/buyer';
            const response = await axios.get(`${prefix}/notifications`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const prefix = window.location.pathname.startsWith('/seller') ? '/seller' : '/buyer';
            await axios.post(`${prefix}/notifications/${id}/read`);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const prefix = window.location.pathname.startsWith('/seller') ? '/seller' : '/buyer';
            await axios.post(`${prefix}/notifications/read-all`);
            setNotifications(prev => 
                prev.map(n => ({ ...n, is_read: true }))
            );
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    useEffect(() => {
        if (isSignedIn) {
            fetchNotifications();
            // Optional: Set up polling every 60 seconds
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [isSignedIn]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            fetchNotifications,
            markAsRead, 
            markAllAsRead 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
