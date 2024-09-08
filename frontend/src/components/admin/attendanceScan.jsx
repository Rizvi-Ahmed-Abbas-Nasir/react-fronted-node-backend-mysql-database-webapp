import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner'; // Make sure to import QrScanner from the appropriate package
import Header from '../header'; // Adjust imports based on your project structure
import AdminHeader from './AdminHeader';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed and imported
import { toast } from 'react-toastify'; // Import toast if used for notifications

function Scan() {
  // QR States
  const { id } = useParams();
  const videoRef = useRef(null); // Reference for the video element
  const [scannedData, setScannedData] = useState('');
  const [scanner, setScanner] = useState(null); // State to hold scanned QR code data
  const [isScannerActive, setIsScannerActive] = useState(false); // State to track if scanner is on/off

  // Success handler for scanning QR codes
  const handleScanSuccess = async (result) => {
    console.log('Scanned result:', result); // Log the result to the console
    setScannedData(result.data);
    const qrcodedata = JSON.parse(result.data);
    console.log(qrcodedata);
    //axios.post(`http://localhost:8000/markAsAttended`,{student_id:qrcodedata.student_id, event_id:qrcodedata.event_id});
    
   // console.log("attendence marked")
  };

  // Error handler for scanning failures
  const handleScanError = (error) => {
    console.error('Scan error:', error); // Log the error to the console
  };

  useEffect(() => {
    if (videoRef.current && !scanner) {
      // Create a new instance of QrScanner
      const qrScanner = new QrScanner(
        videoRef.current,
        handleScanSuccess, // Callback for successful scans
        {
          onDecodeError: handleScanError, // Callback for decoding errors
          preferredCamera: 'environment', // Use back camera on mobile devices
          highlightScanRegion: true, // Highlight the scan region
          highlightCodeOutline: true, // Highlight the detected QR code
        }
      );

      setScanner(qrScanner); // Set the scanner instance in state
    }

    // Cleanup the scanner on component unmount
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
    <div className='w-full h-[100%] '>
      <Header />
      <AdminHeader />
      <div style={{ position: 'relative', width: '80%', height: '80vh' }} className='ml-[20%] mt-[10%] '>
      <h1>QR Code Reader</h1>
      <video
        ref={videoRef} // Video element reference for QR scanner
        className='h-[40%] w-[40%]'
      ></video>
      {scannedData && (
        <p
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          Scanned Data: {scannedData}
        </p>
      )}
          <button 
        onClick={toggleScanner} 
        className='h-[100px] w-[200px]'
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10px',
          
          zIndex: 1000,
          cursor: 'pointer',
          backgroundColor: isScannerActive ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >MARK ATTENDANCE</button>
    </div>
    </div>
  );
}

export default Scan;