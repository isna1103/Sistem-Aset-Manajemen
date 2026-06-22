import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Box, QrCode, ClipboardList, ArrowRightLeft, ArrowUpFromLine, Wrench, Trash2, FileText, Shield, Users, Tags, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, hasPermission } = useContext(AuthContext);

  const menuItems = [
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
    { title: 'Laporan', menu: 'Laporan', icon: <FileText size={20} />, path: '/laporan' },
    { title: 'Manajemen User', menu: 'Manajemen User', icon: <Users size={20} />, path: '/user-management' },
    { title: 'Role & Permission', menu: 'Manajemen Role & Permission', icon: <Shield size={20} />, path: '/role-permission' },
  ];

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-gradient-to-b from-green-600 to-green-800 text-white shadow-xl flex flex-col print:hidden">
      <div className="p-6 text-center font-bold text-xl border-b border-green-500/50">
        Sistem Aset Manajemen
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {menuItems.filter(item => {
            if (Array.isArray(item.menu)) {
              return item.menu.some(m => hasPermission(m, 'Read/View'));
            }
            return hasPermission(item.menu, 'Read/View');
          }).map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-white/20 text-white font-semibold' : 'text-green-100 hover:bg-white/10 hover:text-white'
                  }`
                }
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
