const { Barang, Kategori } = require('../models');
const QRCode = require('qrcode');

exports.getAll = async (req, res) => {
  try {
    const data = await Barang.findAll({
      include: [{ model: Kategori, as: 'kategori', attributes: ['nama_kategori'] }]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id, {
      include: [{ model: Kategori, as: 'kategori', attributes: ['nama_kategori'] }]
    });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    
    // Generate QR Code data (kode_barang, nama, kategori_id, lokasi)
    const qrText = JSON.stringify({
      kode: payload.kode_barang,
      nama: payload.nama_barang,
      kategori_id: payload.kategori_id,
      lokasi: payload.lokasi_penyimpanan
    });
    
    // Generate base64 QR Code
    payload.qr_code = await QRCode.toDataURL(qrText);
    
    const data = await Barang.create(payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    const payload = req.body;
    
    // Re-generate QR Code if key data changed
    if (payload.kode_barang || payload.nama_barang || payload.kategori_id || payload.lokasi_penyimpanan) {
      const qrText = JSON.stringify({
        kode: payload.kode_barang || data.kode_barang,
        nama: payload.nama_barang || data.nama_barang,
        kategori_id: payload.kategori_id || data.kategori_id,
        lokasi: payload.lokasi_penyimpanan || data.lokasi_penyimpanan
      });
      payload.qr_code = await QRCode.toDataURL(qrText);
    }

    await data.update(payload);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    await data.destroy();
    res.json({ message: 'Barang deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
