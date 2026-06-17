import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ArrowRightLeft, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

const MutasiAset = () => {
  const [mutasi, setMutasi] = useState([]);
  const [asetList, setAsetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    aset_id: '', lokasi_baru: '', tanggal_mutasi: '', keterangan: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mutasiRes, asetRes] = await Promise.all([
        api.get('/mutasi'),
        api.get('/aset')
      ]);
      setMutasi(mutasiRes.data);
      setAsetList(asetRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mutasi', formData);
      setShowModal(false);
      fetchData();
      setFormData({ aset_id: '', lokasi_baru: '', tanggal_mutasi: '', keterangan: '' });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Mutasi aset berhasil dicatat!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Mutasi Aset</h1>
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Catat Mutasi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold text-center">Mutasi Lokasi</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Keterangan</th>
                <th className="p-4 font-semibold">Diproses Oleh</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
              ) : mutasi.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">Belum ada riwayat mutasi</td></tr>
              ) : (
                mutasi.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">{item.lokasi_lama}</span>
                        <ArrowRightLeft size={16} className="text-gray-400" />
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">{item.lokasi_baru}</span>
                      </div>
                    </td>
                    <td className="p-4">{item.tanggal_mutasi}</td>
                    <td className="p-4 text-gray-600">{item.keterangan || '-'}</td>
                    <td className="p-4">{item.user?.nama}</td>
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
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Catat Mutasi Aset</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Aset</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.aset_id} onChange={(e) => setFormData({...formData, aset_id: e.target.value})}
                >
                  <option value="">Pilih Aset</option>
                  {asetList.map(a => <option key={a.id} value={a.id}>{a.kode_aset} - {a.nama_aset}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Baru</label>
                <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.lokasi_baru} onChange={(e) => setFormData({...formData, lokasi_baru: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mutasi</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.tanggal_mutasi} onChange={(e) => setFormData({...formData, tanggal_mutasi: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
                <textarea className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" rows="3"
                  value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutasiAset;
