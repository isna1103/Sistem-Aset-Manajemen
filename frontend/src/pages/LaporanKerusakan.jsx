import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { Plus, CheckCircle, XCircle, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

const LaporanKerusakan = ({ isTabbed }) => {
  const { user, hasPermission } = useContext(AuthContext);
  const [laporan, setLaporan] = useState([]);
  const [asetList, setAsetList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ aset_id: '', tanggal_laporan: '', deskripsi_kerusakan: '', prioritas: 'Sedang', teknisi_id: '', pihak_ketiga: '' });
  const [lampiranFile, setLampiranFile] = useState(null);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lapRes, asetRes] = await Promise.all([
        api.get('/laporan-kerusakan'),
        api.get('/aset')
      ]);
      setLaporan(lapRes.data);
      setAsetList(asetRes.data.filter(a => a.status === 'Tersedia' || a.status === 'Dipinjam'));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('aset_id', formData.aset_id);
      data.append('tanggal_laporan', formData.tanggal_laporan);
      data.append('deskripsi_kerusakan', formData.deskripsi_kerusakan);
      data.append('prioritas', formData.prioritas);
      if (formData.teknisi_id) data.append('teknisi_id', formData.teknisi_id);
      if (formData.pihak_ketiga) data.append('pihak_ketiga', formData.pihak_ketiga);
      if (lampiranFile) {
        data.append('lampiran_file', lampiranFile);
      }

      await api.post('/laporan-kerusakan', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowCreateModal(false);
      fetchData();
      setFormData({ aset_id: '', tanggal_laporan: '', deskripsi_kerusakan: '', prioritas: 'Sedang', teknisi_id: '', pihak_ketiga: '' });
      setLampiranFile(null);
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Laporan berhasil dibuat', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  const handleReviewDirect = async (id, status) => {
    const confirm = await Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin me${status === 'Disetujui' ? 'nyetujui' : 'nolak'} laporan ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.put(`/laporan-kerusakan/${id}/review`, {
          status: status,
          catatan_admin: ''
        });
        fetchData();
        Swal.fire({ icon: 'success', title: 'Berhasil', text: res.data.message || `Laporan di${status.toLowerCase()}`, timer: 2000, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Menunggu Review': return 'bg-yellow-100 text-yellow-700';
      case 'Disetujui': return 'bg-blue-100 text-blue-700';
      case 'Ditolak': return 'bg-red-100 text-red-700';
      case 'Diproses': return 'bg-orange-100 text-orange-700';
      case 'Selesai': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'Tinggi': return 'text-red-600 font-semibold';
      case 'Sedang': return 'text-orange-500 font-semibold';
      case 'Rendah': return 'text-green-600 font-semibold';
      default: return '';
    }
  };

  return (
    <div className={isTabbed ? "space-y-4" : "space-y-6"}>
      <div className={`flex items-center ${isTabbed ? 'justify-end' : 'justify-between'}`}>
        {!isTabbed && <h1 className="text-2xl font-bold text-gray-800">Laporan Kerusakan</h1>}
        {hasPermission('Laporan Kerusakan', 'Create') && (
          <button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Buat Laporan
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold">Pelapor</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Deskripsi</th>
                <th className="p-4 font-semibold">Prioritas</th>
                <th className="p-4 font-semibold">Status</th>
                {hasPermission('Laporan Kerusakan', 'Update') && <th className="p-4 font-semibold text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={hasPermission('Laporan Kerusakan', 'Update') ? 7 : 6} className="text-center p-4">Loading...</td></tr>
              ) : laporan.length === 0 ? (
                <tr><td colSpan={hasPermission('Laporan Kerusakan', 'Update') ? 7 : 6} className="text-center p-4">Belum ada laporan</td></tr>
              ) : (
                laporan.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    <td className="p-4">{item.pelapor?.nama}</td>
                    <td className="p-4">{item.tanggal_laporan}</td>
                    <td className="p-4 max-w-xs truncate" title={item.deskripsi_kerusakan}>
                      <div className="mb-1">{item.deskripsi_kerusakan}</div>
                      {item.lampiran && (
                        <a href={`http://localhost:5000${item.lampiran}`} target="_blank" rel="noreferrer" className="text-blue-500 text-xs hover:underline flex items-center gap-1 mt-1">
                          Lihat Lampiran
                        </a>
                      )}
                    </td>
                    <td className={`p-4 ${getPriorityColor(item.prioritas)}`}>{item.prioritas}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    {hasPermission('Laporan Kerusakan', 'Update') && (
                      <td className="p-4 text-center">
                        {item.status === 'Menunggu Review' && (
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleReviewDirect(item.id, 'Disetujui')} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded flex items-center gap-1 text-xs font-medium">
                              <CheckCircle size={14} /> Setuju
                            </button>
                            <button onClick={() => handleReviewDirect(item.id, 'Ditolak')} className="text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded flex items-center gap-1 text-xs font-medium">
                              <XCircle size={14} /> Tolak
                            </button>
                          </div>
                        )}
                        {item.status !== 'Menunggu Review' && (
                          <span className="text-xs text-gray-400">Reviewed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Buat Laporan Kerusakan</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aset</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.aset_id} onChange={(e) => setFormData({ ...formData, aset_id: e.target.value })}
                >
                  <option value="">Pilih Aset</option>
                  {asetList.map(a => <option key={a.id} value={a.id}>{a.kode_aset} - {a.nama_aset}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Laporan</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.tanggal_laporan} onChange={(e) => setFormData({ ...formData, tanggal_laporan: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.prioritas} onChange={(e) => setFormData({ ...formData, prioritas: e.target.value })}
                >
                  <option value="Rendah">Rendah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tinggi">Tinggi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Teknisi (Internal / Eksternal)</label>
                <input type="text" placeholder="Masukkan nama teknisi..." className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formData.pihak_ketiga} onChange={(e) => setFormData({ ...formData, pihak_ketiga: e.target.value, teknisi_id: '' })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kerusakan</label>
                <textarea required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" rows="3"
                  value={formData.deskripsi_kerusakan} onChange={(e) => setFormData({ ...formData, deskripsi_kerusakan: e.target.value })}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Lampiran (Opsional)</label>
                <input type="file" accept="image/*" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 text-sm"
                  onChange={(e) => setLampiranFile(e.target.files[0])}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default LaporanKerusakan;
