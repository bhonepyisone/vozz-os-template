// FILE: src/app/(main)/schedule/page.jsx

'use client';

import { useState } from 'react';
import ScheduleCalendar from '@/components/schedule/ScheduleCalendar';
import ShiftModal from '@/components/schedule/ShiftModal';

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAddShiftClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Schedule</h1>
      <ScheduleCalendar onAddShift={handleAddShiftClick} />
      <ShiftModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}
