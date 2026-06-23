const express = require('express');
const router = express.Router();

const { verifyToken, checkPermission } = require('../../shared/middleware/authMiddleware');

const katCtrl = require('../controllers/kategoriController');
const lokasiCtrl = require('../controllers/lokasiController');
const dashCtrl = require('../controllers/dashboardController');
const asetCtrl = require('../controllers/asetController');
const mutasiCtrl = require('../controllers/mutasiController');
const peminjamanCtrl = require('../controllers/peminjamanController');
const maintenanceCtrl = require('../controllers/maintenanceController');
const stockOpnameCtrl = require('../controllers/stockOpnameController');
const jadwalOpnameCtrl = require('../controllers/jadwalOpnameController');
const penghapusanCtrl = require('../controllers/penghapusanController');
const laporanCtrl = require('../controllers/laporanController');
const laporanKerusakanCtrl = require('../controllers/laporanKerusakanController');

const upload = require('../../shared/middleware/uploadMiddleware');

// Protected routes middleware
router.use(verifyToken);

// Dashboard
router.get('/dashboard', checkPermission('Dashboard', 'Read/View'), dashCtrl.getDashboardStats);

// Kategori 
router.get('/kategori', katCtrl.getAll);
router.get('/kategori/:id', katCtrl.getById);
router.post('/kategori', checkPermission('Master Data Aset', 'Create'), katCtrl.create);
router.put('/kategori/:id', checkPermission('Master Data Aset', 'Update'), katCtrl.update);
router.delete('/kategori/:id', checkPermission('Master Data Aset', 'Delete'), katCtrl.delete);

// Lokasi
router.get('/lokasi', lokasiCtrl.getAll);
router.get('/lokasi/:id', lokasiCtrl.getById);
router.post('/lokasi', checkPermission('Master Data Aset', 'Create'), lokasiCtrl.create);
router.put('/lokasi/:id', checkPermission('Master Data Aset', 'Update'), lokasiCtrl.update);
router.delete('/lokasi/:id', checkPermission('Master Data Aset', 'Delete'), lokasiCtrl.delete);

// Aset
router.get('/aset', asetCtrl.getAll);
router.get('/aset/:id', asetCtrl.getById);
router.get('/aset/kode/:kode', asetCtrl.getByKode); 
router.post('/aset', checkPermission('Master Data Aset', 'Create'), asetCtrl.create);
router.put('/aset/:id', checkPermission('Master Data Aset', 'Update'), asetCtrl.update);
router.delete('/aset/:id', checkPermission('Master Data Aset', 'Delete'), asetCtrl.delete);

// Mutasi
router.get('/mutasi', checkPermission('Mutasi Aset', 'Read/View'), mutasiCtrl.getAll);
router.post('/mutasi', checkPermission('Mutasi Aset', 'Create'), mutasiCtrl.create);

// Peminjaman
router.get('/peminjaman', checkPermission('Peminjaman Aset', 'Read/View'), peminjamanCtrl.getAll);
router.get('/peminjaman/me', checkPermission('Peminjaman Aset', 'Read/View'), peminjamanCtrl.getByUser); 
router.post('/peminjaman', checkPermission('Peminjaman Aset', 'Create'), upload.single('lampiran_file'), peminjamanCtrl.create);
router.put('/peminjaman/:id/pengembalian', checkPermission('Pengembalian Aset', 'Create'), upload.single('lampiran_kembali_file'), peminjamanCtrl.pengembalian); 
router.delete('/peminjaman/:id', checkPermission('Peminjaman Aset', 'Delete'), peminjamanCtrl.delete);

// Laporan Kerusakan
router.get('/laporan-kerusakan', checkPermission('Laporan Kerusakan', 'Read/View'), laporanKerusakanCtrl.getAll);
router.post('/laporan-kerusakan', checkPermission('Laporan Kerusakan', 'Create'), upload.single('lampiran_file'), laporanKerusakanCtrl.create);
router.put('/laporan-kerusakan/:id/review', checkPermission('Laporan Kerusakan', 'Update'), laporanKerusakanCtrl.review);

// Maintenance
router.get('/maintenance', checkPermission('Maintenance Aset', 'Read/View'), maintenanceCtrl.getAll);
router.post('/maintenance', checkPermission('Maintenance Aset', 'Create'), maintenanceCtrl.create);
router.put('/maintenance/:id/selesai', checkPermission('Maintenance Aset', 'Update'), maintenanceCtrl.selesai);

// Stock Opname & Jadwal
router.get('/jadwal-opname', checkPermission('Stock Opname', 'Read/View'), jadwalOpnameCtrl.getAll);
router.get('/jadwal-opname/:id', checkPermission('Stock Opname', 'Read/View'), jadwalOpnameCtrl.getById);
router.post('/jadwal-opname', checkPermission('Stock Opname', 'Create'), jadwalOpnameCtrl.create);
router.put('/jadwal-opname/:id/status', checkPermission('Stock Opname', 'Update'), jadwalOpnameCtrl.updateStatus);

router.get('/stock-opname', checkPermission('Stock Opname', 'Read/View'), stockOpnameCtrl.getAll);
router.post('/stock-opname', checkPermission('Stock Opname', 'Create'), stockOpnameCtrl.create);

// Penghapusan
router.get('/penghapusan', checkPermission('Penghapusan Aset', 'Read/View'), penghapusanCtrl.getAll);
router.post('/penghapusan', checkPermission('Penghapusan Aset', 'Create'), penghapusanCtrl.create);

// Laporan
router.get('/laporan/aset', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanAset);
router.get('/laporan/peminjaman', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanPeminjaman);
router.get('/laporan/maintenance', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanMaintenance);
router.get('/laporan/mutasi', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanMutasi);
router.get('/laporan/stock-opname', checkPermission('Laporan', 'Read/View'), laporanCtrl.getLaporanStockOpname);

module.exports = router;
