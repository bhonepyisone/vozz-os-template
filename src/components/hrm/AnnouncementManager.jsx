// FILE: src/components/hrm/AnnouncementManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, Timestamp, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { Megaphone, Send, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { formatDate } from '@/lib/utils';

// FIX: Define the helper component outside the main function
const NeumorphismTextarea = (props) => (
  <textarea {...props} className="w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none text-sm" />
);

export default function AnnouncementManager({ setSuccessMessage, onEdit, onDelete }) {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expiresOn, setExpiresOn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const annQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(annQuery, (snapshot) => {
      setAnnouncements(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) return;
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        authorId: user.uid,
        authorName: user.name,
        createdAt: Timestamp.now(),
        expiresOn: expiresOn ? Timestamp.fromDate(new Date(expiresOn)) : null,
      });
      setSuccessMessage({ key: 'AnnouncementPosted' });
      setTitle('');
      setContent('');
      setExpiresOn('');
    } catch (error) {
      console.error("Error posting announcement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title={t('MakeAnnouncements')}>
      <form onSubmit={handlePostAnnouncement} className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-medium text-gray-700">{t('Title')}</label>
          <NeumorphismInput 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">{t('Content')}</label>
          <NeumorphismTextarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            rows="4" 
            required 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">{t('ExpiresOn')} ({t('ReasonOptional')})</label>
          <NeumorphismInput 
            type="date" 
            value={expiresOn} 
            onChange={(e) => setExpiresOn(e.target.value)} 
          />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Send className="w-5 h-5" />
          <span>{isLoading ? t('Saving') : t('PostAnnouncement')}</span>
        </NeumorphismButton>
      </form>

      <div className="border-t border-neo-dark/20 pt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('CurrentAnnouncements')}</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {announcements.map(ann => (
            <div key={ann.id} className="p-4 border border-neo-dark/20 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-800">{ann.title}</p>
                <div className="flex space-x-2">
                  <NeumorphismButton onClick={() => onEdit(ann)} className="!w-auto !p-2 !rounded-full !text-blue-600"><Edit className="w-4 h-4"/></NeumorphismButton>
                  <NeumorphismButton onClick={() => onDelete(ann)} className="!w-auto !p-2 !rounded-full !text-red-600"><Trash2 className="w-4 h-4"/></NeumorphismButton>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
              <p className="text-xs text-gray-400 mt-2">{t('PostedBy')}: {ann.authorName} on {formatDate(ann.createdAt.toDate())}</p>
              {ann.expiresOn && <p className="text-xs text-yellow-600 mt-1">Expires: {formatDate(ann.expiresOn.toDate())}</p>}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
