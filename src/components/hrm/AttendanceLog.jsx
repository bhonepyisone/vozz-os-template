// FILE: src/components/hrm/AttendanceLog.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { formatDate } from '@/lib/utils';
import { endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns';
import { CalendarClock } from 'lucide-react';
import Card from '@/components/ui/Card';
import ExportButton from '@/components/ui/ExportButton';

const timeframes = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export default function AttendanceLog() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('Daily');

  useEffect(() => {
    setIsLoading(true);
    const now = new Date();
    let startDate, endDate;

    switch (activeTimeframe) {
      case 'Weekly':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'Monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'Yearly':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate = endOfDay(now);
        break;
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const attendanceRef = collection(db, 'attendance');
    const q = query(
      attendanceRef, 
      where('scannedAt', '>=', startTimestamp), 
      where('scannedAt', '<=', endTimestamp),
      orderBy('scannedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scannedAt: doc.data().scannedAt.toDate(),
      }));
      setRecords(recordList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeTimeframe]);

  const csvHeaders = [
    { label: "Date", key: "scannedAt" },
    { label: "Staff ID", key: "staffId" },
    { label: "Type", key: "type" },
    { label: "Details", key: "details" },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Attendance Log</h2>
        <div className="flex items-center space-x-2">
            <div className="flex items-center bg-neo-bg p-1 rounded-lg shadow-neo-inset-active">
                {timeframes.map(frame => (
                    <button 
                    key={frame}
                    onClick={() => setActiveTimeframe(frame)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                        activeTimeframe === frame ? 'bg-neo-bg shadow-neo-md text-primary' : 'text-gray-600'
                    }`}
                    >
                    {frame}
                    </button>
                ))}
            </div>
            <ExportButton data={records} headers={csvHeaders} filename={`attendance_${activeTimeframe}.csv`} />
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading && <p>Loading records...</p>}
        {!isLoading && records.length === 0 && <p>No attendance records for this period.</p>}
        {records.map(record => (
          <div key={record.id} className="p-3 border border-neo-dark/20 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <CalendarClock className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-semibold text-gray-800">{record.staffId}</p>
                <p className="text-xs text-gray-500">{record.type || 'Clock-In/Out'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{formatDate(record.scannedAt, 'PPpp')}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
