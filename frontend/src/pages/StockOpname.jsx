import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { QrCode, Search, ClipboardList } from 'lucide-react';
import Swal from 'sweetalert2';
import QRScannerModal from '../components/QRScannerModal';

const StockOpname = () => {
  const { hasPermission } = useContext(AuthContext);
  const [opnameList, setOpnameList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showQRModal, setShowQRModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [asetList, setAsetList] = useState([]);
  const [lokasiList, setLokasiList] = useState([]);
  const [formData, setFormData] = useState({ aset_id: '', kondisi_fisik: 'Sesuai', lokasi_id: '', keterangan: '' });

  useEffect(() => {
    fetchData();
    fetchAsetAndLokasi();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/stock-opname');
      setOpnameList(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchAsetAndLokasi = async () => {
    try {
      const [asetRes, lokasiRes] = await Promise.all([
        api.get('/aset'),
        api.get('/lokasi')
      ]);
      setAsetList(asetRes.data);
      setLokasiList(lokasiRes.data);
    } catch (err) {
      console.error("Gagal memuat data master", err);
    }
  };

  const handleScanSuccess = (kode_aset) => {
    setShowQRModal(false);
    const aset = asetList.find(a => a.kode_aset === kode_aset || a.id.toString() === kode_aset);
    if (aset) {
      setFormData({
        aset_id: aset.id,
        kondisi_fisik: 'Sesuai',
        lokasi_id: aset.lokasi_id,
        keterangan: ''
      });
      setShowFormModal(true);
    } else {
      Swal.fire({ icon: 'error', title: 'Tidak Ditemukan', text: `Aset dengan kode ${kode_aset} tidak ditemukan di database.` });
    }
  };

  const handleSubmitOpname = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stock-opname', {
        ...formData,
        tanggal_opname: new Date().toISOString().split('T')[0]
      });
      setShowFormModal(false);
      fetchData(); // Refresh list
      fetchAsetAndLokasi(); // Refresh aset data
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Kondisi fisik aset berhasil diperbarui!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stock Opname / Scan Aset</h1>
          <p className="text-gray-500 text-sm mt-1">Scan aset untuk langsung merekonsiliasi kondisi dan lokasi fisik</p>
        </div>
        {hasPermission('Stock Opname', 'Create') && (
          <button onClick={() => setShowQRModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-sm transition-colors">
            <QrCode size={20} /> Scan Aset
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cari riwayat scan..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Waktu Scan</th>
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold">Kondisi Aktual</th>
                <th className="p-4 font-semibold">Keterangan</th>
                <th className="p-4 font-semibold">Pemeriksa</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Loading...</td></tr>
              ) : opnameList.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                      <ClipboardList size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">Belum ada riwayat stock opname</p>
                      <p className="text-gray-400 text-sm">Klik "Scan Aset" untuk mulai melakukan rekonsiliasi.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                opnameList.map(item => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 text-sm text-gray-600">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-xs text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.kondisi_fisik === 'Sesuai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.kondisi_fisik}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{item.keterangan || '-'}</td>
                    <td className="p-4 text-sm text-gray-700">{item.pemeriksa?.nama}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Scan */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Kondisi Fisik Aset</h2>
              <button onClick={() => setShowFormModal(false)} className="text-gray-500 hover:text-red-500 rounded-full p-1 transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmitOpname} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Aset Terdeteksi</label>
                <div className="p-3 bg-blue-50 text-blue-800 font-medium rounded-xl border border-blue-100">
                  {asetList.find(a => a.id === formData.aset_id)?.nama_aset || '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kondisi Aktual</label>
                <select required className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.kondisi_fisik} onChange={(e) => setFormData({ ...formData, kondisi_fisik: e.target.value })}
                >
                  <option value="Sesuai">Sesuai (Baik)</option>
                  <option value="Tidak Sesuai">Tidak Sesuai (Rusak Ringan / Kurang Baik)</option>
                  <option value="Rusak">Rusak Berat</option>
                  <option value="Hilang">Hilang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi Aktual (Pilih Jika Pindah)</label>
                <select required className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.lokasi_id} onChange={(e) => setFormData({ ...formData, lokasi_id: e.target.value })}
                >
                  {lokasiList.map(l => <option key={l.id} value={l.id}>{l.nama_lokasi}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan (Opsional)</label>
                <textarea className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500" rows="3"
                  value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Beri catatan jika ada perbedaan"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm transition-colors">Simpan Scan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scanner Popup Component */}
      <QRScannerModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default StockOpname;
