const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BarangMasuk = sequelize.define('BarangMasuk', {
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
  tanggal_masuk: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  supplier: {
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
  tableName: 'barang_masuk',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BarangMasuk;
