const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BarangKeluar = sequelize.define('BarangKeluar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_transaksi: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_keluar: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tujuan: {
    type: DataTypes.STRING
  },
  peminjam: {
    type: DataTypes.STRING
  },
  keterangan: {
    type: DataTypes.TEXT
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'barang_keluar',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BarangKeluar;
