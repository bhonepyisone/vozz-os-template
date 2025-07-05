// FILE: src/components/attendance/QRCodeScanner.jsx

'use client';

import { useState } from 'react';
import { ScanLine } from 'lucide-react';

export default function QRCodeScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setScannedData(null);
    
    // --- Placeholder for Real Scanner Logic ---
    // In a real app, you would use a library like 'html5-qrcode' here
    // to open the camera and listen for a QR code.
    console.log("Starting QR code scan...");

    // For demonstration, we'll simulate a successful scan after 2 seconds.
    setTimeout(() => {
      const mockData = {
        staffId: 'STAFF-007',
        shopId: 'SHOP-MAIN',
        timestamp: Date.now(),
      };
      setScannedData(mockData);
      setIsScanning(false);
      console.log("Mock scan successful:", mockData);
    }, 2000);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan Staff QR Code</h2>
      
      {/* This would be the video feed from the camera */}
      <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center text-white mb-4">
        {isScanning ? "Scanning..." : "Camera feed appears here"}
      </div>

      <button
        onClick={handleScan}
        disabled={isScanning}
        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
      >
        <ScanLine className="w-5 h-5 mr-2" />
        {isScanning ? 'Scanning...' : 'Start Scan'}
      </button>

      {scannedData && (
        <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">Scan Successful!</h3>
          <p className="text-sm text-green-700">
            Staff ID: {scannedData.staffId}
          </p>
          <p className="text-sm text-green-700">
            Timestamp: {new Date(scannedData.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
