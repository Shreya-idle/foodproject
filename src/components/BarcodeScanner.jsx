import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, ZapOff } from 'lucide-react';

export default function BarcodeScanner({ onDetected, onClose }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!window.Quagga) {
      setError('Barcode scanner library not loaded. Please check your internet connection.');
      setInitializing(false);
      return;
    }

    window.Quagga.init({
      inputStream: {
        name: "LiveStream",
        type: "LiveStream",
        target: scannerRef.current,
        constraints: {
          facingMode: "environment",
          aspectRatio: { min: 1, max: 2 }
        },
      },
      decoder: {
        readers: ["ean_reader", "ean_8_reader", "code_128_reader", "upc_reader", "upc_e_reader"]
      },
      locate: true
    }, (err) => {
      setInitializing(false);
      if (err) {
        console.error(err);
        setError('Could not access camera. Please ensure permissions are granted.');
        return;
      }
      window.Quagga.start();
    });

    window.Quagga.onDetected((data) => {
      if (data && data.codeResult && data.codeResult.code) {
        onDetected(data.codeResult.code);
        window.Quagga.stop();
      }
    });

    return () => {
      if (window.Quagga) {
        window.Quagga.stop();
        window.Quagga.offDetected();
      }
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center text-white mb-6">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2">
            <Camera className="w-5 h-5 text-primary-400" />
            Scan Barcode
          </h2>
          <p className="text-sm text-gray-400 mt-1">Point your camera at the barcode on the product</p>
        </div>

        <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden border-2 border-primary-500/30">
          <div ref={scannerRef} className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>canvas]:hidden" />
          
          {/* Scanning frame overlay */}
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
            <div className="w-full h-40 border-2 border-primary-400 relative">
              <div className="absolute inset-0 bg-primary-400/10 animate-pulse" />
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary-400 -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary-400 translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary-400 -translate-x-1 translate-y-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary-400 translate-x-1 translate-y-1" />
              
              {/* Scanning red line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_red] animate-[scan_2s_linear_infinite]" />
            </div>
          </div>

          {initializing && (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white gap-3">
              <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-sm font-medium">Initializing camera...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-6 text-center gap-4">
              <ZapOff className="w-12 h-12 text-red-500" />
              <div>
                <p className="font-bold text-lg">Oops!</p>
                <p className="text-sm text-gray-400 mt-1">{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary-600 rounded-xl font-semibold text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0% { top: 10%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 90%; opacity: 0; }
          }
        `}} />
      </div>
    </div>
  );
}
