const { BarangMasuk, BarangKeluar, Barang, User, sequelize } = require('../models');

// Barang Masuk
exports.getBarangMasuk = async (req, res) => {
  try {
    const data = await BarangMasuk.findAll({
      include: [
        { model: Barang, as: 'barang', attributes: ['kode_barang', 'nama_barang'] },
        { model: User, as: 'user', attributes: ['nama'] }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBarangMasuk = async (req, res) => {
  const t = await BarangMasuk.sequelize.transaction();
  try {
    const payload = { ...req.body, user_id: req.userId };
    
    const barang = await Barang.findByPk(payload.barang_id, { transaction: t });
    if (!barang) throw new Error('Barang not found');
    
    // Create transaction record
    const record = await BarangMasuk.create(payload, { transaction: t });
    
    // Update stok
    await barang.update({ jumlah_stok: barang.jumlah_stok + parseInt(payload.jumlah) }, { transaction: t });
    
    await t.commit();
    res.status(201).json(record);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

// Barang Keluar
exports.getBarangKeluar = async (req, res) => {
  try {
    const data = await BarangKeluar.findAll({
      include: [
        { model: Barang, as: 'barang', attributes: ['kode_barang', 'nama_barang'] },
        { model: User, as: 'user', attributes: ['nama'] }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBarangKeluar = async (req, res) => {
  const t = await BarangKeluar.sequelize.transaction();
  try {
    const payload = { ...req.body, user_id: req.userId };
    
    const barang = await Barang.findByPk(payload.barang_id, { transaction: t });
    if (!barang) throw new Error('Barang not found');
    
    if (barang.jumlah_stok < payload.jumlah) {
      throw new Error('Stok barang tidak cukup');
    }
    
    // Create transaction record
    const record = await BarangKeluar.create(payload, { transaction: t });
    
    // Update stok
    await barang.update({ jumlah_stok: barang.jumlah_stok - parseInt(payload.jumlah) }, { transaction: t });
    
    await t.commit();
    res.status(201).json(record);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message }); // Use 400 for bad request like insufficient stock
  }
};
