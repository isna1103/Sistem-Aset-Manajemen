import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, CheckCircle, Wrench } from 'lucide-react';

const MaintenanceAset = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [asetList, setAsetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ aset_id: '', tanggal_maintenance: '', deskripsi: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [maintRes, asetRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/aset')
      ]);
      setMaintenance(maintRes.data);
      // Hanya aset yang tidak sedang dihapus yang bisa dimaintenance
      setAsetList(asetRes.data.filter(a => a.status !== 'Dihapus'));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/maintenance', formData);
      setShowModal(false);
      fetchData();
      setFormData({ aset_id: '', tanggal_maintenance: '', deskripsi: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleSelesai = async (id) => {
    if (window.confirm('Tandai maintenance ini sebagai selesai? Aset akan kembali ke status Tersedia dengan kondisi Baik.')) {
      try {
        await api.put(`/maintenance/${id}/selesai`);
        fetchData();
      } catch (err) {
        alert('Gagal menyelesaikan maintenance');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Maintenance</h1>
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Wrench size={20} /> Jadwalkan Maintenance
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Deskripsi</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Teknisi (Admin)</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
              ) : maintenance.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-4">Belum ada riwayat maintenance</td></tr>
              ) : (
                maintenance.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    <td className="p-4">{item.tanggal_maintenance}</td>
                    <td className="p-4">{item.deskripsi}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Proses' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">{item.teknisi?.nama}</td>
                    <td className="p-4 text-center">
                      {item.status === 'Proses' && (
                        <button onClick={() => handleSelesai(item.id)} className="text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1 rounded flex items-center gap-1 mx-auto text-sm font-medium">
                          <CheckCircle size={16} /> Selesai
                        </button>
                      )}
                    </td>
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
              <h2 className="text-xl font-bold text-gray-800">Jadwalkan Maintenance</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.tanggal_maintenance} onChange={(e) => setFormData({...formData, tanggal_maintenance: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kerusakan/Tindakan</label>
                <textarea required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" rows="3"
                  value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
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

export default MaintenanceAset;
