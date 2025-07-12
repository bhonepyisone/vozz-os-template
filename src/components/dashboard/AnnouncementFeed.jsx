// FILE: src/components/dashboard/AnnouncementFeed.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

export default function AnnouncementFeed() {
  const { t } = useTranslation('common');
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const announcementsRef = collection(db, 'announcements');
    // Query now only gets announcements that haven't expired
    const q = query(
      announcementsRef,
      where('expiresOn', '>', Timestamp.now()),
      orderBy('expiresOn', 'asc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const announcementList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      setAnnouncements(announcementList);
      setIsLoading(false);
    }, (error) => {
      // This is a fallback to get any announcements if the first query fails
      // (e.g., if there are announcements without an expiry date, which our old data has)
      console.warn("Query with expiry date failed, using fallback. This is expected if you have old data without an expiry date.", error.message);
      const fallbackQuery = query(announcementsRef, orderBy('createdAt', 'desc'), limit(5));
      const unsubFallback = onSnapshot(fallbackQuery, fallbackSnapshot => {
        const announcementList = fallbackSnapshot.docs.map(doc => ({
            id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate()
        }));
        setAnnouncements(announcementList);
        setIsLoading(false);
      });
      return () => unsubFallback();
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-4">
        {isLoading && <p>Loading announcements...</p>}
        {!isLoading && announcements.length === 0 && (
          <p className="text-center text-gray-500 py-4">No announcements yet.</p>
        )}
        {announcements.map(announcement => (
          <div key={announcement.id} className="p-4 bg-neo-bg rounded-lg shadow-neo-inset">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center">
                <Megaphone className="w-4 h-4 mr-2 text-primary"/>
                {announcement.title}
              </h3>
              <p className="text-xs text-gray-500">{formatDate(announcement.createdAt)}</p>
            </div>
            <p className="text-sm text-gray-700 mt-1 pl-6">{announcement.content}</p>
            <p className="text-xs text-gray-400 mt-2 text-right">
              {t('PostedBy')}: {announcement.authorName}
            </p>
          </div>
        ))}
    </div>
  );
}
