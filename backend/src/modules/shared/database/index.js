const User = require('../../../modules/core/users/User');
const Role = require('../../../modules/core/roles/Role');
const Permission = require('../../../modules/core/permissions/Permission');
const RolePermission = require('../../../modules/core/permissions/RolePermission');
const Kategori = require('../../../modules/asset-management/models/Kategori');
const Aset = require('../../../modules/asset-management/models/Aset');
const Mutasi = require('../../../modules/asset-management/models/Mutasi');
const Peminjaman = require('../../../modules/asset-management/models/Peminjaman');
const Maintenance = require('../../../modules/asset-management/models/Maintenance');
const StockOpname = require('../../../modules/asset-management/models/StockOpname');
const Penghapusan = require('../../../modules/asset-management/models/Penghapusan');
const Lokasi = require('../../../modules/asset-management/models/Lokasi');
const LaporanKerusakan = require('../../../modules/asset-management/models/LaporanKerusakan');
const JadwalOpname = require('../../../modules/asset-management/models/JadwalOpname');

// Associations

// Roles & Permissions
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', as: 'roles' });

// Role & User
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role_info' });

// Kategori & Aset
Kategori.hasMany(Aset, { foreignKey: 'kategori_id', as: 'aset' });
Aset.belongsTo(Kategori, { foreignKey: 'kategori_id', as: 'kategori' });

// Aset & Mutasi
Aset.hasMany(Mutasi, { foreignKey: 'aset_id', as: 'mutasi' });
Mutasi.belongsTo(Aset, { foreignKey: 'aset_id', as: 'aset' });

// Aset & Peminjaman
Aset.hasMany(Peminjaman, { foreignKey: 'aset_id', as: 'peminjaman' });
Peminjaman.belongsTo(Aset, { foreignKey: 'aset_id', as: 'aset' });

// Aset & Maintenance
Aset.hasMany(Maintenance, { foreignKey: 'aset_id', as: 'maintenance' });
Maintenance.belongsTo(Aset, { foreignKey: 'aset_id', as: 'aset' });

// Aset & LaporanKerusakan
Aset.hasMany(LaporanKerusakan, { foreignKey: 'aset_id', as: 'laporan_kerusakan' });
LaporanKerusakan.belongsTo(Aset, { foreignKey: 'aset_id', as: 'aset' });

// LaporanKerusakan & Maintenance
LaporanKerusakan.hasOne(Maintenance, { foreignKey: 'laporan_id', as: 'maintenance' });
Maintenance.belongsTo(LaporanKerusakan, { foreignKey: 'laporan_id', as: 'laporan' });

// Aset & StockOpname
Aset.hasMany(StockOpname, { foreignKey: 'aset_id', as: 'stock_opname' });
StockOpname.belongsTo(Aset, { foreignKey: 'aset_id', as: 'aset' });

// Aset & Penghapusan
Aset.hasMany(Penghapusan, { foreignKey: 'aset_id', as: 'penghapusan' });
Penghapusan.belongsTo(Aset, { foreignKey: 'aset_id', as: 'aset' });

// User associations (Admin/Staff who process the transactions)
User.hasMany(Mutasi, { foreignKey: 'user_id', as: 'mutasi_diproses' });
Mutasi.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Peminjaman, { foreignKey: 'user_id', as: 'peminjaman' });
Peminjaman.belongsTo(User, { foreignKey: 'user_id', as: 'peminjam' });

User.hasMany(Maintenance, { foreignKey: 'user_id', as: 'maintenance_dibuat' });
Maintenance.belongsTo(User, { foreignKey: 'user_id', as: 'pembuat' });

User.hasMany(Maintenance, { foreignKey: 'teknisi_id', as: 'maintenance_ditangani' });
Maintenance.belongsTo(User, { foreignKey: 'teknisi_id', as: 'teknisi' });

User.hasMany(LaporanKerusakan, { foreignKey: 'user_id', as: 'laporan_kerusakan' });
LaporanKerusakan.belongsTo(User, { foreignKey: 'user_id', as: 'pelapor' });

User.hasMany(LaporanKerusakan, { foreignKey: 'teknisi_id', as: 'laporan_teknisi' });
LaporanKerusakan.belongsTo(User, { foreignKey: 'teknisi_id', as: 'teknisi' });

User.hasMany(StockOpname, { foreignKey: 'user_id', as: 'stock_opname' });
StockOpname.belongsTo(User, { foreignKey: 'user_id', as: 'pemeriksa' });

User.hasMany(JadwalOpname, { foreignKey: 'penanggung_jawab_id', as: 'jadwal_opname' });
JadwalOpname.belongsTo(User, { foreignKey: 'penanggung_jawab_id', as: 'penanggung_jawab' });

JadwalOpname.hasMany(StockOpname, { foreignKey: 'jadwal_id', as: 'detail_opname' });
StockOpname.belongsTo(JadwalOpname, { foreignKey: 'jadwal_id', as: 'jadwal' });

Lokasi.hasMany(StockOpname, { foreignKey: 'lokasi_id', as: 'stock_opname' });
StockOpname.belongsTo(Lokasi, { foreignKey: 'lokasi_id', as: 'lokasi_aktual' });

User.hasMany(Penghapusan, { foreignKey: 'user_id', as: 'penghapusan' });
Penghapusan.belongsTo(User, { foreignKey: 'user_id', as: 'penghapus' });

module.exports = {
  User,
  Role,
  Permission,
  RolePermission,
  Kategori,
  Aset,
  Mutasi,
  Peminjaman,
  Maintenance,
  StockOpname,
  Penghapusan,
  Lokasi,
  LaporanKerusakan,
  JadwalOpname
};
