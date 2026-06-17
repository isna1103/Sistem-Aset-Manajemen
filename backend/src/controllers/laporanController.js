const { Aset, Mutasi, Peminjaman, Maintenance, StockOpname, Kategori, User } = require('../models');

exports.getLaporanAset = async (req, res) => {
  try {
    const aset = await Aset.findAll({
      include: [{ model: Kategori, as: 'kategori' }]
    });
    res.json(aset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLaporanPeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'peminjam', attributes: ['id', 'nama'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(peminjaman);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLaporanMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'teknisi', attributes: ['id', 'nama'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLaporanMutasi = async (req, res) => {
  try {
    const mutasi = await Mutasi.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'user', attributes: ['id', 'nama'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(mutasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLaporanStockOpname = async (req, res) => {
  try {
    const opname = await StockOpname.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'pemeriksa', attributes: ['id', 'nama'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(opname);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

