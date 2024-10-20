import React, { useState, useRef, useEffect, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling'; // Correct import statement
import html2canvas from 'html2canvas';
import Webcam from 'react-webcam';
import NavBar from '../components/Navbar'
import ShaderCanvas from '../components/ShaderCanvas'


function QRCodeGenerator() {
  const [qrText, setQrText] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const qrCodeRef = useRef(null);
  const webcamRef = useRef(null);
  const qrCodeInstance = useRef(null); // Store the instance

  // Initialize QRCodeStyling when component mounts
  useEffect(() => {
    qrCodeInstance.current = new QRCodeStyling({
      width: 150,
      height: 150,
      dotsOptions: {
        color: "#000",
        type: "rounded"
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
      }
    });
  }, []);

  // Update the QR code when qrText changes
  const handleGenerateQRCode = useCallback(() => {
    qrCodeInstance.current.update({
      data: qrText
    });
    qrCodeInstance.current.append(qrCodeRef.current); // Append to the DOM
  }, [qrText]);

  const handleDownloadQRCode = () => {
    html2canvas(qrCodeRef.current).then(canvas => {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const handleScan = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Simulate QR scanning (can implement actual QR detection logic)
    setScanResult(`Simulated scan result from image: ${imageSrc}`);
    setIsScanning(false);
  };

  return (
    <>
    <NavBar/>
    <ShaderCanvas/>
    <div className="min-h-screen bg-none flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">QR Code Generator & Scanner</h1>

        {qrText && (
          <div className="flex flex-col items-center mb-4">
            <div ref={qrCodeRef} onClick={handleGenerateQRCode} className="cursor-pointer"></div>
            <button
              onClick={handleDownloadQRCode}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition duration-200"
            >
              Download QR Code
            </button>
          </div>
        )}

        <hr className="my-6" />

        {/* QR Code Scanner */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">QR Code Scanner</h2>
          {isScanning ? (
            <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleScan}
                className="absolute bottom-2 right-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-200"
              >
                Capture & Scan
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsScanning(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-200"
            >
              Start QR Scan
            </button>
          )}
        </div>

        {scanResult && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
            <p className="text-sm font-medium text-gray-600">Scanned Result:</p>
            <p className="text-lg font-semibold text-gray-800 break-words">{scanResult}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default QRCodeGenerator;
