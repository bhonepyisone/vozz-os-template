// FILE: src/components/hrm/KudosForm.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { Send, Award } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function KudosForm() {
  const { user } = useAuthStore();
  const [staffList, setStaffList] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all staff members to populate the dropdown, excluding the current user
  useEffect(() => {
    if (!user) return;
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(staff => staff.id !== user.uid); // Exclude self
      setStaffList(users);
    });
    return () => unsubscribe();
  }, [user]);

  const handleSendKudos = async (e) => {
    e.preventDefault();
    if (!recipientId || !message.trim()) {
      alert("Please select a recipient and write a message.");
      return;
    }
    setIsLoading(true);
    try {
      const recipient = staffList.find(s => s.id === recipientId);
      await addDoc(collection(db, 'kudos'), {
        fromId: user.uid,
        fromName: user.name,
        toId: recipientId,
        toName: recipient.name,
        message,
        createdAt: Timestamp.now(),
      });
      alert(`Kudos sent to ${recipient.name}!`);
      setRecipientId('');
      setMessage('');
    } catch (error) {
      console.error("Error sending kudos:", error);
      alert("Failed to send kudos.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const NeumorphismTextarea = (props) => (
    <textarea {...props} className="w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none text-sm" />
  );

  return (
    <Card title="Give Kudos">
      <p className="text-sm text-gray-500 mb-4">Recognize a colleague for their great work!</p>
      <form onSubmit={handleSendKudos} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
          <NeumorphismSelect id="recipient" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} required>
            <option value="">-- Select a colleague --</option>
            {staffList.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
          </NeumorphismSelect>
        </div>
        <div>
          <label htmlFor="kudosMessage" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <NeumorphismTextarea id="kudosMessage" value={message} onChange={(e) => setMessage(e.target.value)} rows="3" required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading} className="!text-secondary">
          <Send className="w-5 h-5" />
          <span>{isLoading ? 'Sending...' : 'Send Kudos'}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
