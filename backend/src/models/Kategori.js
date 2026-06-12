const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kategori = sequelize.define('Kategori', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_kategori: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'kategori',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Kategori;
