const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const authCtrl = require('../controllers/authController');
const katCtrl = require('../controllers/kategoriController');
const brgCtrl = require('../controllers/barangController');
const transCtrl = require('../controllers/transaksiController');
const dashCtrl = require('../controllers/dashboardController');
const lapCtrl = require('../controllers/laporanController');

// Auth
router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);

// Protected routes middleware
router.use(verifyToken);

// Dashboard
router.get('/dashboard', dashCtrl.getDashboardStats);

// Kategori
router.get('/kategori', katCtrl.getAll);
router.get('/kategori/:id', katCtrl.getById);
router.post('/kategori', isAdmin, katCtrl.create);
router.put('/kategori/:id', isAdmin, katCtrl.update);
router.delete('/kategori/:id', isAdmin, katCtrl.delete);

// Barang
router.get('/barang', brgCtrl.getAll);
router.get('/barang/:id', brgCtrl.getById);
router.post('/barang', isAdmin, brgCtrl.create);
router.put('/barang/:id', isAdmin, brgCtrl.update);
router.delete('/barang/:id', isAdmin, brgCtrl.delete);

// Transaksi
router.get('/barang-masuk', transCtrl.getBarangMasuk);
router.post('/barang-masuk', transCtrl.createBarangMasuk); // Staff & Admin can create? Yes, BRD says staff can input.

router.get('/barang-keluar', transCtrl.getBarangKeluar);
router.post('/barang-keluar', transCtrl.createBarangKeluar);

// Laporan
router.get('/laporan/aset', lapCtrl.getLaporanAset);
router.get('/laporan/stok', lapCtrl.getLaporanStok);
router.get('/laporan/pdf', lapCtrl.exportPDF);

module.exports = router;
