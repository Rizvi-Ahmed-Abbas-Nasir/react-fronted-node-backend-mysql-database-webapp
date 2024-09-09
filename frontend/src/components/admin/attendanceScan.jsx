import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner'; // Import QrScanner from the appropriate package
import Header from '../header'; // Adjust imports based on your project structure
import AdminHeader from './AdminHeader';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed and imported
import { toast } from 'react-toastify'; // Import toast if used for notifications

function Scan() {
  const { id } = useParams(); // Get event id from the URL
  const videoRef = useRef(null); // Reference for the video element
  const [scannedData, setScannedData] = useState('');
  const [scanner, setScanner] = useState(null); // State to hold scanned QR code data
  const [isScannerActive, setIsScannerActive] = useState(false); // State to track if scanner is on/off

  // Handle successful QR code scan
  const handleScanSuccess = async (result) => {
    console.log('Scanned result:', result); // Log the result to the console
    setScannedData(result.data);
    const qrcodedata = JSON.parse(result.data);
    console.log(qrcodedata);
    // Example: axios.post(`http://localhost:8000/markAsAttended`, { student_id: qrcodedata.student_id, event_id: qrcodedata.event_id });
  };

  // Handle scanning errors
  const handleScanError = (error) => {
    console.error('Scan error:', error); // Log the error to the console
  };

  useEffect(() => {
    if (videoRef.current && !scanner) {
      const qrScanner = new QrScanner(
        videoRef.current,
        handleScanSuccess,
        {
          onDecodeError: handleScanError,
          preferredCamera: 'environment', // Use the back camera on mobile devices
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      setScanner(qrScanner); // Set the scanner instance in state
    }

    // Cleanup scanner on component unmount
    return () => {
      if (scanner) {
        scanner.stop(); // Stop the scanner
      }
    };
  }, [scanner]);

  const toggleScanner = () => {
    if (isScannerActive) {
      scanner.stop(); // Stop the scanner
    } else {
      scanner.start(); // Start the scanner
    }
    setIsScannerActive(!isScannerActive); // Toggle the scanner state
  };

  return (
    <div className="md:ml-72 md:mt-32 md:w-[80%] w-full mt-9 flex justify-center p-8 flex-col">
      <Header />
      <AdminHeader />
      <div className="relative w-full h-[70vh] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">QR Code Reader</h1>

        <video
          ref={videoRef} // Video element reference for QR scanner
          className="border border-gray-300 shadow-md rounded-lg mb-6 w-[80%] h-[40%] md:w-[50%] md:h-[50%] lg:w-[40%] lg:h-[40%]"
        ></video>

        {scannedData && (
          <p
            className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg shadow-md"
            style={{ zIndex: 1000 }}
          >
            Scanned Data: {scannedData}
          </p>
        )}

        <button
          onClick={toggleScanner}
          className={`mt-6 inline-block text-center px-6 py-3 font-semibold rounded-lg shadow-md text-white transition duration-300 
            ${isScannerActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isScannerActive ? 'Stop Scanner' : 'Start Scanner'}
        </button>
      </div>
    </div>
  );
}

export default Scan;
