import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, CheckCircle } from 'lucide-react';

const PeminjamanAset = () => {
  const { user } = useContext(AuthContext);
  const [peminjaman, setPeminjaman] = useState([]);
  const [asetTersedia, setAsetTersedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalPinjam, setShowModalPinjam] = useState(false);
  const [showModalKembali, setShowModalKembali] = useState(false);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);
  
  const [formPinjam, setFormPinjam] = useState({ aset_id: '', tanggal_pinjam: '' });
  const [formKembali, setFormKembali] = useState({ tanggal_kembali: '', kondisi_kembali: 'Baik' });

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
      await api.post('/peminjaman', formPinjam);
      setShowModalPinjam(false);
      fetchData();
      setFormPinjam({ aset_id: '', tanggal_pinjam: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleKembaliSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/peminjaman/${selectedPeminjaman.id}/pengembalian`, formKembali);
      setShowModalKembali(false);
      fetchData();
      setFormKembali({ tanggal_kembali: '', kondisi_kembali: 'Baik' });
      setSelectedPeminjaman(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan');
    }
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
                {user?.role === 'Admin' && <th className="p-4 font-semibold">Peminjam</th>}
                <th className="p-4 font-semibold">Tanggal Pinjam</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Tanggal Kembali</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={user?.role === 'Admin' ? 6 : 5} className="text-center p-4">Loading...</td></tr>
              ) : peminjaman.length === 0 ? (
                <tr><td colSpan={user?.role === 'Admin' ? 6 : 5} className="text-center p-4">Belum ada peminjaman</td></tr>
              ) : (
                peminjaman.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                      <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                    </td>
                    {user?.role === 'Admin' && <td className="p-4">{item.peminjam?.nama}</td>}
                    <td className="p-4">{item.tanggal_pinjam}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Dipinjam' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{item.tanggal_kembali || '-'}</td>
                    <td className="p-4 text-center">
                      {item.status === 'Dipinjam' && (
                        <button 
                          onClick={() => { setSelectedPeminjaman(item); setShowModalKembali(true); }}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 mx-auto"
                        >
                          <CheckCircle size={16} /> Kembalikan
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
                  value={formPinjam.aset_id} onChange={(e) => setFormPinjam({...formPinjam, aset_id: e.target.value})}
                >
                  <option value="">-- Pilih Aset --</option>
                  {asetTersedia.map(a => <option key={a.id} value={a.id}>{a.kode_aset} - {a.nama_aset}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formPinjam.tanggal_pinjam} onChange={(e) => setFormPinjam({...formPinjam, tanggal_pinjam: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kembali</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formKembali.tanggal_kembali} onChange={(e) => setFormKembali({...formKembali, tanggal_kembali: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Saat Dikembalikan</label>
                <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={formKembali.kondisi_kembali} onChange={(e) => setFormKembali({...formKembali, kondisi_kembali: e.target.value})}
                >
                  <option value="Baik">Baik</option>
                  <option value="Kurang Baik">Kurang Baik</option>
                  <option value="Rusak">Rusak</option>
                </select>
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
