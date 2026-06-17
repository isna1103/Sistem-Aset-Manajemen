const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin, checkPermission } = require('../middlewares/authMiddleware');
const authCtrl = require('../controllers/authController');
const katCtrl = require('../controllers/kategoriController');
const dashCtrl = require('../controllers/dashboardController');

const asetCtrl = require('../controllers/asetController');
const mutasiCtrl = require('../controllers/mutasiController');
const peminjamanCtrl = require('../controllers/peminjamanController');
const maintenanceCtrl = require('../controllers/maintenanceController');
const stockOpnameCtrl = require('../controllers/stockOpnameController');
const penghapusanCtrl = require('../controllers/penghapusanController');
const roleCtrl = require('../controllers/roleController');
const laporanCtrl = require('../controllers/laporanController');
const userRoutes = require('./userRoutes');

// Auth
router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);

// Protected routes middleware
router.use(verifyToken);

// Dashboard
router.get('/dashboard', checkPermission('Dashboard', 'Read/View'), dashCtrl.getDashboardStats);

// Kategori 
router.get('/kategori', checkPermission('Pengadaan Aset', 'Read/View'), katCtrl.getAll);
router.get('/kategori/:id', checkPermission('Pengadaan Aset', 'Read/View'), katCtrl.getById);
router.post('/kategori', checkPermission('Pengadaan Aset', 'Create'), katCtrl.create);
router.put('/kategori/:id', checkPermission('Pengadaan Aset', 'Update'), katCtrl.update);
router.delete('/kategori/:id', checkPermission('Pengadaan Aset', 'Delete'), katCtrl.delete);

// Aset
router.get('/aset', checkPermission('Pengadaan Aset', 'Read/View'), asetCtrl.getAll);
router.get('/aset/:id', checkPermission('Pengadaan Aset', 'Read/View'), asetCtrl.getById);
router.get('/aset/kode/:kode', checkPermission('QR Code Tracking', 'Read/View'), asetCtrl.getByKode); 
router.post('/aset', checkPermission('Pengadaan Aset', 'Create'), asetCtrl.create);
router.put('/aset/:id', checkPermission('Pengadaan Aset', 'Update'), asetCtrl.update);
router.delete('/aset/:id', checkPermission('Pengadaan Aset', 'Delete'), asetCtrl.delete);

// Mutasi
router.get('/mutasi', checkPermission('Mutasi Aset', 'Read/View'), mutasiCtrl.getAll);
router.post('/mutasi', checkPermission('Mutasi Aset', 'Create'), mutasiCtrl.create);

// Peminjaman
router.get('/peminjaman', checkPermission('Peminjaman Aset', 'Read/View'), peminjamanCtrl.getAll);
router.get('/peminjaman/me', checkPermission('Peminjaman Aset', 'Read/View'), peminjamanCtrl.getByUser); 
router.post('/peminjaman', checkPermission('Peminjaman Aset', 'Create'), peminjamanCtrl.create);
router.put('/peminjaman/:id/pengembalian', checkPermission('Pengembalian Aset', 'Create'), peminjamanCtrl.pengembalian); 

// Maintenance
router.get('/maintenance', checkPermission('Maintenance Aset', 'Read/View'), maintenanceCtrl.getAll);
router.post('/maintenance', checkPermission('Maintenance Aset', 'Create'), maintenanceCtrl.create);
router.put('/maintenance/:id/selesai', checkPermission('Maintenance Aset', 'Update'), maintenanceCtrl.selesai);

// Stock Opname
router.get('/stock-opname', checkPermission('Stock Opname', 'Read/View'), stockOpnameCtrl.getAll);
router.post('/stock-opname', checkPermission('Stock Opname', 'Create'), stockOpnameCtrl.create);

// Penghapusan
router.get('/penghapusan', checkPermission('Penghapusan Aset', 'Read/View'), penghapusanCtrl.getAll);
router.post('/penghapusan', checkPermission('Penghapusan Aset', 'Create'), penghapusanCtrl.create);

// Role & Permission
router.get('/permissions', checkPermission('Manajemen Role & Permission', 'Read/View'), roleCtrl.getPermissions);
router.get('/roles', checkPermission('Manajemen Role & Permission', 'Read/View'), roleCtrl.getRoles);
router.post('/roles', checkPermission('Manajemen Role & Permission', 'Create'), roleCtrl.createRole);
router.put('/roles/:id', checkPermission('Manajemen Role & Permission', 'Update'), roleCtrl.updateRole);
router.delete('/roles/:id', checkPermission('Manajemen Role & Permission', 'Delete'), roleCtrl.deleteRole);

// Manajemen User
router.use('/users', userRoutes);

// Laporan
router.get('/laporan/aset', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanAset);
router.get('/laporan/peminjaman', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanPeminjaman);
router.get('/laporan/maintenance', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanMaintenance);
router.get('/laporan/mutasi', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanMutasi);
router.get('/laporan/stock-opname', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanStockOpname);

module.exports = router;
