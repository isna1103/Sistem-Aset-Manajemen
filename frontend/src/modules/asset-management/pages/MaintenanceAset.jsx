import React, { useState, useEffect, useContext } from 'react';
import api from '../../../services/api';
import { Plus, CheckCircle, Wrench, ClipboardCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../shared/context/AuthContext';
import LaporanKerusakan from './LaporanKerusakan';

const MaintenanceAset = () => {
  const { user, hasPermission } = useContext(AuthContext);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(hasPermission('Laporan Kerusakan', 'Read/View') ? 'laporan' : 'maintenance');

  const [showSelesaiModal, setShowSelesaiModal] = useState(false);
  const [selesaiData, setSelesaiData] = useState({ id: null, biaya: '', catatan_hasil: '', tanggal_selesai: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      if (hasPermission('Maintenance Aset', 'Read/View')) {
        const res = await api.get('/maintenance');
        setMaintenance(res.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'maintenance') {
      fetchData();
    }
  }, [activeTab]);

  const openSelesaiModal = (id) => {
    setSelesaiData({ id, biaya: '', catatan_hasil: '', tanggal_selesai: new Date().toISOString().split('T')[0] });
    setShowSelesaiModal(true);
  };

  const handleSelesaiSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/maintenance/${selesaiData.id}/selesai`, selesaiData);
      setShowSelesaiModal(false);
      fetchData();
      Swal.fire({ icon: 'success', title: 'Selesai', text: 'Maintenance aset berhasil diselesaikan.', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyelesaikan maintenance' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Maintenance Aset</h1>
      </div>

      <div className="flex border-b border-gray-200">
        {hasPermission('Laporan Kerusakan', 'Read/View') && (
          <button
            className={`py-2 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'laporan' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('laporan')}
          >
            Laporan Kerusakan
          </button>
        )}
        {hasPermission('Maintenance Aset', 'Read/View') && (
          <button
            className={`py-2 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'maintenance' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('maintenance')}
          >
            Proses Maintenance
          </button>
        )}
      </div>

      {activeTab === 'laporan' ? (
        <LaporanKerusakan isTabbed={true} />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                    <th className="p-4 font-semibold">Aset</th>
                    <th className="p-4 font-semibold">Tanggal Mulai</th>
                    <th className="p-4 font-semibold">Deskripsi</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Teknisi</th>
                    {hasPermission('Maintenance Aset', 'Update') && <th className="p-4 font-semibold text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={hasPermission('Maintenance Aset', 'Update') ? 6 : 5} className="text-center p-4">Loading...</td></tr>
                  ) : maintenance.length === 0 ? (
                    <tr><td colSpan={hasPermission('Maintenance Aset', 'Update') ? 6 : 5} className="text-center p-4">Belum ada proses maintenance</td></tr>
                  ) : (
                    maintenance.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                          <div className="text-sm text-gray-500">{item.aset?.kode_aset}</div>
                        </td>
                        <td className="p-4">{item.tanggal_maintenance}</td>
                        <td className="p-4 max-w-xs">
                          <div className="truncate mb-1" title={item.deskripsi}>{item.deskripsi}</div>
                          {item.status === 'Selesai' && (
                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2 border border-gray-100">
                              {item.catatan_hasil && <div className="mb-1"><strong>Catatan:</strong> {item.catatan_hasil}</div>}
                              {item.biaya ? <div><strong>Biaya:</strong> Rp {item.biaya.toLocaleString()}</div> : null}
                              {!item.catatan_hasil && !item.biaya && <span className="text-gray-400 italic">Tidak ada catatan</span>}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Proses' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-800">{item.pihak_ketiga || item.teknisi?.nama || '-'}</span>
                        </td>
                        {hasPermission('Maintenance Aset', 'Update') && (
                          <td className="p-4 text-center">
                            {item.status === 'Proses' && (
                              <button onClick={() => openSelesaiModal(item.id)} className="text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1 rounded flex items-center gap-1 mx-auto text-sm font-medium">
                                <ClipboardCheck size={16} /> Selesai
                              </button>
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
        </div>
      )}



      {showSelesaiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Selesaikan Maintenance</h2>
              <button onClick={() => setShowSelesaiModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleSelesaiSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={selesaiData.tanggal_selesai} onChange={(e) => setSelesaiData({ ...selesaiData, tanggal_selesai: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Opsional)</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  value={selesaiData.biaya} onChange={(e) => setSelesaiData({ ...selesaiData, biaya: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Hasil</label>
                <textarea className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" rows="2"
                  value={selesaiData.catatan_hasil} onChange={(e) => setSelesaiData({ ...selesaiData, catatan_hasil: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSelesaiModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Selesai</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceAset;
