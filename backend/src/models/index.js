const User = require('./User');
const Kategori = require('./Kategori');
const Barang = require('./Barang');
const BarangMasuk = require('./BarangMasuk');
const BarangKeluar = require('./BarangKeluar');

// Associations
Kategori.hasMany(Barang, { foreignKey: 'kategori_id', as: 'barang' });
Barang.belongsTo(Kategori, { foreignKey: 'kategori_id', as: 'kategori' });

Barang.hasMany(BarangMasuk, { foreignKey: 'barang_id', as: 'barang_masuk' });
BarangMasuk.belongsTo(Barang, { foreignKey: 'barang_id', as: 'barang' });

Barang.hasMany(BarangKeluar, { foreignKey: 'barang_id', as: 'barang_keluar' });
BarangKeluar.belongsTo(Barang, { foreignKey: 'barang_id', as: 'barang' });

User.hasMany(BarangMasuk, { foreignKey: 'user_id', as: 'barang_masuk' });
BarangMasuk.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(BarangKeluar, { foreignKey: 'user_id', as: 'barang_keluar' });
BarangKeluar.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  User,
  Kategori,
  Barang,
  BarangMasuk,
  BarangKeluar
};
