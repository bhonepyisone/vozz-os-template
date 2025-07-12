// FILE: src/components/dashboard/KudosFeed.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Award } from 'lucide-react';

export default function KudosFeed() {
  const [kudos, setKudos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const kudosRef = collection(db, 'kudos');
    const q = query(kudosRef, orderBy('createdAt', 'desc'), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kudosList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setKudos(kudosList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    // The component no longer needs its own Card, as the parent provides it.
    <div className="space-y-4">
      {isLoading && <p>Loading kudos...</p>}
      {!isLoading && kudos.length === 0 && (
        <p className="text-center text-gray-500 py-4">No kudos given recently. Be the first!</p>
      )}
      {kudos.map(kudo => (
        <div key={kudo.id} className="p-4 bg-neo-bg rounded-lg shadow-neo-inset">
          <div className="flex items-center text-sm">
            <p className="font-bold text-primary">{kudo.fromName}</p>
            <p className="mx-2 text-gray-400">&rarr;</p>
            <p className="font-bold text-primary">{kudo.toName}</p>
          </div>
          <p className="text-sm text-gray-700 mt-1 italic">&quot;{kudo.message}&quot;</p>
        </div>
      ))}
    </div>
  );
}
