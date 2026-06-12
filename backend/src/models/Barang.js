const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Barang = sequelize.define('Barang', {
  id_barang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_barang: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jumlah_stok: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  satuan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lokasi_penyimpanan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_perolehan: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  harga_barang: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  qr_code: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'barang',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Barang;
