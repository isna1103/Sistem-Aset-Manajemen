const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockOpname = sequelize.define('StockOpname', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  aset_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_opname: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  kondisi_fisik: {
    type: DataTypes.ENUM('Sesuai', 'Tidak Sesuai', 'Hilang', 'Rusak'),
    allowNull: false
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'stock_opname',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = StockOpname;
