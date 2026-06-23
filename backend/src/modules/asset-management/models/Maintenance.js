const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  laporan_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  aset_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_maintenance: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tanggal_selesai: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tindakan_perbaikan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  biaya: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  catatan_hasil: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Proses', 'Selesai'),
    allowNull: false,
    defaultValue: 'Proses'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: 'maintenance',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Maintenance;
