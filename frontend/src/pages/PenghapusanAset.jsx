import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';

const PenghapusanAset = () => {
  const [penghapusan, setPenghapusan] = useState([]);
  const [asetList, setAsetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ aset_id: '', tanggal_penghapusan: '', alasan: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hapusRes, asetRes] = await Promise.all([
        api.get('/penghapusan'),
        api.get('/aset')
      ]);
      setPenghapusan(hapusRes.data);
      // Hanya aset yang belum dihapus yang bisa dihapus
      setAsetList(asetRes.data.filter(a => a.status !== 'Dihapus'));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Hapus Permanen?',
      text: 'Tindakan ini akan mengubah status aset menjadi Dihapus secara permanen. Lanjutkan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;
    
    try {
      await api.post('/penghapusan', formData);
      setShowModal(false);
      fetchData();
      setFormData({ aset_id: '', tanggal_penghapusan: '', alasan: '' });
      Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Aset berhasil dihapus secara permanen.', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Penghapusan Aset</h1>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Trash2 size={20} /> Lakukan Penghapusan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold">Tanggal Penghapusan</th>
                <th className="p-4 font-semibold">Alasan</th>
                <th className="p-4 font-semibold">Diproses Oleh</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
              ) : penghapusan.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-4">Belum ada riwayat penghapusan aset</td></tr>
              ) : (
                penghapusan.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    <td className="p-4">{item.tanggal_penghapusan}</td>
                    <td className="p-4 text-red-600 font-medium">{item.alasan}</td>
                    <td className="p-4">{item.penghapus?.nama}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50 text-red-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle /> Konfirmasi Penghapusan
              </h2>
              <button onClick={() => setShowModal(false)} className="text-red-500 hover:text-red-700">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Aset untuk Dihapus</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-red-500"
                  value={formData.aset_id} onChange={(e) => setFormData({...formData, aset_id: e.target.value})}
                >
                  <option value="">-- Pilih Aset --</option>
                  {asetList.map(a => <option key={a.id} value={a.id}>{a.kode_aset} - {a.nama_aset}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-red-500"
                  value={formData.tanggal_penghapusan} onChange={(e) => setFormData({...formData, tanggal_penghapusan: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Kerusakan/Penghapusan</label>
                <textarea required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-red-500" rows="3"
                  value={formData.alasan} onChange={(e) => setFormData({...formData, alasan: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus Permanen</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenghapusanAset;
