import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts and Context
import Layout from '../modules/shared/components/Layout';

// Core Pages
import Login from '../modules/core/pages/Login';
import Dashboard from '../modules/core/pages/Dashboard';
import RoleList from '../modules/core/pages/RolePermission/RoleList';
import RoleForm from '../modules/core/pages/RolePermission/RoleForm';
import UserList from '../modules/core/pages/UserManagement/UserList';
import UserForm from '../modules/core/pages/UserManagement/UserForm';

// Asset Management Pages
import PengadaanAset from '../modules/asset-management/pages/Aset/PengadaanAset';
import DetailAset from '../modules/asset-management/pages/Aset/DetailAset';
import Kategori from '../modules/asset-management/pages/Kategori';
import Lokasi from '../modules/asset-management/pages/Lokasi';
import ScanQR from '../modules/asset-management/pages/ScanQR';
import MutasiAset from '../modules/asset-management/pages/MutasiAset';
import PeminjamanAset from '../modules/asset-management/pages/PeminjamanAset';
import LaporanKerusakan from '../modules/asset-management/pages/LaporanKerusakan';
import MaintenanceAset from '../modules/asset-management/pages/MaintenanceAset';
import StockOpname from '../modules/asset-management/pages/StockOpname';
import PenghapusanAset from '../modules/asset-management/pages/PenghapusanAset';
import Laporan from '../modules/asset-management/pages/Laporan';

// Talent Management Pages
import TalentList from '../modules/talent-management/pages/TalentList';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Core Routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="role-permission" element={<RoleList />} />
        <Route path="role-permission/form" element={<RoleForm />} />
        <Route path="role-permission/form/:id" element={<RoleForm />} />
        <Route path="user-management" element={<UserList />} />
        <Route path="user-management/form" element={<UserForm />} />
        <Route path="user-management/form/:id" element={<UserForm />} />
        
        {/* Asset Management Routes */}
        <Route path="aset" element={<PengadaanAset />} />
        <Route path="aset/detail/:kode_aset" element={<DetailAset />} />
        <Route path="kategori" element={<Kategori />} />
        <Route path="lokasi" element={<Lokasi />} />
        <Route path="scan-qr" element={<ScanQR />} />
        <Route path="mutasi" element={<MutasiAset />} />
        <Route path="peminjaman" element={<PeminjamanAset />} />
        <Route path="laporan-kerusakan" element={<LaporanKerusakan />} />
        <Route path="maintenance" element={<MaintenanceAset />} />
        <Route path="stock-opname" element={<StockOpname />} />
        <Route path="penghapusan" element={<PenghapusanAset />} />
        <Route path="laporan" element={<Laporan />} />
        
        {/* Talent Management Routes */}
        <Route path="talent" element={<TalentList />} />
        
      </Route>
    </Routes>
  );
};

export default AppRouter;
