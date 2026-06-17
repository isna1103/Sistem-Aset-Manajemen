const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Penghapusan = sequelize.define('Penghapusan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  aset_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_penghapusan: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  alasan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'penghapusan',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Penghapusan;
