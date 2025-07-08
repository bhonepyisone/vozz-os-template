// FILE: src/components/layout/NotificationPanel.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { formatDate } from '@/lib/utils';
import { Bell, AlertTriangle, CalendarCheck } from 'lucide-react';

// A helper to pick an icon based on notification type
const NotificationIcon = ({ type }) => {
    switch (type) {
        case 'Low Stock':
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case 'Leave Request':
            return <CalendarCheck className="w-5 h-5 text-blue-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-400" />;
    }
};

export default function NotificationPanel({ isOpen }) {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return; // Don't fetch if the panel is closed

        const notifsRef = collection(db, 'notifications');
        const q = query(notifsRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
            }));
            setNotifications(notifList);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [isOpen]); // Re-fetch when the panel is opened

    if (!isOpen) return null;

    return (
        <div className="absolute top-20 right-8 w-80 bg-neo-bg rounded-2xl shadow-neo-lg border border-neo-dark/20 z-50">
            <div className="p-4 border-b border-neo-dark/20">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {isLoading && <p className="p-4 text-center text-sm text-gray-500">Loading...</p>}
                {!isLoading && notifications.length === 0 && (
                    <p className="p-4 text-center text-sm text-gray-500">No new notifications.</p>
                )}
                {notifications.map(notif => (
                    <div key={notif.id} className="p-4 flex items-start space-x-3 hover:bg-gray-200/50 border-b border-neo-dark/20">
                        <NotificationIcon type={notif.type} />
                        <div>
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(notif.createdAt, 'PPp')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
