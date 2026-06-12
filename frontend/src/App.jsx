import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import Kategori from './pages/Kategori';
import Barang from './pages/Barang';
import BarangMasuk from './pages/BarangMasuk';
import BarangKeluar from './pages/BarangKeluar';
import Laporan from './pages/Laporan';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="kategori" element={<Kategori />} />
            <Route path="barang" element={<Barang />} />
            <Route path="barang-masuk" element={<BarangMasuk />} />
            <Route path="barang-keluar" element={<BarangKeluar />} />
            <Route path="laporan" element={<Laporan />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
