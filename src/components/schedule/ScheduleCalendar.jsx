// FILE: src/components/schedule/ScheduleCalendar.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function ScheduleCalendar({ onAddShift }) {
  const [shifts, setShifts] = useState([]);
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    const dates = eachDayOfInterval({ start, end });
    setWeekDates(dates);

    const startTimestamp = Timestamp.fromDate(start);
    const endTimestamp = Timestamp.fromDate(addDays(end, 1));

    const shiftsQuery = query(
      collection(db, 'shifts'),
      where('date', '>=', startTimestamp),
      where('date', '<', endTimestamp)
    );

    const unsubscribe = onSnapshot(shiftsQuery, (snapshot) => {
      const shiftList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));
      setShifts(shiftList);
    });

    return () => unsubscribe();
  }, []);

  const getShiftsForDay = (date) => {
    return shifts.filter(shift => format(shift.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };

  return (
    <Card title="This Week's Schedule">
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map(date => (
          <div key={date.toString()} className="bg-neo-bg p-2 rounded-lg shadow-neo-inset">
            <p className="font-bold text-center text-sm text-gray-700">{format(date, 'E')}</p>
            <p className="text-center text-xs text-gray-500 mb-2">{format(date, 'd MMM')}</p>
            <div className="space-y-2">
              {getShiftsForDay(date).map(shift => (
                <div key={shift.id} className="bg-neo-bg shadow-neo-md p-2 rounded-md text-xs">
                  <p className="font-semibold text-primary">{shift.employeeName}</p>
                  <p className="text-gray-600">{shift.shiftType}</p>
                </div>
              ))}
              <NeumorphismButton 
                onClick={() => onAddShift(date)}
                className="!w-full !p-2 !text-gray-400"
              >
                <PlusCircle className="w-4 h-4"/>
              </NeumorphismButton>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
