const { Aset, Kategori } = require('../models');
const QRCode = require('qrcode');

exports.getAll = async (req, res) => {
  try {
    const data = await Aset.findAll({
      include: [{ model: Kategori, as: 'kategori' }]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Aset.findByPk(req.params.id, {
      include: [{ model: Kategori, as: 'kategori' }]
    });
    if (!data) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByKode = async (req, res) => {
  try {
    const data = await Aset.findOne({
      where: { kode_aset: req.params.kode },
      include: [
        { model: Kategori, as: 'kategori' },
        { model: require('../models').Peminjaman, as: 'peminjaman', include: [{ model: require('../models').User, as: 'peminjam' }] },
        { model: require('../models').Maintenance, as: 'maintenance', include: [{ model: require('../models').User, as: 'teknisi' }] },
        { model: require('../models').LaporanKerusakan, as: 'laporan_kerusakan', include: [{ model: require('../models').User, as: 'pelapor' }] },
        { model: require('../models').Mutasi, as: 'mutasi', include: [{ model: require('../models').User, as: 'user' }] },
        { model: require('../models').StockOpname, as: 'stock_opname', include: [{ model: require('../models').User, as: 'pemeriksa' }] }
      ],
      order: [
        [{ model: require('../models').Peminjaman, as: 'peminjaman' }, 'created_at', 'DESC'],
        [{ model: require('../models').Maintenance, as: 'maintenance' }, 'created_at', 'DESC'],
        [{ model: require('../models').LaporanKerusakan, as: 'laporan_kerusakan' }, 'created_at', 'DESC'],
        [{ model: require('../models').Mutasi, as: 'mutasi' }, 'created_at', 'DESC'],
        [{ model: require('../models').StockOpname, as: 'stock_opname' }, 'created_at', 'DESC']
      ]
    });
    if (!data) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  exports.create = async (req, res) => {
  try {
    let { kode_aset, nama_aset, kategori_id, lokasi, tanggal_pengadaan, kondisi, status, harga, catatan } = req.body;
    
    if (!kode_aset) {
      const lastAset = await Aset.findOne({ order: [['id', 'DESC']] });
      const nextId = lastAset ? lastAset.id + 1 : 1;
      kode_aset = `AST-${String(nextId).padStart(3, '0')}`;
    }

    // Generate QR Code
    const qrData = JSON.stringify({ kode_aset });
    const qr_code = await QRCode.toDataURL(qrData);

    const newAset = await Aset.create({
      kode_aset,
      nama_aset,
      kategori_id,
      lokasi,
      tanggal_pengadaan,
      kondisi,
      status,
      harga,
      catatan,
      qr_code
    });
    res.status(201).json({ message: 'Aset berhasil ditambahkan', data: newAset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama_aset, kategori_id, lokasi, tanggal_pengadaan, kondisi, status, harga, catatan } = req.body;
    const aset = await Aset.findByPk(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    await aset.update({
      nama_aset, kategori_id, lokasi, tanggal_pengadaan, kondisi, status, harga, catatan
    });
    res.json({ message: 'Aset berhasil diupdate', data: aset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const aset = await Aset.findByPk(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    
    await aset.destroy();
    res.json({ message: 'Aset berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
