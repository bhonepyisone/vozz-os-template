// FILE: src/components/attendance/QRCodeScanner.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ScanLine } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function QRCodeScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanMessage, setLastScanMessage] = useState('');

  const handleScan = async () => {
    setIsScanning(true);
    setScannedData(null);
    setLastScanMessage('');

    console.log("Starting QR code scan...");

    setTimeout(async () => {
      const mockQrValue = JSON.stringify({
        staffId: 'staff-01',
        shopId: 'main-shop',
        timestamp: Date.now(),
      });
      
      try {
        const data = JSON.parse(mockQrValue);
        setScannedData(data);

        await addDoc(collection(db, 'attendance'), {
          staffId: data.staffId,
          shopId: data.shopId,
          scannedAt: Timestamp.now(),
          type: 'Clock-In/Out',
        });
        
        setLastScanMessage(`Successfully recorded attendance for ${data.staffId}.`);

      } catch (error) {
        console.error("Error processing scan:", error);
        setLastScanMessage("Failed to record attendance.");
      } finally {
        setIsScanning(false);
      }
    }, 2000);
  };

  return (
    <Card title="Scan Staff QR Code">
      {/* Themed "camera feed" placeholder */}
      <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center text-white mb-4 shadow-neo-inset">
        {isScanning ? "Scanning..." : "Camera feed appears here"}
      </div>

      <NeumorphismButton
        onClick={handleScan}
        disabled={isScanning}
      >
        <ScanLine className="w-5 h-5" />
        <span>{isScanning ? 'Scanning...' : 'Start Scan'}</span>
      </NeumorphismButton>

      {lastScanMessage && (
        <div className={`mt-4 p-3 text-sm rounded-lg ${scannedData ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {lastScanMessage}
        </div>
      )}
    </Card>
  );
}
