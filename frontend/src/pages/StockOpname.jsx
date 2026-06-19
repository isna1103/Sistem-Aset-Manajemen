import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ClipboardList, Plus, Search, Calendar, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const StockOpname = () => {
  const { hasPermission } = useContext(AuthContext);
  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ judul: '', tanggal_mulai: '', tanggal_selesai: '', catatan: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/jadwal-opname');
      setJadwalList(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jadwal-opname', formData);
      setShowModal(false);
      fetchData();
      setFormData({ judul: '', tanggal_mulai: '', tanggal_selesai: '', catatan: '' });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Jadwal Stock Opname berhasil dibuat!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-700';
      case 'Berlangsung': return 'bg-blue-100 text-blue-700';
      case 'Menunggu Approval': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Audit / Stock Opname</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar jadwal sesi pemeriksaan fisik aset</p>
        </div>
        {hasPermission('Stock Opname', 'Create') && (
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-sm transition-colors">
            <Plus size={20} /> Buat Sesi Audit
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cari sesi audit..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : jadwalList.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <ClipboardList size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">Belum ada jadwal sesi audit</p>
              <p className="text-gray-400 text-sm">Klik "Buat Sesi Audit" untuk memulai stock opname pertama Anda.</p>
            </div>
          ) : (
            jadwalList.map((item) => (
              <div key={item.id} className="p-5 hover:bg-blue-50/30 transition-colors flex items-center group">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mr-4">
                  <ClipboardList size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{item.judul}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {item.tanggal_mulai} s/d {item.tanggal_selesai}</span>
                    <span>Penanggung Jawab: <span className="font-medium text-gray-700">{item.penanggung_jawab?.nama}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <Link to={`/stock-opname/${item.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <ChevronRight size={24} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Form Buat Jadwal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Buat Sesi Audit Baru</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 rounded-full p-1 transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Audit / Sesi</label>
                <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  placeholder="Contoh: Stock Opname Tahunan 2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Mulai</label>
                  <input type="date" required className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                    value={formData.tanggal_mulai} onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Selesai</label>
                  <input type="date" required className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500"
                    value={formData.tanggal_selesai} onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan / Deskripsi (Opsional)</label>
                <textarea className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500" rows="3"
                  value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                  placeholder="Fokus pada pengecekan aset divisi..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm transition-colors">Buat Sesi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockOpname;
