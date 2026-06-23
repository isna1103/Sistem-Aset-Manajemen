import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Box, Wrench, ArrowUpFromLine, Trash2, Activity, CircleDollarSign } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalAset: 0,
    asetDipinjam: 0,
    asetMaintenance: 0,
    asetDihapus: 0,
    totalHargaAset: 0,
    recentActivity: []
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  const doughnutData = {
    labels: ['Tersedia', 'Dipinjam', 'Maintenance', 'Dihapus'],
    datasets: [
      {
        data: [
          stats.totalAset - stats.asetDipinjam - stats.asetMaintenance - stats.asetDihapus,
          stats.asetDipinjam,
          stats.asetMaintenance,
          stats.asetDihapus
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(234, 179, 8, 0.8)', // yellow
          'rgba(249, 115, 22, 0.8)', // orange
          'rgba(239, 68, 68, 0.8)', // red
        ],
        borderWidth: 1,
      },
    ],
  };

  const cards = [
    { title: 'Total Seluruh Aset', value: stats.totalAset, icon: <Box size={24} className="text-blue-600" />, bg: 'bg-blue-50' },
    { title: 'Total Harga Aset', value: `Rp ${stats.totalHargaAset?.toLocaleString('id-ID') || 0}`, icon: <CircleDollarSign size={20} className="text-green-600" />, bg: 'bg-green-50' },
    { title: 'Aset Dipinjam', value: stats.asetDipinjam, icon: <ArrowUpFromLine size={24} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { title: 'Aset Maintenance', value: stats.asetMaintenance, icon: <Wrench size={24} className="text-orange-600" />, bg: 'bg-orange-50' },
    { title: 'Aset Dihapus', value: stats.asetDihapus, icon: <Trash2 size={24} className="text-red-600" />, bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Selamat datang, <span className="text-green-600">{user?.nama}</span>!
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-lg ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Status Aset</h3>
          <div className="flex justify-center h-64">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
            <Activity size={20} className="text-green-600" />
            Aktivitas Peminjaman Terbaru
          </h3>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((act, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-50 bg-gray-50/50">
                  <div className={`w-2 h-2 rounded-full ${act.status === 'Dipinjam' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{act.aset?.nama_aset}</p>
                    <p className="text-sm text-gray-500">Tanggal Pinjam: {act.tanggal_pinjam}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${act.status === 'Dipinjam' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {act.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Belum ada aktivitas terbaru</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
