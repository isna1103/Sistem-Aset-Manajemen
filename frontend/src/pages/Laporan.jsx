import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Download, FileText } from 'lucide-react';

const Laporan = () => {
  const [dataAset, setDataAset] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await api.get('/laporan/aset');
      setDataAset(res.data);
    } catch (err) { console.error(err); }
  };

  const downloadPDF = async () => {
    setLoading(true);
    try {
      const res = await api.get('/laporan/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Laporan_Aset.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Laporan Data Aset</h2>
          <p className="text-sm text-gray-500">Monitoring dan Export Laporan</p>
        </div>
        <button 
          onClick={downloadPDF} disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {loading ? 'Downloading...' : <><Download size={20} /> Export PDF</>}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Kode Barang</th>
              <th className="py-3 px-4">Nama Barang</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-4">Stok</th>
            </tr>
          </thead>
          <tbody>
            {dataAset.map((item, index) => (
              <tr key={item.id_barang} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                <td className="py-3 px-4 text-sm font-semibold">{item.kode_barang}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{item.nama_barang}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.kategori?.nama_kategori}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.lokasi_penyimpanan}</td>
                <td className="py-3 px-4 text-sm font-bold">{item.jumlah_stok} {item.satuan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Laporan;
