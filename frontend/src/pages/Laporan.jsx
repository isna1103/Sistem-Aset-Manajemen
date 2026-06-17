import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Printer, Box, CheckCircle, User as UserIcon, Wrench, AlertTriangle, ArrowRightLeft, ClipboardList } from 'lucide-react';

const Laporan = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('aset');

  const [dataAset, setDataAset] = useState([]);
  const [dataMutasi, setDataMutasi] = useState([]);
  const [dataPeminjaman, setDataPeminjaman] = useState([]);
  const [dataMaintenance, setDataMaintenance] = useState([]);
  const [dataStockOpname, setDataStockOpname] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [asetRes, mutasiRes, pemRes, maintRes, opnameRes] = await Promise.all([
        api.get('/laporan/aset'),
        api.get('/laporan/mutasi'),
        api.get('/laporan/peminjaman'),
        api.get('/laporan/maintenance'),
        api.get('/laporan/stock-opname')
      ]);
      setDataAset(asetRes.data);
      setDataMutasi(mutasiRes.data);
      setDataPeminjaman(pemRes.data);
      setDataMaintenance(maintRes.data);
      setDataStockOpname(opnameRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getFormatDate = () => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date().toLocaleDateString('id-ID', options);
  };

  // Komponen Ringkasan Dinamis
  const getCards = () => {
    if (activeTab === 'aset') {
      return [
        { label: 'Total Aset', value: dataAset.length, icon: <Box size={28} />, color: 'bg-green-600' },
        { label: 'Aset Tersedia', value: dataAset.filter(a => a.status === 'Tersedia').length, icon: <CheckCircle size={28} />, color: 'bg-green-500' },
        { label: 'Aset Dipinjam', value: dataAset.filter(a => a.status === 'Dipinjam').length, icon: <UserIcon size={28} />, color: 'bg-orange-500' },
        { label: 'Maintenance', value: dataAset.filter(a => a.status === 'Maintenance').length, icon: <Wrench size={28} />, color: 'bg-purple-600' },
        { label: 'Aset Rusak', value: dataAset.filter(a => a.kondisi === 'Rusak').length, icon: <AlertTriangle size={28} />, color: 'bg-red-500' },
      ];
    } else if (activeTab === 'mutasi') {
      return [
        { label: 'Total Mutasi', value: dataMutasi.length, icon: <ArrowRightLeft size={28} />, color: 'bg-blue-600' },
        { label: 'Aset Dimutasi', value: new Set(dataMutasi.map(m => m.aset_id)).size, icon: <Box size={28} />, color: 'bg-green-500' },
      ];
    } else if (activeTab === 'peminjaman') {
      return [
        { label: 'Total Transaksi', value: dataPeminjaman.length, icon: <ClipboardList size={28} />, color: 'bg-blue-600' },
        { label: 'Sedang Dipinjam', value: dataPeminjaman.filter(p => p.status === 'Dipinjam').length, icon: <UserIcon size={28} />, color: 'bg-orange-500' },
        { label: 'Selesai Dikembalikan', value: dataPeminjaman.filter(p => p.status === 'Dikembalikan').length, icon: <CheckCircle size={28} />, color: 'bg-green-500' },
      ];
    } else if (activeTab === 'maintenance') {
      return [
        { label: 'Total Maintenance', value: dataMaintenance.length, icon: <Wrench size={28} />, color: 'bg-blue-600' },
        { label: 'Sedang Proses', value: dataMaintenance.filter(m => m.status === 'Proses').length, icon: <Wrench size={28} />, color: 'bg-orange-500' },
        { label: 'Selesai', value: dataMaintenance.filter(m => m.status === 'Selesai').length, icon: <CheckCircle size={28} />, color: 'bg-green-500' },
      ];
    } else if (activeTab === 'stock_opname') {
      return [
        { label: 'Total Pengecekan', value: dataStockOpname.length, icon: <ClipboardList size={28} />, color: 'bg-blue-600' },
        { label: 'Sesuai', value: dataStockOpname.filter(s => s.kondisi_fisik === 'Sesuai').length, icon: <CheckCircle size={28} />, color: 'bg-green-500' },
        { label: 'Tidak Sesuai', value: dataStockOpname.filter(s => s.kondisi_fisik === 'Tidak Sesuai').length, icon: <AlertTriangle size={28} />, color: 'bg-orange-500' },
        { label: 'Rusak/Hilang', value: dataStockOpname.filter(s => ['Rusak', 'Hilang'].includes(s.kondisi_fisik)).length, icon: <AlertTriangle size={28} />, color: 'bg-red-500' },
      ];
    }
    return [];
  };

  const getTitle = () => {
    const titles = {
      aset: 'LAPORAN PENGADAAN ASET',
      mutasi: 'LAPORAN MUTASI ASET',
      peminjaman: 'LAPORAN PEMINJAMAN ASET',
      maintenance: 'LAPORAN MAINTENANCE ASET',
      stock_opname: 'LAPORAN STOCK OPNAME'
    };
    return titles[activeTab] || 'LAPORAN DATA ASET';
  };

  // --- Tabel Konten ---
  const renderTableBody = () => {
    if (activeTab === 'aset') {
      if (dataAset.length === 0) return <tr><td colSpan="7" className="py-4 text-center text-gray-500">Tidak ada data</td></tr>;
      return dataAset.map((item, index) => (
        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
          <td className="py-3 px-4 text-center text-gray-600">{index + 1}</td>
          <td className="py-3 px-4 font-medium text-gray-800">{item.kode_aset}</td>
          <td className="py-3 px-4">{item.nama_aset}</td>
          <td className="py-3 px-4">{item.kategori?.nama_kategori || '-'}</td>
          <td className="py-3 px-4">{item.lokasi}</td>
          <td className="py-3 px-4 text-center">{item.kondisi}</td>
          <td className="py-3 px-4 text-center">{item.status}</td>
        </tr>
      ));
    }
    if (activeTab === 'mutasi') {
      if (dataMutasi.length === 0) return <tr><td colSpan="7" className="py-4 text-center text-gray-500">Tidak ada data</td></tr>;
      return dataMutasi.map((item, index) => (
        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
          <td className="py-3 px-4 text-center text-gray-600">{index + 1}</td>
          <td className="py-3 px-4">{item.aset?.nama_aset} <br /><span className="text-xs text-gray-500">{item.aset?.kode_aset}</span></td>
          <td className="py-3 px-4 text-red-600">{item.lokasi_lama}</td>
          <td className="py-3 px-4 text-green-600 font-medium">{item.lokasi_baru}</td>
          <td className="py-3 px-4 text-center">{item.tanggal_mutasi}</td>
          <td className="py-3 px-4">{item.keterangan || '-'}</td>
          <td className="py-3 px-4">{item.user?.nama}</td>
        </tr>
      ));
    }
    if (activeTab === 'peminjaman') {
      if (dataPeminjaman.length === 0) return <tr><td colSpan="7" className="py-4 text-center text-gray-500">Tidak ada data</td></tr>;
      return dataPeminjaman.map((item, index) => (
        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
          <td className="py-3 px-4 text-center text-gray-600">{index + 1}</td>
          <td className="py-3 px-4">{item.aset?.nama_aset}</td>
          <td className="py-3 px-4">{item.peminjam?.nama}</td>
          <td className="py-3 px-4 text-center">{item.tanggal_pinjam}</td>
          <td className="py-3 px-4 text-center">{item.tanggal_kembali || '-'}</td>
          <td className="py-3 px-4 text-center font-medium">{item.status}</td>
          <td className="py-3 px-4 text-center">{item.kondisi_kembali || '-'}</td>
        </tr>
      ));
    }
    if (activeTab === 'maintenance') {
      if (dataMaintenance.length === 0) return <tr><td colSpan="6" className="py-4 text-center text-gray-500">Tidak ada data</td></tr>;
      return dataMaintenance.map((item, index) => (
        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
          <td className="py-3 px-4 text-center text-gray-600">{index + 1}</td>
          <td className="py-3 px-4">{item.aset?.nama_aset}</td>
          <td className="py-3 px-4 text-center">{item.tanggal_maintenance}</td>
          <td className="py-3 px-4">{item.deskripsi}</td>
          <td className="py-3 px-4 text-center">{item.status}</td>
          <td className="py-3 px-4">{item.teknisi?.nama}</td>
        </tr>
      ));
    }
    if (activeTab === 'stock_opname') {
      if (dataStockOpname.length === 0) return <tr><td colSpan="6" className="py-4 text-center text-gray-500">Tidak ada data</td></tr>;
      return dataStockOpname.map((item, index) => (
        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
          <td className="py-3 px-4 text-center text-gray-600">{index + 1}</td>
          <td className="py-3 px-4">{item.aset?.nama_aset}</td>
          <td className="py-3 px-4 text-center">{item.tanggal_opname}</td>
          <td className="py-3 px-4 text-center font-medium">{item.kondisi_fisik}</td>
          <td className="py-3 px-4">{item.keterangan || '-'}</td>
          <td className="py-3 px-4">{item.pemeriksa?.nama}</td>
        </tr>
      ));
    }
  };

  const renderTableHead = () => {
    if (activeTab === 'aset') return (
      <>
        <th className="py-3 px-4">Kode Aset</th><th className="py-3 px-4">Nama Aset</th><th className="py-3 px-4">Kategori</th><th className="py-3 px-4">Lokasi</th><th className="py-3 px-4 text-center">Kondisi</th><th className="py-3 px-4 text-center">Status</th>
      </>
    );
    if (activeTab === 'mutasi') return (
      <>
        <th className="py-3 px-4">Aset</th><th className="py-3 px-4">Lokasi Lama</th><th className="py-3 px-4">Lokasi Baru</th><th className="py-3 px-4 text-center">Tanggal</th><th className="py-3 px-4">Keterangan</th><th className="py-3 px-4">Diproses Oleh</th>
      </>
    );
    if (activeTab === 'peminjaman') return (
      <>
        <th className="py-3 px-4">Aset</th><th className="py-3 px-4">Peminjam</th><th className="py-3 px-4 text-center">Tgl Pinjam</th><th className="py-3 px-4 text-center">Tgl Kembali</th><th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-center">Kondisi</th>
      </>
    );
    if (activeTab === 'maintenance') return (
      <>
        <th className="py-3 px-4">Aset</th><th className="py-3 px-4 text-center">Tanggal</th><th className="py-3 px-4">Tindakan / Deskripsi</th><th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4">Teknisi</th>
      </>
    );
    if (activeTab === 'stock_opname') return (
      <>
        <th className="py-3 px-4">Aset</th><th className="py-3 px-4 text-center">Tanggal</th><th className="py-3 px-4 text-center">Kondisi Fisik</th><th className="py-3 px-4">Keterangan</th><th className="py-3 px-4">Pemeriksa</th>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* --- UI LAYER (SCREEN ONLY) --- */}
      <div className="print:hidden space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Laporan</h1>
          <button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
            <Printer size={20} /> Cetak Laporan PDF
          </button>
        </div>

        {/* Tabs Menu */}
        <div className="flex flex-wrap border-b border-gray-200 gap-2">
          {[
            { id: 'aset', label: 'Pengadaan Aset' },
            { id: 'mutasi', label: 'Mutasi Aset' },
            { id: 'peminjaman', label: 'Peminjaman Aset' },
            { id: 'maintenance', label: 'Maintenance Aset' },
            { id: 'stock_opname', label: 'Stock Opname' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === tab.id ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm">Memuat data laporan...</div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{getTitle()}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-100 text-sm">
                      <th className="py-3 px-4 text-center w-12">No</th>
                      {renderTableHead()}
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableBody()}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- PRINT LAYER (PRINT ONLY) --- */}
      <div className="hidden print:block bg-white font-sans text-gray-800 w-full">
        {!loading && (
          <div className="print-container">
            {/* Header Cetak */}
            <div className="flex justify-between items-center border-b-[3px] border-blue-900 pb-6 mb-6">
              <div className="flex items-center gap-6">
                <img src="/logo_pcs.png" alt="Logo" className="w-24 object-contain" />
                <div>
                  <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight mb-1">PT. PANDU CIPTA SOLUSI</h1>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                    Jl. Masjid Darul Ulum RT 01 RW 01 No 39 Lantai 2 Kadu – Curug – Kab. Tangerang - Banten – 15810<br />
                    Telp : (021) 5982626 | www.panducipta.com
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-blue-900 tracking-wide mb-1">SISTEM ASET MANAJEMEN</h2>
                <h3 className="text-lg font-bold text-blue-900/80 uppercase tracking-widest">{getTitle()}</h3>
              </div>
            </div>

            {/* Metadata Cetak */}
            <div className="mb-8 w-full max-w-md">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold text-gray-700 w-32">Tanggal Cetak</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1">{getFormatDate()}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold text-gray-700">Periode</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1">Semua Waktu</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold text-gray-700">Dicetak Oleh</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1 font-medium">{user?.nama || 'Admin'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Ringkasan Cetak */}
            <div className="mb-8">
              <div className="bg-blue-900 text-white font-bold px-4 py-2 inline-block rounded-t-md text-sm tracking-widest mb-0 border border-blue-900">
                RINGKASAN
              </div>
              <div className="border border-gray-200 rounded-b-lg rounded-tr-lg p-5">
                <div className="flex gap-4 w-full">
                  {getCards().map((card, idx) => (
                    <div key={idx} className="flex-1 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center bg-white shadow-sm">
                      <div className={`w-14 h-14 rounded-full ${card.color} flex items-center justify-center text-white mb-2 shadow-sm print-color-exact`}>
                        {card.icon}
                      </div>
                      <div className="text-2xl font-black text-gray-800">{card.value}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">{card.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Table Cetak */}
            <div>
              <div className="bg-blue-900 text-white font-bold px-4 py-2 rounded-t-md text-sm tracking-widest uppercase border border-blue-900 inline-block">
                DATA {getTitle().replace('LAPORAN ', '')}
              </div>
              <table className="w-full text-left border-collapse border border-gray-200 mt-0">
                <thead>
                  <tr className="bg-blue-50/50 text-gray-800 text-sm">
                    <th className="py-3 px-4 border border-gray-200 text-center w-12 bg-blue-50/50">No</th>
                    {/* Reusing Table Head but modifying classes to include borders for print */}
                    {activeTab === 'aset' && (
                      <><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Kode Aset</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Nama Aset</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Kategori</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Lokasi</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Kondisi</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Status</th></>
                    )}
                    {activeTab === 'mutasi' && (
                      <><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Aset</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Lokasi Lama</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Lokasi Baru</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Tanggal</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Keterangan</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Diproses Oleh</th></>
                    )}
                    {activeTab === 'peminjaman' && (
                      <><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Aset</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Peminjam</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Tgl Pinjam</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Tgl Kembali</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Status</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Kondisi</th></>
                    )}
                    {activeTab === 'maintenance' && (
                      <><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Aset</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Tanggal</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Tindakan / Deskripsi</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Status</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Teknisi</th></>
                    )}
                    {activeTab === 'stock_opname' && (
                      <><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Aset</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Tanggal</th><th className="py-3 px-4 border border-gray-200 text-center bg-blue-50/50">Kondisi Fisik</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Keterangan</th><th className="py-3 px-4 border border-gray-200 bg-blue-50/50">Pemeriksa</th></>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Reuse Body but add print border classes */}
                  {activeTab === 'aset' && dataAset.length === 0 && <tr><td colSpan="7" className="py-4 text-center text-gray-500 border border-gray-200">Tidak ada data</td></tr>}
                  {activeTab === 'aset' && dataAset.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 text-sm">
                      <td className="py-3 px-4 text-center border border-gray-200">{index + 1}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.kode_aset}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.nama_aset}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.kategori?.nama_kategori || '-'}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.lokasi}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.kondisi}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.status}</td>
                    </tr>
                  ))}

                  {activeTab === 'mutasi' && dataMutasi.length === 0 && <tr><td colSpan="7" className="py-4 text-center text-gray-500 border border-gray-200">Tidak ada data</td></tr>}
                  {activeTab === 'mutasi' && dataMutasi.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 text-sm">
                      <td className="py-3 px-4 text-center border border-gray-200">{index + 1}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.aset?.nama_aset} <br /><span className="text-xs text-gray-500">{item.aset?.kode_aset}</span></td>
                      <td className="py-3 px-4 border border-gray-200">{item.lokasi_lama}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.lokasi_baru}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.tanggal_mutasi}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.keterangan || '-'}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.user?.nama}</td>
                    </tr>
                  ))}

                  {activeTab === 'peminjaman' && dataPeminjaman.length === 0 && <tr><td colSpan="7" className="py-4 text-center text-gray-500 border border-gray-200">Tidak ada data</td></tr>}
                  {activeTab === 'peminjaman' && dataPeminjaman.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 text-sm">
                      <td className="py-3 px-4 text-center border border-gray-200">{index + 1}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.aset?.nama_aset}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.peminjam?.nama}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.tanggal_pinjam}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.tanggal_kembali || '-'}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.status}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.kondisi_kembali || '-'}</td>
                    </tr>
                  ))}

                  {activeTab === 'maintenance' && dataMaintenance.length === 0 && <tr><td colSpan="6" className="py-4 text-center text-gray-500 border border-gray-200">Tidak ada data</td></tr>}
                  {activeTab === 'maintenance' && dataMaintenance.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 text-sm">
                      <td className="py-3 px-4 text-center border border-gray-200">{index + 1}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.aset?.nama_aset}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.tanggal_maintenance}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.deskripsi}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.status}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.teknisi?.nama}</td>
                    </tr>
                  ))}

                  {activeTab === 'stock_opname' && dataStockOpname.length === 0 && <tr><td colSpan="6" className="py-4 text-center text-gray-500 border border-gray-200">Tidak ada data</td></tr>}
                  {activeTab === 'stock_opname' && dataStockOpname.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 text-sm">
                      <td className="py-3 px-4 text-center border border-gray-200">{index + 1}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.aset?.nama_aset}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.tanggal_opname}</td>
                      <td className="py-3 px-4 text-center border border-gray-200">{item.kondisi_fisik}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.keterangan || '-'}</td>
                      <td className="py-3 px-4 border border-gray-200">{item.pemeriksa?.nama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Print Footer */}
            <div className="mt-16 pt-4 border-t-2 border-blue-900 flex justify-between items-center text-xs text-gray-500 font-medium">
              <div>{getFormatDate()}</div>
              <div>Sistem Aset Manajemen</div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @media print {
          body {
            background-color: white !important;
            margin: 0;
            padding: 10mm;
          }
          @page {
            margin: 0;
          }
          .print-color-exact {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Laporan;
