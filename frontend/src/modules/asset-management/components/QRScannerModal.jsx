import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'file'
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let scanner = null;

    if (isOpen && scanMode === 'camera') {
      const timeout = setTimeout(() => {
        if (!isMounted) return;

        const readerElement = document.getElementById('modal-reader');
        if (readerElement) {
          readerElement.innerHTML = '';
        }

        scanner = new Html5QrcodeScanner('modal-reader', {
          qrbox: { width: 250, height: 250 },
          fps: 10,
          rememberLastUsedCamera: false
        });

        scanner.render(
          (result) => {
            if (scanner) scanner.clear();
            try {
              const parsed = JSON.parse(result);
              if (parsed.kode_aset) {
                onScanSuccess(parsed.kode_aset);
              } else {
                onScanSuccess(result);
              }
            } catch (e) {
              onScanSuccess(result);
            }
          },
          (err) => {}
        );
      }, 400);

      return () => {
        isMounted = false;
        clearTimeout(timeout);
        if (scanner) {
          scanner.clear().catch(e => console.error("Failed to clear scanner", e));
        }
      };
    }
  }, [isOpen, scanMode, onScanSuccess]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("modal-reader-file-hidden");
      const result = await html5QrCode.scanFile(file, true);
      
      try {
        const parsed = JSON.parse(result);
        if (parsed.kode_aset) {
          onScanSuccess(parsed.kode_aset);
        } else {
          onScanSuccess(result);
        }
      } catch(err) {
        onScanSuccess(result);
      }
    } catch (err) {
      alert("QR Code tidak terdeteksi pada gambar tersebut. Pastikan gambar jelas.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Scan QR Aset</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-center gap-2 mb-6">
            <button 
              onClick={() => setScanMode('camera')}
              className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${scanMode === 'camera' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              <Camera size={18} /> Kamera
            </button>
            <button 
              onClick={() => setScanMode('file')}
              className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${scanMode === 'file' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              <ImageIcon size={18} /> Gambar
            </button>
          </div>

          <div className="bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            {scanMode === 'camera' ? (
              <div className="w-full">
                <div id="modal-reader" className="w-full overflow-hidden rounded-lg border-2 border-gray-100"></div>
                <p className="text-center text-sm text-gray-500 mt-3">Arahkan kamera ke QR Code Aset</p>
              </div>
            ) : (
              <div className="w-full text-center space-y-4 flex flex-col items-center">
                <div 
                  className="p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 w-full hover:bg-gray-100 transition-colors cursor-pointer group" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={48} className="mx-auto text-blue-400 group-hover:text-blue-500 mb-4 transition-colors" />
                  <p className="text-gray-700 font-bold mb-1">Pilih gambar QR Code</p>
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                  >
                    Jelajahi File
                  </button>
                </div>
                <div id="modal-reader-file-hidden" style={{display: 'none'}}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
