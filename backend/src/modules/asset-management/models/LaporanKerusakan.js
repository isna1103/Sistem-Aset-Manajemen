const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const LaporanKerusakan = sequelize.define('LaporanKerusakan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  aset_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_laporan: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  deskripsi_kerusakan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  prioritas: {
    type: DataTypes.ENUM('Rendah', 'Sedang', 'Tinggi'),
    allowNull: false,
    defaultValue: 'Sedang'
  },
  lampiran: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Menunggu Review', 'Disetujui', 'Ditolak', 'Diproses', 'Selesai'),
    allowNull: false,
    defaultValue: 'Menunggu Review'
  },
  catatan_admin: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  teknisi_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pihak_ketiga: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'laporan_kerusakan',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = LaporanKerusakan;
