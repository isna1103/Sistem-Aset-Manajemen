const { Lokasi } = require('../../shared/database');

exports.getAll = async (req, res) => {
  try {
    const lokasiList = await Lokasi.findAll({
      order: [['nama_lokasi', 'ASC']]
    });
    res.json(lokasiList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const lokasi = await Lokasi.findByPk(req.params.id);
    if (!lokasi) return res.status(404).json({ message: 'Lokasi tidak ditemukan' });
    res.json(lokasi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama_lokasi, keterangan } = req.body;
    const newLokasi = await Lokasi.create({ nama_lokasi, keterangan });
    res.status(201).json(newLokasi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama_lokasi, keterangan } = req.body;
    const lokasi = await Lokasi.findByPk(req.params.id);
    if (!lokasi) return res.status(404).json({ message: 'Lokasi tidak ditemukan' });

    await lokasi.update({ nama_lokasi, keterangan });
    res.json(lokasi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const lokasi = await Lokasi.findByPk(req.params.id);
    if (!lokasi) return res.status(404).json({ message: 'Lokasi tidak ditemukan' });

    await lokasi.destroy();
    res.json({ message: 'Lokasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
