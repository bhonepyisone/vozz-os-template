// FILE: src/app/(main)/attendance/page.jsx

'use client';

import { useAuthStore } from '@/lib/auth';
import QRCodeGenerator from '@/components/attendance/QRCodeGenerator';
import QRCodeScanner from '@/components/attendance/QRCodeScanner';
import LeaveRequestForm from '@/components/hrm/LeaveRequestForm'; // Import the new form

export default function AttendancePage() {
  const { user } = useAuthStore();

  const canScan = user?.role === 'Admin' || user?.role === 'Management' || user?.role === 'Front Desk';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h1>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {/* Show scanner for managers, QR code for staff */}
          {canScan ? <QRCodeScanner /> : <QRCodeGenerator />}
        </div>
        <div>
          {/* The leave request form is available to everyone */}
          <LeaveRequestForm />
        </div>
       </div>
    </div>
  );
}
