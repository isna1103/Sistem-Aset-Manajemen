import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Box, QrCode, ClipboardList, ArrowRightLeft, ArrowUpFromLine, 
  Wrench, Trash2, FileText, Shield, Users, Tags, MapPin, Briefcase, ChevronLeft,
  Award, TrendingUp, UserCheck, Star, Activity, FileCheck
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, hasPermission } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Tentukan modul aktif berdasarkan path URL
  let activeModule = 'main';
  
  if (path.startsWith('/talent')) {
    activeModule = 'talent';
  } else if (path.startsWith('/user-management')) {
    activeModule = 'user';
  } else if (path.startsWith('/role-permission')) {
    activeModule = 'role';
  } else if (path !== '/') {
    // Asumsikan rute selain /, /talent, /user-management, /role-permission adalah rute Aset
    activeModule = 'asset';
  }

  // Definisi Menu
  const mainMenus = [
    { title: 'Asset Management', menu: ['Dashboard', 'Master Data Aset', 'Mutasi Aset', 'Peminjaman Aset', 'Pengembalian Aset', 'Maintenance Aset', 'Stock Opname', 'QR Code Tracking', 'Penghapusan Aset', 'Laporan'], icon: <Box size={20} />, path: '/dashboard' },
    { title: 'Talent Management', menu: ['Data Karyawan', 'Divisi', 'Jabatan', 'Kompetensi', 'Training & Sertifikasi', 'Performance Review', 'Talent Pool', 'Career Path', 'Succession Planning'], icon: <Briefcase size={20} />, path: '/talent' },
    { title: 'Manajemen User', menu: 'Manajemen User', icon: <Users size={20} />, path: '/user-management' },
    { title: 'Role & Permission', menu: 'Manajemen Role & Permission', icon: <Shield size={20} />, path: '/role-permission' }
  ];

  const assetMenus = [
    { title: 'Dashboard', menu: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { title: 'Kategori Barang', menu: 'Kategori', icon: <Tags size={20} />, path: '/kategori' },
    { title: 'Lokasi Aset', menu: 'Master Data Aset', icon: <MapPin size={20} />, path: '/lokasi' },
    { title: 'Master Data Aset', menu: 'Master Data Aset', icon: <Box size={20} />, path: '/aset' },
    { title: 'Scan QR Code', menu: 'QR Code Tracking', icon: <QrCode size={20} />, path: '/scan-qr' },
    { title: 'Mutasi Aset', menu: 'Mutasi Aset', icon: <ArrowRightLeft size={20} />, path: '/mutasi' },
    { title: 'Peminjaman Aset', menu: 'Peminjaman Aset', icon: <ArrowUpFromLine size={20} />, path: '/peminjaman' },
    { title: 'Maintenance Aset', menu: ['Laporan Kerusakan', 'Maintenance Aset'], icon: <Wrench size={20} />, path: '/maintenance' },
    { title: 'Stock Opname', menu: 'Stock Opname', icon: <ClipboardList size={20} />, path: '/stock-opname' },
    { title: 'Penghapusan Aset', menu: 'Penghapusan Aset', icon: <Trash2 size={20} />, path: '/penghapusan' },
    { title: 'Laporan', menu: 'Laporan', icon: <FileText size={20} />, path: '/laporan' }
  ];

  const talentMenus = [
    { title: 'Dashboard', menu: ['Data Karyawan', 'Divisi', 'Jabatan', 'Kompetensi', 'Training & Sertifikasi', 'Performance Review', 'Talent Pool', 'Career Path', 'Succession Planning'], icon: <LayoutDashboard size={20} />, path: '/talent' },
    { title: 'Data Karyawan', menu: 'Data Karyawan', icon: <Users size={20} />, path: '/talent#data-karyawan' },
    { title: 'Divisi', menu: 'Divisi', icon: <Box size={20} />, path: '/talent#divisi' },
    { title: 'Jabatan', menu: 'Jabatan', icon: <Award size={20} />, path: '/talent#jabatan' },
    { title: 'Kompetensi', menu: 'Kompetensi', icon: <Star size={20} />, path: '/talent#kompetensi' },
    { title: 'Training & Sertifikasi', menu: 'Training & Sertifikasi', icon: <FileCheck size={20} />, path: '/talent#training' },
    { title: 'Performance Review', menu: 'Performance Review', icon: <Activity size={20} />, path: '/talent#performance' },
    { title: 'Talent Pool', menu: 'Talent Pool', icon: <Users size={20} />, path: '/talent#talent-pool' },
    { title: 'Career Path', menu: 'Career Path', icon: <TrendingUp size={20} />, path: '/talent#career-path' },
    { title: 'Succession Planning', menu: 'Succession Planning', icon: <UserCheck size={20} />, path: '/talent#succession' }
  ];

  const userMenus = [
    { title: 'Manajemen User', menu: 'Manajemen User', icon: <Users size={20} />, path: '/user-management' }
  ];

  const roleMenus = [
    { title: 'Role & Permission', menu: 'Manajemen Role & Permission', icon: <Shield size={20} />, path: '/role-permission' }
  ];

  // Pilih menu yang akan dirender berdasarkan state aktif
  let currentMenus = mainMenus;
  let moduleTitle = 'Dashboard Utama';

  if (activeModule === 'asset') {
    currentMenus = assetMenus;
    moduleTitle = 'Asset Management';
  } else if (activeModule === 'talent') {
    currentMenus = talentMenus;
    moduleTitle = 'Talent Management';
  } else if (activeModule === 'user') {
    currentMenus = userMenus;
    moduleTitle = 'Manajemen User';
  } else if (activeModule === 'role') {
    currentMenus = roleMenus;
    moduleTitle = 'Role & Permission';
  }

  // Helper untuk mengecek permission
  const checkMenuPermission = (item) => {
    if (!item.menu) return true; // Bebas akses jika tidak ada rule permission
    if (Array.isArray(item.menu)) {
      return item.menu.some(m => hasPermission(m, 'Read/View'));
    }
    return hasPermission(item.menu, 'Read/View');
  };

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-gradient-to-b from-green-600 to-green-800 text-white shadow-xl flex flex-col print:hidden">
      <div className="p-6 text-center font-bold text-xl border-b border-green-500/50">
        {moduleTitle}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {/* Tombol Kembali jika bukan di main dashboard */}
          {activeModule !== 'main' && (
            <li className="mb-4">
              <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-green-900/50 hover:bg-green-900 transition-colors duration-200 text-sm font-semibold border border-green-500/30"
              >
                <ChevronLeft size={18} />
                <span>Kembali ke Dashboard Utama</span>
              </button>
            </li>
          )}

          {/* Render Menu Item */}
          {currentMenus.filter(checkMenuPermission).map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => {
                  // Khusus untuk anchor links, NavLink tidak otomatis resolve #hash dengan isActive
                  const hasHash = item.path.includes('#');
                  const isHashActive = location.hash === '#' + item.path.split('#')[1];
                  const active = hasHash ? isHashActive : isActive;

                  // Khusus untuk /talent yang tidak memiliki hash, hindari aktif jika ada hash
                  if (item.path === '/talent' && location.hash) {
                     return 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-green-100 hover:bg-white/10 hover:text-white';
                  }

                  return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${active ? 'bg-white/20 text-white font-semibold' : 'text-green-100 hover:bg-white/10 hover:text-white'}`
                }}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
