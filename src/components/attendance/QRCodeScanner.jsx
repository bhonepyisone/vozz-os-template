// FILE: src/components/attendance/QRCodeScanner.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Card from '@/components/ui/Card';

export default function QRCodeScanner() {
  const { t } = useTranslation('common');
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');

  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner(
      'reader', // The ID of the div element to render the scanner
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5, // Scans per second
      },
      false // verbose = false
    );

    let isScanning = true;

    // --- Success Callback ---
    // This function runs when a QR code is successfully scanned
    const onScanSuccess = async (decodedText, decodedResult) => {
      if (isScanning) {
        isScanning = false; // Prevent multiple scans of the same code
        scanner.clear(); // Stop the scanner
        
        try {
          const qrData = JSON.parse(decodedText);
          // Validate the scanned data
          if (qrData.staffId && qrData.name && qrData.position) {
            setScanResult(`Success! Clocked in: ${qrData.name} (${qrData.position})`);
            setScanError('');

            // Save the attendance record to Firestore
            await addDoc(collection(db, 'attendance'), {
              staffId: qrData.staffId,
              staffName: qrData.name,
              position: qrData.position,
              scannedAt: Timestamp.now(),
              type: 'Clock-In/Out',
            });
          } else {
            throw new Error("Invalid QR code format.");
          }
        } catch (error) {
          console.error("Error processing QR code:", error);
          setScanError("Failed to process an invalid QR code.");
          setScanResult(null);
        }
      }
    };

    // --- Error Callback ---
    // This function can be used for debugging, but we can ignore most errors
    const onScanFailure = (error) => {
      // console.warn(`Code scan error = ${error}`);
    };

    scanner.render(onScanSuccess, onScanFailure);

    // --- Cleanup Function ---
    // This is crucial to stop the camera when the component is unmounted
    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner.", error);
        });
      }
    };
  }, []);

  return (
    <Card title={t('ScanStaffQRCode')}>
      {/* The scanner library will render the camera feed inside this div */}
      <div id="reader" className="w-full"></div>
      
      {scanResult && (
        <div className="mt-4 p-3 text-sm rounded-lg bg-green-100 text-green-800">
          {scanResult}
        </div>
      )}
      {scanError && (
        <div className="mt-4 p-3 text-sm rounded-lg bg-red-100 text-red-800">
          {scanError}
        </div>
      )}
    </Card>
  );
}
