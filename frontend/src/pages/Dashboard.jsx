import React, { useEffect, useState } from 'react';
import { Box, Database, ArrowDownToLine, ArrowUpFromLine, Activity } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
    <div className={`p-4 rounded-full text-white ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    summary: { totalAset: 0, totalBarang: 0, totalKategori: 0, totalStok: 0, totalBarangMasuk: 0, totalBarangKeluar: 0 },
    charts: { kategoriStats: [] }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };
    fetchStats();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number || 0);
  };

  const chartData = {
    labels: stats.charts.kategoriStats.map(k => k.kategori?.nama_kategori || 'Unknown'),
    datasets: [
      {
        label: 'Jumlah Barang',
        data: stats.charts.kategoriStats.map(k => k.total),
        backgroundColor: 'rgba(22, 163, 74, 0.8)', // Green matching sidebar
        borderColor: 'rgb(22, 163, 74)',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 } // Menghindari angka desimal pada sumbu Y
      }
    },
    plugins: {
      legend: { display: false }, // Menyembunyikan legend karena hanya ada 1 dataset
      title: { display: true, text: 'Statistik Jumlah Barang Berdasarkan Kategori', font: { size: 16 } }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500">Ringkasan data inventaris aset hari ini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Nilai Aset" 
          value={formatRupiah(stats.summary.totalAset)} 
          icon={<Activity size={24} />} 
          color="bg-blue-600 shadow-blue-500/50 shadow-lg"
        />
        <DashboardCard 
          title="Total Barang" 
          value={stats.summary.totalBarang} 
          icon={<Box size={24} />} 
          color="bg-green-600 shadow-green-500/50 shadow-lg"
        />
        <DashboardCard 
          title="Total Kategori" 
          value={stats.summary.totalKategori} 
          icon={<Database size={24} />} 
          color="bg-purple-600 shadow-purple-500/50 shadow-lg"
        />
        <DashboardCard 
          title="Total Stok" 
          value={stats.summary.totalStok} 
          icon={<Box size={24} />} 
          color="bg-orange-600 shadow-orange-500/50 shadow-lg"
        />
        <DashboardCard 
          title="Barang Masuk" 
          value={stats.summary.totalBarangMasuk} 
          icon={<ArrowDownToLine size={24} />} 
          color="bg-emerald-600 shadow-emerald-500/50 shadow-lg"
        />
        <DashboardCard 
          title="Barang Keluar" 
          value={stats.summary.totalBarangKeluar} 
          icon={<ArrowUpFromLine size={24} />} 
          color="bg-rose-600 shadow-rose-500/50 shadow-lg"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <div className="h-80 flex justify-center">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
