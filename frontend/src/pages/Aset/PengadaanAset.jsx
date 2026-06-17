import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Search, Edit, Trash2, FileText, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const PengadaanAset = () => {
  const { user, hasPermission } = useContext(AuthContext);
  const [aset, setAset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    kode_aset: '', nama_aset: '', kategori_id: '', lokasi: '', tanggal_pengadaan: '', kondisi: 'Baik', status: 'Tersedia'
  });
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [asetRes, katRes] = await Promise.all([
        api.get('/aset'),
        api.get('/kategori')
      ]);
      setAset(asetRes.data);
      setKategoriList(katRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/aset', formData);
      setShowModal(false);
      fetchData();
      setFormData({
        kode_aset: '', nama_aset: '', kategori_id: '', lokasi: '', tanggal_pengadaan: '', kondisi: 'Baik', status: 'Tersedia'
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus aset ini?')) {
      try {
        await api.delete(`/aset/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePrintQR = (item) => {
    if (!item.qr_code) return alert('QR Code belum tersedia untuk aset ini');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${item.kode_aset}</title>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: white; }
            @page { size: 100mm 100mm; margin: 0; }
          </style>
        </head>
        <body>
          <img src="${item.qr_code}" style="width: 75mm; height: 75mm; object-fit: contain;" />
          <script>
            window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 300); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredAset = aset.filter(item => 
    item.nama_aset.toLowerCase().includes(search.toLowerCase()) ||
    item.kode_aset.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Aset</h1>
        {hasPermission('Pengadaan Aset', 'Create') && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Aset
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search className="text-gray-400" />
        <input 
          type="text"
          placeholder="Cari berdasarkan kode atau nama aset..."
          className="flex-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Kode Aset</th>
                <th className="p-4 font-semibold">Nama Aset</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Lokasi</th>
                <th className="p-4 font-semibold">Kondisi</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center p-4">Loading...</td></tr>
              ) : filteredAset.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-4">Data tidak ditemukan</td></tr>
              ) : (
                filteredAset.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-800">{item.kode_aset}</td>
                    <td className="p-4">{item.nama_aset}</td>
                    <td className="p-4">{item.kategori?.nama_kategori}</td>
                    <td className="p-4">{item.lokasi}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.kondisi === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Tersedia' ? 'bg-blue-100 text-blue-700' : item.status === 'Dipinjam' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {hasPermission('Pengadaan Aset', 'Read/View') && (
                          <button onClick={() => handlePrintQR(item)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Cetak Stiker QR">
                            <QrCode size={18} />
                          </button>
                        )}
                        {hasPermission('Pengadaan Aset', 'Delete') && (
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hapus Aset">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
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
              <h2 className="text-xl font-bold text-gray-800">Tambah Aset Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Aset</label>
                <input type="text" name="kode_aset" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" value={formData.kode_aset} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aset</label>
                <input type="text" name="nama_aset" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" value={formData.nama_aset} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="kategori_id" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" value={formData.kategori_id} onChange={handleInputChange}>
                  <option value="">Pilih Kategori</option>
                  {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input type="text" name="lokasi" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" value={formData.lokasi} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengadaan</label>
                <input type="date" name="tanggal_pengadaan" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" value={formData.tanggal_pengadaan} onChange={handleInputChange} />
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

export default PengadaanAset;
