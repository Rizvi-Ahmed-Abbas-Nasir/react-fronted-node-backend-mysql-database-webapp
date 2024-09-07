
import React, { useState } from 'react';
import EventBox from '../components/EventBox';

const AdminCompo = () => {
  const [qrScanResult, setQrScanResult] = useState(null);

  const handleScanComplete = (result) => {
    setQrScanResult(result);
    console.log('QR Scan Complete:', result);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">QR Scanner for Event</h2>

      <EventBox onScanComplete={handleScanComplete} />

      {qrScanResult && (
        <div className="mt-4">
          <p className="text-lg">Scanned QR Result: {qrScanResult}</p>
        </div>
      )}
    </div>
  );
};

export default AdminCompo;
