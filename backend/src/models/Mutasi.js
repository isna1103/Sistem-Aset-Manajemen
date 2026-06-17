const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mutasi = sequelize.define('Mutasi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  aset_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lokasi_lama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lokasi_baru: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_mutasi: {
    type: DataTypes.DATEONLY,
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
  tableName: 'mutasi',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Mutasi;
