// FILE: src/components/hrm/TipCalculator.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { formatDate } from '@/lib/utils';
import { Calculator, Users, HandCoins } from 'lucide-react';
import { endOfDay, format } from 'date-fns';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function TipCalculator() {
  const [totalTips, setTotalTips] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tipDistribution, setTipDistribution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculateTips = async () => {
    if (!totalTips || !selectedDate) {
      alert("Please enter a total tip amount and select a date.");
      return;
    }
    setIsLoading(true);
    setError('');
    setTipDistribution(null);

    try {
      const date = new Date(selectedDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfTargetDay = endOfDay(date);

      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfTargetDay);

      const attendanceRef = collection(db, 'attendance');
      const q = query(
        attendanceRef,
        where('scannedAt', '>=', startTimestamp),
        where('scannedAt', '<=', endTimestamp)
      );

      const querySnapshot = await getDocs(q);
      const employeesWhoWorked = new Set();
      querySnapshot.forEach(doc => {
        employeesWhoWorked.add(doc.data().staffId);
      });

      const staffCount = employeesWhoWorked.size;
      if (staffCount === 0) {
        setError("No employees found with attendance records for this date.");
        setIsLoading(false);
        return;
      }

      const tipPerPerson = Number(totalTips) / staffCount;
      const distribution = Array.from(employeesWhoWorked).map(staffId => ({
        staffId,
        amount: tipPerPerson,
      }));
      
      setTipDistribution(distribution);

    } catch (err) {
      console.error("Error calculating tips:", err);
      setError("Failed to calculate tip distribution.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Tip Distribution Calculator">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Tips in Pool</label>
            <NeumorphismInput 
              type="number"
              value={totalTips}
              onChange={(e) => setTotalTips(e.target.value)}
              placeholder="e.g., 15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">For Date</label>
            <NeumorphismInput 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="self-end">
          <NeumorphismButton
            onClick={handleCalculateTips}
            disabled={isLoading}
          >
            <Calculator className="w-5 h-5" />
            <span>{isLoading ? 'Calculating...' : 'Calculate'}</span>
          </NeumorphismButton>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {tipDistribution && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700">Distribution Result:</h3>
          <p className="text-sm text-gray-500 mb-2">
            Total of {totalTips} distributed among {tipDistribution.length} staff members.
          </p>
          <div className="space-y-2">
            {tipDistribution.map((dist, index) => (
              <div key={index} className="p-3 bg-neo-bg shadow-neo-inset rounded-lg flex justify-between items-center">
                <span className="font-medium text-gray-800 flex items-center"><Users className="w-4 h-4 mr-2"/>{dist.staffId}</span>
                <span className="font-bold text-green-600">{dist.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
