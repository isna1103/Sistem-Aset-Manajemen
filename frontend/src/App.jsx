import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import PengadaanAset from './pages/Aset/PengadaanAset';
import DetailAset from './pages/Aset/DetailAset';
import MutasiAset from './pages/MutasiAset';
import PeminjamanAset from './pages/PeminjamanAset';
import LaporanKerusakan from './pages/LaporanKerusakan';
import MaintenanceAset from './pages/MaintenanceAset';
import StockOpname from './pages/StockOpname';
import DetailOpname from './pages/DetailOpname';
import PenghapusanAset from './pages/PenghapusanAset';
import ScanQR from './pages/ScanQR';
import Laporan from './pages/Laporan';
import RoleList from './pages/RolePermission/RoleList';
import RoleForm from './pages/RolePermission/RoleForm';
import UserList from './pages/UserManagement/UserList';
import UserForm from './pages/UserManagement/UserForm';
import Kategori from './pages/Kategori';
import Lokasi from './pages/Lokasi';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
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
            <Route path="stock-opname/:id" element={<DetailOpname />} />
            <Route path="penghapusan" element={<PenghapusanAset />} />
            <Route path="laporan" element={<Laporan />} />
            
            <Route path="role-permission" element={<RoleList />} />
            <Route path="role-permission/form" element={<RoleForm />} />
            <Route path="role-permission/form/:id" element={<RoleForm />} />
            
            <Route path="user-management" element={<UserList />} />
            <Route path="user-management/form" element={<UserForm />} />
            <Route path="user-management/form/:id" element={<UserForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
