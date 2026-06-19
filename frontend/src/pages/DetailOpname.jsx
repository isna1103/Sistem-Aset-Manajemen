import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { QrCode, ClipboardCheck, AlertTriangle, ArrowLeft, Printer } from 'lucide-react';
import Swal from 'sweetalert2';
import QRScannerModal from '../components/QRScannerModal';

const DetailOpname = () => {
  const { id } = useParams();
  const { hasPermission } = useContext(AuthContext);
  const [jadwal, setJadwal] = useState(null);
  const [unscanned, setUnscanned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scan');
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [asetList, setAsetList] = useState([]);
  const [lokasiList, setLokasiList] = useState([]);
  const [formData, setFormData] = useState({ aset_id: '', kondisi_fisik: 'Sesuai', lokasi_id: '', keterangan: '' });

  useEffect(() => {
    fetchData();
    fetchAsetAndLokasi();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/jadwal-opname/${id}`);
      setJadwal(res.data.jadwal);
      setUnscanned(res.data.unscanned_aset);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchAsetAndLokasi = async () => {
    try {
      const [asetRes, lokasiRes] = await Promise.all([
        api.get('/aset'),
        api.get('/lokasi')
      ]);
      setAsetList(asetRes.data);
      setLokasiList(lokasiRes.data);
    } catch (err) {
      console.error("Gagal memuat data master", err);
    }
  };

  const handleScanSuccess = (kode_aset) => {
    setShowQRModal(false);
    const aset = asetList.find(a => a.kode_aset === kode_aset || a.id.toString() === kode_aset);
    if (aset) {
      setFormData({ 
        aset_id: aset.id, 
        kondisi_fisik: 'Sesuai', 
        lokasi_id: aset.lokasi_id, 
        keterangan: '' 
      });
      setShowFormModal(true);
    } else {
      Swal.fire({ icon: 'error', title: 'Tidak Ditemukan', text: `Aset dengan kode ${kode_aset} tidak ditemukan di database.` });
    }
  };

  const handleSubmitOpname = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stock-opname', {
        ...formData,
        jadwal_id: id,
        tanggal_opname: new Date().toISOString().split('T')[0]
      });
      setShowFormModal(false);
      fetchData(); // Refresh detail
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Aset berhasil diaudit!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  const handleApprove = async () => {
    try {
      const result = await Swal.fire({
        title: 'Approve & Rekonsiliasi?',
        text: "Sistem akan otomatis mengubah status/lokasi aset master sesuai dengan temuan selisih. Tindakan ini tidak bisa dibatalkan.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Approve & Sesuaikan!'
      });

      if (result.isConfirmed) {
        await api.put(`/jadwal-opname/${id}/status`, { status: 'Selesai' });
        Swal.fire('Berhasil!', 'Sesi Audit selesai dan data master berhasil disesuaikan.', 'success');
        fetchData();
      }
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.message || 'Gagal melakukan approval', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!jadwal) return <div className="p-8 text-center text-red-500">Jadwal tidak ditemukan</div>;

  const scannedCount = jadwal.detail_opname.length;
  const totalCount = scannedCount + unscanned.length;
  const progress = totalCount === 0 ? 0 : Math.round((scannedCount / totalCount) * 100);

  const selisihList = jadwal.detail_opname.filter(d => d.is_selisih);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2 print:hidden">
        <Link to="/stock-opname" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{jadwal.judul}</h1>
          <p className="text-sm text-gray-500">Periode: {jadwal.tanggal_mulai} s/d {jadwal.tanggal_selesai} | Penanggung Jawab: {jadwal.penanggung_jawab?.nama}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${jadwal.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            Status: {jadwal.status}
          </span>
          {jadwal.status === 'Selesai' && (
            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium" onClick={() => window.print()}>
              <Printer size={16} /> Cetak B.A
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:hidden">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Progress Audit</p>
            <h3 className="text-2xl font-bold text-gray-800">{scannedCount} / {totalCount} Aset</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">{progress}%</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 print:hidden overflow-x-auto">
        <button 
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'scan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('scan')}
        >
          <QrCode size={18} /> Riwayat Scan
        </button>
        <button 
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'selisih' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('selisih')}
        >
          <AlertTriangle size={18} /> Temuan Selisih 
          {(selisihList.length > 0 || unscanned.length > 0) && (
            <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">{selisihList.length + unscanned.length}</span>
          )}
        </button>
        <button 
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'approval' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('approval')}
        >
          <ClipboardCheck size={18} /> Approval & B.A
        </button>
      </div>

      {/* Tab Content: Scan */}
      {activeTab === 'scan' && (
        <div className="space-y-4 print:block">
          {jadwal.status !== 'Selesai' && hasPermission('Stock Opname', 'Create') && (
            <div className="flex justify-end print:hidden">
              <button onClick={() => setShowQRModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm">
                <QrCode size={20} /> Scan Aset
              </button>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                    <th className="p-4 font-semibold">Waktu Scan</th>
                    <th className="p-4 font-semibold">Aset</th>
                    <th className="p-4 font-semibold">Kondisi Aktual</th>
                    <th className="p-4 font-semibold">Lokasi Aktual</th>
                    <th className="p-4 font-semibold">Pemeriksa</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwal.detail_opname.length === 0 ? (
                    <tr><td colSpan="5" className="text-center p-8 text-gray-500">Belum ada aset yang di-scan pada sesi ini.</td></tr>
                  ) : (
                    jadwal.detail_opname.map(item => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 text-sm text-gray-600">{new Date(item.created_at).toLocaleString()}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                          <div className="text-xs text-gray-500">{item.aset?.kode_aset}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${item.kondisi_fisik === 'Sesuai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.kondisi_fisik}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-700">{item.lokasi_aktual?.nama_lokasi || '-'}</td>
                        <td className="p-4 text-sm text-gray-700">{item.pemeriksa?.nama}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Selisih */}
      {activeTab === 'selisih' && (
        <div className="space-y-6 print:block">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100">
              <h3 className="font-bold text-red-800 flex items-center gap-2"><AlertTriangle size={18} /> Temuan Scan Tidak Sesuai</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600">
                    <th className="p-4 font-semibold">Aset</th>
                    <th className="p-4 font-semibold">Data Master</th>
                    <th className="p-4 font-semibold">Kondisi Aktual (Scan)</th>
                    <th className="p-4 font-semibold">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {selisihList.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-6 text-gray-500">Tidak ada selisih dari hasil scan.</td></tr>
                  ) : (
                    selisihList.map(item => (
                      <tr key={item.id} className="border-b border-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{item.aset?.nama_aset}</div>
                          <div className="text-xs text-gray-500">{item.aset?.kode_aset}</div>
                        </td>
                        <td className="p-4 text-sm">
                          <div>Kondisi: <span className="font-medium">{item.aset?.kondisi}</span></div>
                          <div className="text-gray-500">Lokasi: ID {item.aset?.lokasi_id}</div>
                        </td>
                        <td className="p-4 text-sm text-red-600 font-medium">
                          <div>Kondisi: {item.kondisi_fisik}</div>
                          <div>Lokasi: ID {item.lokasi_id}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{item.keterangan || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
            <div className="bg-orange-50 p-4 border-b border-orange-100">
              <h3 className="font-bold text-orange-800 flex items-center gap-2">Aset Belum Ditemukan / Belum Discan ({unscanned.length})</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {unscanned.map(aset => (
                <div key={aset.id} className="border border-gray-200 rounded-lg p-3 hover:border-orange-300 transition-colors bg-white">
                  <div className="font-bold text-gray-800">{aset.nama_aset}</div>
                  <div className="text-xs font-mono text-gray-500 mb-2">{aset.kode_aset}</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded inline-block text-gray-700">Lokasi Data: {aset.lokasi}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Approval & BA */}
      {activeTab === 'approval' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 print:p-0 print:border-none print:shadow-none print:block">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">BERITA ACARA STOCK OPNAME</h2>
            <p className="text-gray-600">Sistem Aset Manajemen</p>
          </div>
          
          <div className="space-y-6 text-gray-800 mb-12">
            <p>Pada hari ini, telah dilaksanakan Stock Opname / Audit Aset dengan rincian sebagai berikut:</p>
            <table className="w-full max-w-lg">
              <tbody>
                <tr><td className="py-2 w-48 text-gray-600">Judul Audit</td><td className="py-2 font-medium">: {jadwal.judul}</td></tr>
                <tr><td className="py-2 w-48 text-gray-600">Periode Pelaksanaan</td><td className="py-2 font-medium">: {jadwal.tanggal_mulai} s/d {jadwal.tanggal_selesai}</td></tr>
                <tr><td className="py-2 w-48 text-gray-600">Total Aset Tercatat</td><td className="py-2 font-medium">: {totalCount} Item</td></tr>
                <tr><td className="py-2 w-48 text-gray-600">Aset Berhasil Discan</td><td className="py-2 font-medium">: {scannedCount} Item</td></tr>
                <tr><td className="py-2 w-48 text-gray-600">Aset Tidak Ditemukan</td><td className="py-2 font-medium">: {unscanned.length} Item</td></tr>
                <tr><td className="py-2 w-48 text-gray-600">Total Temuan Selisih</td><td className="py-2 font-medium">: {selisihList.length} Item</td></tr>
              </tbody>
            </table>
            
            <p>Berdasarkan hasil pemeriksaan fisik, status aset dan lokasi aset pada sistem telah/akan disesuaikan dengan kondisi riil di lapangan.</p>
          </div>

          <div className="flex justify-between items-end mt-20 pt-10 border-t border-gray-200">
            <div className="text-center">
              <p className="mb-20 text-gray-600">Dibuat Oleh,</p>
              <p className="font-bold underline">{jadwal.penanggung_jawab?.nama}</p>
              <p className="text-sm text-gray-500">Penanggung Jawab Audit</p>
            </div>
            <div className="text-center">
              <p className="mb-20 text-gray-600">Mengetahui & Menyetujui,</p>
              {jadwal.status === 'Selesai' ? (
                <div>
                  <p className="font-bold text-green-600 mb-1">DISETUJUI PADA SISTEM</p>
                  <p className="text-sm text-gray-500">Manager / Kepala Bagian</p>
                </div>
              ) : (
                <div className="w-48 border-b border-gray-400"></div>
              )}
            </div>
          </div>

          {jadwal.status !== 'Selesai' && hasPermission('Stock Opname', 'Update') && (
            <div className="mt-12 text-center print:hidden bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2">Selesaikan Sesi Audit?</h3>
              <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">Dengan menekan tombol Approve, sistem akan merubah data master Aset (status, kondisi, dan lokasi) menyesuaikan dengan temuan audit ini.</p>
              <button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all">
                Approve & Rekonsiliasi Data
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Form Scan */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Kondisi Aset</h2>
              <button onClick={() => setShowFormModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleSubmitOpname} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aset Terdeteksi</label>
                <div className="p-3 bg-blue-50 text-blue-800 font-medium rounded-lg border border-blue-100">
                  {asetList.find(a => a.id === formData.aset_id)?.nama_aset || '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Aktual</label>
                <select required className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.kondisi_fisik} onChange={(e) => setFormData({...formData, kondisi_fisik: e.target.value})}
                >
                  <option value="Sesuai">Sesuai (Baik & Tersedia)</option>
                  <option value="Tidak Sesuai">Tidak Sesuai Data (Rusak Ringan)</option>
                  <option value="Rusak">Rusak Berat</option>
                  <option value="Hilang">Hilang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Aktual (Pilih Jika Pindah)</label>
                <select required className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.lokasi_id} onChange={(e) => setFormData({...formData, lokasi_id: e.target.value})}
                >
                  {lokasiList.map(l => <option key={l.id} value={l.id}>{l.nama_lokasi}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
                <textarea className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500" rows="2"
                  value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  placeholder="Beri catatan jika ada perbedaan"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">Simpan Scan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scanner Popup Component */}
      <QRScannerModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
        onScanSuccess={handleScanSuccess} 
      />
    </div>
  );
};

export default DetailOpname;
