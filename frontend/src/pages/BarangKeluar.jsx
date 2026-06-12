import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Minus } from 'lucide-react';

const BarangKeluar = () => {
  const [data, setData] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    kode_transaksi: '', barang_id: '', jumlah: '', tanggal_keluar: '', tujuan: '', peminjam: '', keterangan: '' 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    fetchBarang();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/barang-keluar');
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBarang = async () => {
    try {
      const res = await api.get('/barang');
      // Hanya tampilkan barang yang stoknya > 0
      setBarangList(res.data.filter(b => b.jumlah_stok > 0));
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/barang-keluar', formData);
      setShowModal(false);
      fetchData();
      setFormData({ kode_transaksi: '', barang_id: '', jumlah: '', tanggal_keluar: '', tujuan: '', peminjam: '', keterangan: '' });
    } catch (err) { 
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Transaksi Barang Keluar</h2>
          <p className="text-sm text-gray-500">Pencatatan pengeluaran / peminjaman aset</p>
        </div>
        <button 
          onClick={() => { setFormData({ kode_transaksi: `BK-${Date.now()}`, barang_id: '', jumlah: '', tanggal_keluar: new Date().toISOString().split('T')[0], tujuan: '', peminjam: '', keterangan: '' }); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Minus size={20} /> Input Barang Keluar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Kode Transaksi</th>
              <th className="py-3 px-4">Nama Barang</th>
              <th className="py-3 px-4">Peminjam / Tujuan</th>
              <th className="py-3 px-4">Jumlah</th>
              <th className="py-3 px-4">Petugas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm">{item.tanggal_keluar}</td>
                <td className="py-3 px-4 text-sm font-semibold">{item.kode_transaksi}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{item.barang?.nama_barang}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.peminjam || item.tujuan || '-'}</td>
                <td className="py-3 px-4 text-sm font-bold text-red-600">-{item.jumlah}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.user?.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">Input Barang Keluar</h3>
            {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Barang (Stok Tersedia)</label>
                  <select required className="w-full px-3 py-2 border rounded-lg bg-white" value={formData.barang_id} onChange={e => setFormData({...formData, barang_id: e.target.value})}>
                    <option value="">Pilih Barang</option>
                    {barangList.map(b => <option key={b.id_barang} value={b.id_barang}>{b.kode_barang} - {b.nama_barang} (Stok: {b.jumlah_stok})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jumlah</label>
                    <input type="number" required min="1" className="w-full px-3 py-2 border rounded-lg" value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tanggal</label>
                    <input type="date" required className="w-full px-3 py-2 border rounded-lg" value={formData.tanggal_keluar} onChange={e => setFormData({...formData, tanggal_keluar: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tujuan Divisi</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.tujuan} onChange={e => setFormData({...formData, tujuan: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Peminjam</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.peminjam} onChange={e => setFormData({...formData, peminjam: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Keterangan</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg" rows="2" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})}></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Simpan Transaksi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarangKeluar;
