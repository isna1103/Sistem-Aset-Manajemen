import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../services/api';
import { ArrowLeft, Printer, History, Wrench, ArrowRightLeft, ClipboardCheck, Box, FileText } from 'lucide-react';

const DetailAset = () => {
  const { kode_aset } = useParams();
  const navigate = useNavigate();
  const [aset, setAset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('peminjaman');

  useEffect(() => {
    const fetchAset = async () => {
      try {
        const res = await api.get(`/aset/kode/${kode_aset}`);
        setAset(res.data);
      } catch (err) {
        console.error(err);
        alert('Aset tidak ditemukan');
        navigate('/aset');
      } finally {
        setLoading(false);
      }
    };
    fetchAset();
  }, [kode_aset, navigate]);

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat detail aset...</div>;
  if (!aset) return <div className="p-8 text-center text-red-500">Aset tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      {/* --- SCREEN UI --- */}
      <div className="print:hidden space-y-6 max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <ArrowLeft size={20} /> Kembali
          </button>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-8 text-white flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-800/30 p-2 rounded-lg"><Box size={24} className="text-green-100" /></div>
                <h1 className="text-3xl font-bold tracking-tight">{aset.nama_aset}</h1>
              </div>
              <p className="text-green-100 font-mono text-lg tracking-wider ml-11">{aset.kode_aset}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm ${aset.status === 'Tersedia' ? 'bg-green-500 text-white' : aset.status === 'Dipinjam' ? 'bg-yellow-500 text-white' : aset.status === 'Maintenance' ? 'bg-purple-500 text-white' : 'bg-red-500 text-white'}`}>
                Status: {aset.status}
              </span>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Kategori</p>
                <p className="text-lg font-semibold text-gray-800">{aset.kategori?.nama_kategori || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Lokasi Terkini</p>
                <p className="text-lg font-semibold text-gray-800">{aset.lokasi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tanggal Pengadaan</p>
                <p className="text-lg font-semibold text-gray-800">{aset.tanggal_pengadaan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Kondisi Fisik Terakhir</p>
                <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${aset.kondisi === 'Baik' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {aset.kondisi}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Harga</p>
                <p className="text-lg font-semibold text-gray-800">{aset.harga ? `Rp ${parseInt(aset.harga).toLocaleString()}` : '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Catatan / Deskripsi</p>
                <p className="text-base text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[60px]">{aset.catatan || 'Tidak ada catatan'}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-gray-100 pl-8">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">QR Code</p>
              {aset.qr_code ? (
                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                  <img src={aset.qr_code} alt={`QR Code`} className="w-32 h-32 object-contain" />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">Tidak ada</div>
              )}
            </div>
          </div>
        </div>

        {/* History Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50/50 px-4 pt-4 gap-2">
            <button onClick={() => setActiveTab('peminjaman')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'peminjaman' ? 'bg-white text-green-600 border-t-2 border-x border-green-600 border-b-0' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
              <History size={18} /> Peminjaman ({aset.peminjaman?.length || 0})
            </button>
            <button onClick={() => setActiveTab('maintenance')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'maintenance' ? 'bg-white text-green-600 border-t-2 border-x border-green-600 border-b-0' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
              <Wrench size={18} /> Maintenance ({aset.maintenance?.length || 0})
            </button>
            <button onClick={() => setActiveTab('laporan')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'laporan' ? 'bg-white text-green-600 border-t-2 border-x border-green-600 border-b-0' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
              <FileText size={18} /> Laporan ({aset.laporan_kerusakan?.length || 0})
            </button>
            <button onClick={() => setActiveTab('mutasi')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'mutasi' ? 'bg-white text-green-600 border-t-2 border-x border-green-600 border-b-0' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
              <ArrowRightLeft size={18} /> Mutasi ({aset.mutasi?.length || 0})
            </button>
            <button onClick={() => setActiveTab('opname')} className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'opname' ? 'bg-white text-green-600 border-t-2 border-x border-green-600 border-b-0' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
              <ClipboardCheck size={18} /> Stock Opname ({aset.stock_opname?.length || 0})
            </button>
          </div>

          <div className="p-0">
            {activeTab === 'peminjaman' && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 font-semibold text-gray-600">Tanggal Pinjam</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Peminjam</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Tanggal Kembali</th>
                  </tr>
                </thead>
                <tbody>
                  {aset.peminjaman?.length === 0 && <tr><td colSpan="4" className="py-6 text-center text-gray-500">Belum ada riwayat peminjaman</td></tr>}
                  {aset.peminjaman?.map((p, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-6">{p.tanggal_pinjam}</td>
                      <td className="py-3 px-6 font-medium">{p.peminjam?.nama}</td>
                      <td className="py-3 px-6"><span className={`px-2 py-1 rounded text-xs ${p.status === 'Dipinjam' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{p.status}</span></td>
                      <td className="py-3 px-6">{p.tanggal_kembali || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'maintenance' && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 font-semibold text-gray-600">Tgl Mulai</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Tgl Selesai</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Deskripsi</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Tindakan/Hasil</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aset.maintenance?.length === 0 && <tr><td colSpan="5" className="py-6 text-center text-gray-500">Belum ada riwayat maintenance</td></tr>}
                  {aset.maintenance?.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-6">{m.tanggal_maintenance}</td>
                      <td className="py-3 px-6">{m.tanggal_selesai || '-'}</td>
                      <td className="py-3 px-6">{m.deskripsi}</td>
                      <td className="py-3 px-6 text-gray-600 text-xs">
                        {m.tindakan_perbaikan && <div><strong>Tindakan:</strong> {m.tindakan_perbaikan}</div>}
                        {m.catatan_hasil && <div><strong>Hasil:</strong> {m.catatan_hasil}</div>}
                        {m.biaya && <div><strong>Biaya:</strong> Rp {m.biaya.toLocaleString()}</div>}
                      </td>
                      <td className="py-3 px-6"><span className={`px-2 py-1 rounded text-xs ${m.status === 'Proses' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'laporan' && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 font-semibold text-gray-600">Tanggal</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Pelapor</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Deskripsi</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Prioritas</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aset.laporan_kerusakan?.length === 0 && <tr><td colSpan="5" className="py-6 text-center text-gray-500">Belum ada riwayat laporan</td></tr>}
                  {aset.laporan_kerusakan?.map((l, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-6">{l.tanggal_laporan}</td>
                      <td className="py-3 px-6 font-medium">{l.pelapor?.nama}</td>
                      <td className="py-3 px-6">
                        <div className="mb-1">{l.deskripsi_kerusakan}</div>
                        {l.lampiran && (
                          <a href={`http://localhost:5000${l.lampiran}`} target="_blank" rel="noreferrer" className="text-blue-500 text-xs hover:underline flex items-center gap-1 mt-1">
                            Lihat Lampiran
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <span className={`font-semibold ${l.prioritas === 'Tinggi' ? 'text-red-600' : l.prioritas === 'Sedang' ? 'text-orange-500' : 'text-green-600'}`}>{l.prioritas}</span>
                      </td>
                      <td className="py-3 px-6">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">{l.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'mutasi' && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 font-semibold text-gray-600">Tanggal Mutasi</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Dari Lokasi</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Ke Lokasi</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {aset.mutasi?.length === 0 && <tr><td colSpan="4" className="py-6 text-center text-gray-500">Belum ada riwayat mutasi</td></tr>}
                  {aset.mutasi?.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-6">{m.tanggal_mutasi}</td>
                      <td className="py-3 px-6 text-red-600">{m.lokasi_lama}</td>
                      <td className="py-3 px-6 text-green-600 font-medium">{m.lokasi_baru}</td>
                      <td className="py-3 px-6">{m.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'opname' && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 font-semibold text-gray-600">Tanggal Cek</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Pemeriksa</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Kondisi Fisik</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {aset.stock_opname?.length === 0 && <tr><td colSpan="4" className="py-6 text-center text-gray-500">Belum pernah di-opname</td></tr>}
                  {aset.stock_opname?.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-6">{s.tanggal_opname}</td>
                      <td className="py-3 px-6 font-medium">{s.pemeriksa?.nama}</td>
                      <td className="py-3 px-6"><span className={`px-2 py-1 rounded text-xs ${s.kondisi_fisik === 'Sesuai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.kondisi_fisik}</span></td>
                      <td className="py-3 px-6">{s.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* --- PRINT UI (HANYA QR CODE) --- */}
      <div className="hidden print:flex w-full h-full items-center justify-center m-0 p-0 overflow-hidden">
        {aset.qr_code ? (
          <img src={aset.qr_code} alt="QR Code" style={{ width: '75mm', height: '75mm', objectFit: 'contain' }} />
        ) : (
          <div style={{ width: '75mm', height: '75mm' }} className="flex items-center justify-center text-gray-400">Belum Ada QR</div>
        )}
      </div>

      <style>{`
        @media print {
          html, body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100mm;
            height: 100mm;
            overflow: hidden !important;
          }
          @page {
            margin: 0;
            size: 100mm 100mm;
          }
          header, aside {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailAset;
