// FILE: src/components/attendance/QRCodeGenerator.jsx

'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

export default function QRCodeGenerator({ staffId, shopId }) {
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    // This function generates a new value for the QR code.
    const generateValue = () => {
      const timestamp = Date.now();
      const value = JSON.stringify({ staffId, shopId, timestamp });
      setQrValue(value);
      console.log("New QR Code Value Generated:", value);
    };

    // Generate the first QR code immediately
    generateValue();

    // Set up an interval to generate a new QR code every 60 seconds
    const intervalId = setInterval(generateValue, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [staffId, shopId]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Attendance QR Code</h2>
      {qrValue ? (
        <div className="p-4 bg-gray-100 rounded-lg">
          <QRCode
            value={qrValue}
            size={256}
            level={"H"}
            includeMargin={true}
          />
        </div>
      ) : (
        <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg"></div>
      )}
      <p className="mt-4 text-sm text-gray-600">
        Show this to the Front Desk to clock in/out.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        (This code refreshes every 60 seconds)
      </p>
    </div>
  );
}
