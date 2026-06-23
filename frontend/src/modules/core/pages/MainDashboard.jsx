import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Users, Shield, Briefcase } from 'lucide-react';
import { AuthContext } from '../../shared/context/AuthContext';

const MainDashboard = () => {
  const navigate = useNavigate();
  const { hasPermission } = useContext(AuthContext);

  const modules = [
    {
      id: 'asset',
      title: 'Asset Management',
      description: 'Kelola seluruh siklus hidup aset perusahaan dari pengadaan hingga penghapusan.',
      icon: <Box size={40} className="text-green-600 mb-4" />,
      path: '/dashboard',
      bgClass: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-400',
      permission: 'Dashboard' // Assuming all users with 'Dashboard' can access Asset Management
    },
    {
      id: 'talent',
      title: 'Talent Management',
      description: 'Manajemen data tim ahli, kompetensi, review performa, dan sertifikasi.',
      icon: <Briefcase size={40} className="text-blue-600 mb-4" />,
      path: '/talent',
      bgClass: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400',
      permission: ['Data Karyawan', 'Divisi', 'Jabatan', 'Kompetensi', 'Training & Sertifikasi', 'Performance Review', 'Talent Pool', 'Career Path', 'Succession Planning']
    },
    {
      id: 'user',
      title: 'Manajemen User',
      description: 'Kelola akun pengguna, reset password, dan status aktif.',
      icon: <Users size={40} className="text-purple-600 mb-4" />,
      path: '/user-management',
      bgClass: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400',
      permission: 'Manajemen User'
    },
    {
      id: 'role',
      title: 'Role & Permission',
      description: 'Kelola hak akses sistem berdasarkan grup dan jabatan.',
      icon: <Shield size={40} className="text-red-600 mb-4" />,
      path: '/role-permission',
      bgClass: 'bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-400',
      permission: 'Manajemen Role & Permission'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Selamat datang! Silakan pilih modul yang ingin Anda akses.</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          if (module.permission) {
            const hasAccess = Array.isArray(module.permission) 
              ? module.permission.some(m => hasPermission(m, 'Read/View'))
              : hasPermission(module.permission, 'Read/View');
            if (!hasAccess) return null;
          }

          return (
            <div
              key={module.id}
              onClick={() => navigate(module.path)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 shadow-sm hover:shadow-md ${module.bgClass}`}
            >
              {module.icon}
              <h2 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainDashboard;
