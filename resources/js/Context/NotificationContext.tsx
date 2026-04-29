import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'order' | 'payment' | 'promo' | 'system';
    timestamp: Date;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type: Notification['type']) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('artisanal_notifications');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotifications(parsed.map((n: any) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                })));
            } catch (e) {
                console.error("Notification retrieval failed:", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('artisanal_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (title: string, message: string, type: Notification['type']) => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            addNotification, 
            markAsRead, 
            clearAll 
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
