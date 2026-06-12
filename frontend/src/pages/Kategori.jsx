import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Kategori = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama_kategori: '', deskripsi: '' });

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await api.delete(`/kategori/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEdit = (item) => {
    setFormData({ id: item.id, nama_kategori: item.nama_kategori, deskripsi: item.deskripsi });
    setShowModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Data Kategori Barang</h2>
        <button 
          onClick={() => { setFormData({ id: null, nama_kategori: '', deskripsi: '' }); setShowModal(true); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Tambah Kategori
        </button>
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
            {data.map((item, index) => (
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
            {data.length === 0 && (
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
