const { DataTypes } = require('sequelize');
const sequelize = require('../../shared/database/db'); // Adjust if db.js is named differently

const Talent = sequelize.define('Talent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  posisi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Aktif', 'Nonaktif'),
    defaultValue: 'Aktif'
  }
}, {
  tableName: 'talent',
  timestamps: true
});

module.exports = Talent;
