import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';

const Kategori = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama_kategori: '', deskripsi: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/kategori');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/kategori/${formData.id}`, formData);
      } else {
        await api.post('/kategori', formData);
      }
      setShowModal(false);
      fetchData();
      setFormData({ id: null, nama_kategori: '', deskripsi: '' });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Kategori berhasil disimpan!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Kategori?',
      text: 'Anda yakin ingin menghapus kategori ini? Data yang terkait mungkin akan terpengaruh.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/kategori/${id}`);
        fetchData();
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Kategori berhasil dihapus.', timer: 1500, showConfirmButton: false });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal menghapus kategori' });
      }
    }
  };

  const openEdit = (item) => {
    setFormData({ id: item.id, nama_kategori: item.nama_kategori, deskripsi: item.deskripsi });
    setShowModal(true);
  };

  const filteredData = data.filter(item => 
    item.nama_kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Data Kategori Barang</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari kategori..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setFormData({ id: null, nama_kategori: '', deskripsi: '' }); setShowModal(true); }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus size={20} /> Tambah Kategori
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-3 px-4 w-16">No</th>
              <th className="py-3 px-4">Nama Kategori</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{item.nama_kategori}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.deskripsi}</td>
                <td className="py-3 px-4 flex justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-4">{formData.id ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                <input 
                  type="text" required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" 
                  value={formData.nama_kategori} onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" 
                  rows="3"
                  value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
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

export default Kategori;
