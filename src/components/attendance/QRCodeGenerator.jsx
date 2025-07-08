// FILE: src/components/attendance/QRCodeGenerator.jsx

'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';
import QRCode from 'qrcode.react';
import Card from '@/components/ui/Card';

export default function QRCodeGenerator() {
  const { user } = useAuthStore();
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (!user) return;

    const generateValue = () => {
      const timestamp = Date.now();
      const value = JSON.stringify({ staffId: user.uid, shopId: user.shopId, timestamp });
      setQrValue(value);
    };

    generateValue();
    const intervalId = setInterval(generateValue, 60000);
    return () => clearInterval(intervalId);
  }, [user]);

  if (!user) {
    return <Card title="QR Code"><p>Please log in to see your QR code.</p></Card>;
  }

  return (
    <Card title="Your Attendance QR Code">
      <div className="flex flex-col items-center justify-center text-center">
        {qrValue ? (
          <div className="p-4 bg-neo-bg rounded-lg shadow-neo-inset">
            <QRCode
              value={qrValue}
              size={256}
              level={"H"}
              includeMargin={true}
              bgColor="#e0e5ec" // Match background
              fgColor="#333333" // Darker color for contrast
            />
          </div>
        ) : (
          <div className="w-64 h-64 bg-neo-bg shadow-neo-inset rounded-lg animate-pulse"></div>
        )}
        <p className="mt-4 text-sm text-gray-600">
          Show this to the Front Desk to clock in/out.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          (This code refreshes every 60 seconds)
        </p>
      </div>
    </Card>
  );
}
