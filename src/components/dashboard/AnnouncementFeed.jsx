// FILE: src/components/dashboard/AnnouncementFeed.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { formatDate } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

export default function AnnouncementFeed() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const announcementsRef = collection(db, 'announcements');
    // Query for the 5 most recent announcements, ordered by creation date
    const q = query(announcementsRef, orderBy('createdAt', 'desc'), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const announcementList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      setAnnouncements(announcementList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Megaphone className="w-6 h-6 mr-3 text-primary" />
        Recent Announcements
      </h2>
      <div className="space-y-4">
        {isLoading && <p>Loading announcements...</p>}
        {!isLoading && announcements.length === 0 && (
          <p className="text-center text-gray-500 py-4">No announcements yet.</p>
        )}
        {announcements.map(announcement => (
          <div key={announcement.id} className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">{announcement.title}</h3>
              <p className="text-xs text-gray-500">{formatDate(announcement.createdAt)}</p>
            </div>
            <p className="text-sm text-gray-700 mt-1">{announcement.content}</p>
            <p className="text-xs text-gray-400 mt-2 text-right">
              Posted by: {announcement.authorName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
