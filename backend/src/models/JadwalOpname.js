const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JadwalOpname = sequelize.define('JadwalOpname', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_mulai: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tanggal_selesai: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Draf', 'Berlangsung', 'Menunggu Approval', 'Selesai'),
    defaultValue: 'Draf'
  },
  penanggung_jawab_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'jadwal_opname',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = JadwalOpname;
