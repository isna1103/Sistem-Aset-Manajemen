import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, CheckCircle, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const PeminjamanAset = () => {
  const { user } = useContext(AuthContext);
  const [peminjaman, setPeminjaman] = useState([]);
  const [asetTersedia, setAsetTersedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalPinjam, setShowModalPinjam] = useState(false);
  const [showModalKembali, setShowModalKembali] = useState(false);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);

  const [formPinjam, setFormPinjam] = useState({ aset_id: '', tanggal_pinjam: '', jadwal_kembali: '', nama_peminjam: '', divisi: '', lampiran_file: null });
  const [formKembali, setFormKembali] = useState({ tanggal_kembali: '', kondisi_kembali: 'Baik', lampiran_kembali_file: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const endpoint = user?.role === 'Admin' ? '/peminjaman' : '/peminjaman/me';
      const [pemRes, asetRes] = await Promise.all([
        api.get(endpoint),
        api.get('/aset')
      ]);
      setPeminjaman(pemRes.data);
      // Hanya aset yang tersedia yang bisa dipinjam
      setAsetTersedia(asetRes.data.filter(a => a.status === 'Tersedia'));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handlePinjamSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('aset_id', formPinjam.aset_id);
      formData.append('tanggal_pinjam', formPinjam.tanggal_pinjam);
      formData.append('jadwal_kembali', formPinjam.jadwal_kembali);
      formData.append('nama_peminjam', formPinjam.nama_peminjam);
      formData.append('divisi', formPinjam.divisi);
      if (formPinjam.lampiran_file) {
        formData.append('lampiran_file', formPinjam.lampiran_file);
      }

      await api.post('/peminjaman', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowModalPinjam(false);
      fetchData();
      setFormPinjam({ aset_id: '', tanggal_pinjam: '', jadwal_kembali: '', nama_peminjam: '', divisi: '', lampiran_file: null });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Peminjaman aset berhasil dicatat!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  const handleKembaliSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('tanggal_kembali', new Date().toISOString().split('T')[0]);
      formData.append('kondisi_kembali', formKembali.kondisi_kembali);
      if (formKembali.lampiran_kembali_file) {
        formData.append('lampiran_kembali_file', formKembali.lampiran_kembali_file);
      }

      await api.put(`/peminjaman/${selectedPeminjaman.id}/pengembalian`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowModalKembali(false);
      fetchData();
      setFormKembali({ kondisi_kembali: 'Baik', lampiran_kembali_file: null });
      setSelectedPeminjaman(null);
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Aset berhasil dikembalikan!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Hapus Data?',
      text: "Data peminjaman ini akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/peminjaman/${id}`);
          fetchData();
          Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Data peminjaman telah dihapus', timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan saat menghapus data' });
        }
      }
    });
  };

  const getDisplayStatus = (item) => {
    if (item.status === 'Dikembalikan') return { text: 'Dikembalikan', color: 'bg-green-100 text-green-700' };
    if (item.status === 'Dipinjam') {
      const today = new Date().toISOString().split('T')[0];
      if (item.jadwal_kembali && item.jadwal_kembali < today) {
        return { text: 'Telat Dikembalikan', color: 'bg-red-100 text-red-700' };
      }
      return { text: 'Dipinjam', color: 'bg-yellow-100 text-yellow-700' };
    }
    return { text: item.status, color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {user?.role === 'Admin' ? 'Seluruh Peminjaman Aset' : 'Riwayat Peminjaman Saya'}
        </h1>
        <button onClick={() => setShowModalPinjam(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Pinjam Aset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Aset</th>
                <th className="p-4 font-semibold">Nama Peminjam</th>
                <th className="p-4 font-semibold">Divisi</th>
                <th className="p-4 font-semibold">Tanggal Pinjam</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Tanggal Kembali</th>
                <th className="p-4 font-semibold">Kondisi Kembali</th>
                <th className="p-4 font-semibold text-center">Lampiran Pinjam</th>
                <th className="p-4 font-semibold text-center">Lampiran Kembali</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center p-4">Loading...</td></tr>
              ) : peminjaman.length === 0 ? (
                <tr><td colSpan={8} className="text-center p-4">Belum ada peminjaman</td></tr>
              ) : (
                peminjaman.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    <td className="p-4">{item.nama_peminjam || '-'}</td>
                    <td className="p-4">{item.divisi || '-'}</td>
                    <td className="p-4">{item.tanggal_pinjam}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDisplayStatus(item).color}`}>
                        {getDisplayStatus(item).text}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{item.tanggal_kembali || item.jadwal_kembali || '-'}</td>
                    <td className="p-4 text-gray-500">{item.kondisi_kembali || '-'}</td>
                    <td className="p-4 text-center">
                      {item.lampiran ? (
                        <a href={`http://localhost:5000${item.lampiran}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">Lihat Foto</a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.lampiran_kembali ? (
                        <a href={`http://localhost:5000${item.lampiran_kembali}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">Lihat Foto</a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        {item.status === 'Dipinjam' && (
                          <button
                            onClick={() => { setSelectedPeminjaman(item); setShowModalKembali(true); }}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Kembalikan
                          </button>
                        )}
                        {user?.role === 'Admin' && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded-lg"
                            title="Hapus Data"
                          >
                            <Trash2 size={16} />
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

      {/* Modal Pinjam */}
      {showModalPinjam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Ajukan Peminjaman Aset</h2>
              <button onClick={() => setShowModalPinjam(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handlePinjamSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Aset Tersedia</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formPinjam.aset_id} onChange={(e) => setFormPinjam({ ...formPinjam, aset_id: e.target.value })}
                >
                  <option value="">-- Pilih Aset --</option>
                  {asetTersedia.map(a => <option key={a.id} value={a.id}>{a.kode_aset} - {a.nama_aset}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peminjam</label>
                <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formPinjam.nama_peminjam} onChange={(e) => setFormPinjam({ ...formPinjam, nama_peminjam: e.target.value })}
                  placeholder="Nama yang akan meminjam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formPinjam.divisi} onChange={(e) => setFormPinjam({ ...formPinjam, divisi: e.target.value })}
                  placeholder="Divisi / Unit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formPinjam.tanggal_pinjam} onChange={(e) => setFormPinjam({ ...formPinjam, tanggal_pinjam: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengembalian</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formPinjam.jadwal_kembali} onChange={(e) => setFormPinjam({ ...formPinjam, jadwal_kembali: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Lampiran (Opsional)</label>
                <input type="file" accept="image/*" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  onChange={(e) => setFormPinjam({ ...formPinjam, lampiran_file: e.target.files[0] })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModalPinjam(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Pinjam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kembali */}
      {showModalKembali && selectedPeminjaman && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Pengembalian Aset</h2>
              <button onClick={() => setShowModalKembali(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleKembaliSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                Mengembalikan aset: <strong>{selectedPeminjaman.aset?.nama_aset}</strong>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Saat Dikembalikan</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formKembali.kondisi_kembali} onChange={(e) => setFormKembali({ ...formKembali, kondisi_kembali: e.target.value })}
                >
                  <option value="Baik">Baik</option>
                  <option value="Kurang Baik">Kurang Baik</option>
                  <option value="Rusak">Rusak</option>
                  <option value="Hilang">Hilang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Bukti Pengembalian (Opsional)</label>
                <input type="file" accept="image/*" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  onChange={(e) => setFormKembali({ ...formKembali, lampiran_kembali_file: e.target.files[0] })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModalKembali(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Proses Kembali</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeminjamanAset;
