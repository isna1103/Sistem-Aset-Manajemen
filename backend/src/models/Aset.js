const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aset = sequelize.define('Aset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_aset: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nama_aset: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_pengadaan: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  kondisi: {
    type: DataTypes.ENUM('Baik', 'Kurang Baik', 'Rusak'),
    allowNull: false,
    defaultValue: 'Baik'
  },
  status: {
    type: DataTypes.ENUM('Tersedia', 'Dipinjam', 'Maintenance', 'Dihapus'),
    allowNull: false,
    defaultValue: 'Tersedia'
  },
  qr_code: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'aset',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Aset;
