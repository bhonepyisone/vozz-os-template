// FILE: src/components/hrm/LeaveRequestForm.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function LeaveRequestForm({ onSuccess }) {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !startDate || !endDate) return;
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'leave_requests'), {
        staffId: user.uid,
        staffName: user.name,
        leaveType,
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        reason,
        status: 'pending',
        requestedAt: Timestamp.now(),
      });

      onSuccess("Leave request submitted successfully!");
      setLeaveType('Annual Leave');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error) {
      console.error("Error submitting leave request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const NeumorphismTextarea = (props) => (
    <textarea {...props} className="w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none text-sm" />
  );

  return (
    <Card title={t('SubmitLeaveRequest')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1">{t('LeaveType')}</label>
          <NeumorphismSelect id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option>{t('AnnualLeave')}</option>
            <option>{t('SickLeave')}</option>
            <option>{t('UnpaidLeave')}</option>
            <option>{t('Other')}</option>
          </NeumorphismSelect>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">{t('StartDate')}</label>
            <NeumorphismInput type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">{t('EndDate')}</label>
            <NeumorphismInput type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">{t('ReasonOptional')}</label>
          <NeumorphismTextarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows="3" />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Send className="w-5 h-5" />
          <span>{isLoading ? t('Submitting') : t('SubmitRequest')}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
