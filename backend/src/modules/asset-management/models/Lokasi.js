const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Lokasi = sequelize.define('Lokasi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_lokasi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'lokasi',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Lokasi;
