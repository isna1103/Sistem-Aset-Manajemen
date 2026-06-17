const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  tanggal_pinjam: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tanggal_kembali: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  kondisi_kembali: {
    type: DataTypes.ENUM('Baik', 'Kurang Baik', 'Rusak'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Dipinjam', 'Dikembalikan'),
    allowNull: false,
    defaultValue: 'Dipinjam'
  }
}, {
  tableName: 'peminjaman',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Peminjaman;
