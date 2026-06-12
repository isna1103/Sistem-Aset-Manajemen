import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Box, MapPin, ArrowDownToLine, ArrowUpFromLine, FileText, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['Admin', 'Staff'] },
    { title: 'Data Barang', icon: <Box size={20} />, path: '/barang', roles: ['Admin', 'Staff'] },
    { title: 'Kategori Barang', icon: <Database size={20} />, path: '/kategori', roles: ['Admin'] },
    { title: 'Barang Masuk', icon: <ArrowDownToLine size={20} />, path: '/barang-masuk', roles: ['Admin', 'Staff'] },
    { title: 'Barang Keluar', icon: <ArrowUpFromLine size={20} />, path: '/barang-keluar', roles: ['Admin', 'Staff'] },
    { title: 'Laporan', icon: <FileText size={20} />, path: '/laporan', roles: ['Admin'] },
    { title: 'Pengaturan', icon: <Settings size={20} />, path: '/settings', roles: ['Admin'] },
  ];

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-gradient-to-b from-green-600 to-green-800 text-white shadow-xl flex flex-col">
      <div className="p-6 text-center font-bold text-xl border-b border-green-500/50">
        Sistem Aset Manajemen
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {menuItems.filter(item => item.roles.includes(user?.role)).map((item, index) => (
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
