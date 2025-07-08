// FILE: src/components/hrm/AnnouncementManager.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { Megaphone, Send } from 'lucide-react';

export default function AnnouncementManager() {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please provide a title and content for the announcement.");
      return;
    }
    if (!user) {
      alert("You must be logged in to post an announcement.");
      return;
    }
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        authorId: user.uid,
        authorName: user.name,
        createdAt: Timestamp.now(),
      });
      alert("Announcement posted successfully!");
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Failed to post announcement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Megaphone className="w-6 h-6 mr-3 text-primary" />
        Post New Announcement
      </h2>
      <form onSubmit={handlePostAnnouncement} className="space-y-4">
        <div>
          <label htmlFor="announcementTitle" className="block text-sm font-medium text-gray-700">Title</label>
          <input 
            type="text" 
            id="announcementTitle" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" 
            required 
          />
        </div>
        <div>
          <label htmlFor="announcementContent" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea 
            id="announcementContent" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            rows="4" 
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" 
            required 
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:bg-gray-400">
          <Send className="w-5 h-5 mr-2" />
          {isLoading ? 'Posting...' : 'Post Announcement'}
        </button>
      </form>
    </div>
  );
}
