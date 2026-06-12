import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, QrCode } from 'lucide-react';

const Barang = () => {
  const [data, setData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showQR, setShowQR] = useState(null);
  const [formData, setFormData] = useState({ 
    id: null, kode_barang: '', nama_barang: '', kategori_id: '', satuan: '', lokasi_penyimpanan: '', tanggal_perolehan: '', harga_barang: '' 
  });

  useEffect(() => {
    fetchData();
    fetchKategori();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/barang');
      setData(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchKategori = async () => {
    try {
      const res = await api.get('/kategori');
      setKategoriList(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/barang/${formData.id}`, formData);
      } else {
        await api.post('/barang', formData);
      }
      setShowModal(false);
      fetchData();
      setFormData({ id: null, kode_barang: '', nama_barang: '', kategori_id: '', satuan: '', lokasi_penyimpanan: '', tanggal_perolehan: '', harga_barang: '' });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        await api.delete(`/barang/${id}`);
        fetchData();
      } catch (err) { console.error(err); }
    }
  };

  const openEdit = (item) => {
    setFormData({ 
      id: item.id_barang, kode_barang: item.kode_barang, nama_barang: item.nama_barang, 
      kategori_id: item.kategori_id, satuan: item.satuan, lokasi_penyimpanan: item.lokasi_penyimpanan, 
      tanggal_perolehan: item.tanggal_perolehan, harga_barang: item.harga_barang 
    });
    setShowModal(true);
  };

  const getStokBadge = (stok) => {
    if (stok > 20) return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Tersedia ({stok})</span>;
    if (stok >= 10 && stok <= 20) return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Menipis ({stok})</span>;
    return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Kritis ({stok})</span>;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Laporan Stok Barang</h2>
          <p className="text-sm text-gray-500">Master data seluruh aset</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: null, kode_barang: '', nama_barang: '', kategori_id: '', satuan: '', lokasi_penyimpanan: '', tanggal_perolehan: '', harga_barang: '' }); setShowModal(true); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Tambah Barang
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-3 px-4">Kode</th>
              <th className="py-3 px-4">Nama Barang</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-4">Stok / Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id_barang} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm font-semibold">{item.kode_barang}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{item.nama_barang}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.kategori?.nama_kategori}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.lokasi_penyimpanan}</td>
                <td className="py-3 px-4 text-sm">{getStokBadge(item.jumlah_stok)}</td>
                <td className="py-3 px-4 flex justify-center gap-2">
                  <button onClick={() => setShowQR(item)} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Lihat QR Code">
                    <QrCode size={18} />
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id_barang)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl flex flex-col items-center">
            <h3 className="font-bold mb-4">{showQR.nama_barang}</h3>
            <img src={showQR.qr_code} alt="QR Code" className="w-48 h-48 border rounded-lg p-2 bg-gray-50" />
            <p className="mt-4 text-sm text-gray-500">{showQR.kode_barang}</p>
            <button onClick={() => setShowQR(null)} className="mt-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg w-full">Tutup</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">{formData.id ? 'Edit Barang' : 'Tambah Barang'}</h3>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kode Barang</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.kode_barang} onChange={e => setFormData({...formData, kode_barang: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Barang</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.nama_barang} onChange={e => setFormData({...formData, nama_barang: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select required className="w-full px-3 py-2 border rounded-lg bg-white" value={formData.kategori_id} onChange={e => setFormData({...formData, kategori_id: e.target.value})}>
                    <option value="">Pilih Kategori</option>
                    {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Satuan</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.satuan} onChange={e => setFormData({...formData, satuan: e.target.value})} placeholder="pcs, unit, box" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lokasi Penyimpanan</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.lokasi_penyimpanan} onChange={e => setFormData({...formData, lokasi_penyimpanan: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Harga Barang</label>
                  <input type="number" required className="w-full px-3 py-2 border rounded-lg" value={formData.harga_barang} onChange={e => setFormData({...formData, harga_barang: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Perolehan</label>
                  <input type="date" required className="w-full px-3 py-2 border rounded-lg" value={formData.tanggal_perolehan} onChange={e => setFormData({...formData, tanggal_perolehan: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Barang;
