const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Peminjaman = sequelize.define('Peminjaman', {
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
  nama_peminjam: {
    type: DataTypes.STRING,
    allowNull: true
  },
  divisi: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tanggal_pinjam: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  jadwal_kembali: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  tanggal_kembali: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  kondisi_kembali: {
    type: DataTypes.ENUM('Baik', 'Kurang Baik', 'Rusak', 'Hilang'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Dipinjam', 'Dikembalikan'),
    allowNull: false,
    defaultValue: 'Dipinjam'
  },
  lampiran: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lampiran_kembali: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'peminjaman',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Peminjaman;
