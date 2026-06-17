import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ClipboardList, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

const StockOpname = () => {
  const [opname, setOpname] = useState([]);
  const [asetList, setAsetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ aset_id: '', tanggal_opname: '', kondisi_fisik: 'Sesuai', keterangan: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [opRes, asetRes] = await Promise.all([
        api.get('/stock-opname'),
        api.get('/aset')
      ]);
      setOpname(opRes.data);
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
      await api.post('/stock-opname', formData);
      setShowModal(false);
      fetchData();
      setFormData({ aset_id: '', tanggal_opname: '', kondisi_fisik: 'Sesuai', keterangan: '' });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Hasil stock opname berhasil dicatat!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Stock Opname</h1>
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <ClipboardList size={20} /> Catat Hasil Opname
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Kondisi Fisik</th>
                <th className="p-4 font-semibold">Keterangan</th>
                <th className="p-4 font-semibold">Pemeriksa</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
              ) : opname.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">Belum ada riwayat stock opname</td></tr>
              ) : (
                opname.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    <td className="p-4">{item.tanggal_opname}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.kondisi_fisik === 'Sesuai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.kondisi_fisik}
                      </span>
                    </td>
                    <td className="p-4">{item.keterangan || '-'}</td>
                    <td className="p-4">{item.pemeriksa?.nama}</td>
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
              <h2 className="text-xl font-bold text-gray-800">Catat Stock Opname</h2>
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
                  value={formData.tanggal_opname} onChange={(e) => setFormData({...formData, tanggal_opname: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Fisik</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.kondisi_fisik} onChange={(e) => setFormData({...formData, kondisi_fisik: e.target.value})}
                >
                  <option value="Sesuai">Sesuai (Baik & Tersedia)</option>
                  <option value="Tidak Sesuai">Tidak Sesuai Data</option>
                  <option value="Rusak">Rusak</option>
                  <option value="Hilang">Hilang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
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

export default StockOpname;
