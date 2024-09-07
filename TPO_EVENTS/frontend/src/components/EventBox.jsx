
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const EventBox = ({ onScanComplete }) => {
  const [scanResult, setScanResult] = useState(null);

  const handleScan = (result) => {
    if (result) {
      setScanResult(result?.text);
      if (onScanComplete) {
        onScanComplete(result?.text);
      }
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
      <div className="bg-white p-2 border rounded-lg">
        <QrReader
          onResult={handleScan}
          onError={handleError}
          style={{ width: '100%' }}
        />
      </div>
      {scanResult && (
        <div className="mt-4">
          <strong>Result:</strong> {scanResult}
        </div>
      )}
    </div>
  );
};

export default EventBox;
