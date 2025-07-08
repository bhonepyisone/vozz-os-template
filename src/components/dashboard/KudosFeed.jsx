// FILE: src/components/dashboard/KudosFeed.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Award, Heart } from 'lucide-react';

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
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Award className="w-6 h-6 mr-3 text-yellow-500" />
        Recent Kudos
      </h2>
      <div className="space-y-4">
        {isLoading && <p>Loading kudos...</p>}
        {!isLoading && kudos.length === 0 && (
          <p className="text-center text-gray-500 py-4">No kudos given recently. Be the first!</p>
        )}
        {kudos.map(kudo => (
          <div key={kudo.id} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex items-center text-sm">
              <p className="font-bold text-primary">{kudo.fromName}</p>
              <p className="mx-2 text-gray-400">&rarr;</p>
              <p className="font-bold text-primary">{kudo.toName}</p>
            </div>
            <p className="text-sm text-gray-700 mt-1 italic">"{kudo.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
