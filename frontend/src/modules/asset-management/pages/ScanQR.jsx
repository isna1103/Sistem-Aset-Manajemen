import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon } from 'lucide-react';

const ScanQR = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'file'
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let scanner = null;

    if (scanMode === 'camera') {
      const timeout = setTimeout(() => {
        if (!isMounted) return;

        const readerElement = document.getElementById('reader');
        if (readerElement) {
          readerElement.innerHTML = '';
        }

        scanner = new Html5QrcodeScanner('reader', {
          qrbox: { width: 250, height: 250 },
          fps: 10,
          rememberLastUsedCamera: false
        });

        scanner.render(onScanSuccess, onScanError);
      }, 400); // Memberi jeda ekstra agar kamera sistem sempat ter-release

      function onScanSuccess(result) {
        if (scanner) scanner.clear();
        try {
          const parsed = JSON.parse(result);
          if (parsed.kode_aset) {
            setScanResult(parsed.kode_aset);
            navigate(`/aset/detail/${parsed.kode_aset}`);
          } else {
            alert("Format QR Code tidak valid untuk Sistem Aset.");
          }
        } catch (e) {
          setScanResult(result);
          navigate(`/aset/detail/${result}`);
        }
      }

      function onScanError(err) {
        // Dibiarkan kosong
      }

      return () => {
        isMounted = false;
        clearTimeout(timeout);
        if (scanner) {
          scanner.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner.", error);
          });
        }
      };
    }
  }, [navigate, scanMode]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("reader-file-hidden");
      const result = await html5QrCode.scanFile(file, true);
      
      try {
        const parsed = JSON.parse(result);
        if (parsed.kode_aset) {
          navigate(`/aset/detail/${parsed.kode_aset}`);
        } else {
          alert("Format QR Code tidak valid.");
        }
      } catch(err) {
        navigate(`/aset/detail/${result}`);
      }
    } catch (err) {
      alert("QR Code tidak terdeteksi pada gambar tersebut. Pastikan gambar jelas.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Scan QR Code Aset</h1>
      
      <div className="flex justify-center gap-4 mb-4">
        <button 
          onClick={() => setScanMode('camera')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${scanMode === 'camera' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <Camera size={20} /> Gunakan Kamera
        </button>
        <button 
          onClick={() => setScanMode('file')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${scanMode === 'file' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <ImageIcon size={20} /> Unggah Gambar
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col items-center justify-center">
        {scanMode === 'camera' ? (
          <div className="w-full">
            <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
            {scanResult && (
              <p className="mt-4 text-center text-green-600 font-medium">Berhasil scan: {scanResult}</p>
            )}
          </div>
        ) : (
          <div className="w-full text-center space-y-4 flex flex-col items-center">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 w-full hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon size={48} className="mx-auto text-blue-500 mb-4" />
              <p className="text-gray-700 font-bold mb-2">Pilih gambar QR Code</p>
              <p className="text-gray-500 text-sm mb-6">Unggah file foto/gambar dari galeri Anda</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                ref={fileInputRef}
                className="hidden" 
              />
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                Pilih File Gambar
              </button>
            </div>
            <div id="reader-file-hidden" style={{display: 'none'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;
