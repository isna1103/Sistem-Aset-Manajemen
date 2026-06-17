const { StockOpname, Aset, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await StockOpname.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'pemeriksa', attributes: ['id', 'nama', 'username'] }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { aset_id, tanggal_opname, kondisi_fisik, keterangan } = req.body;
    
    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    const opname = await StockOpname.create({
      aset_id,
      tanggal_opname,
      kondisi_fisik,
      keterangan,
      user_id: req.user.id
    });

    // Update aset condition if changed during stock opname (optional, let's keep it simple or map it)
    if (kondisi_fisik === 'Rusak') {
      await aset.update({ kondisi: 'Rusak' });
    } else if (kondisi_fisik === 'Hilang') {
      await aset.update({ status: 'Dihapus' });
    }

    res.status(201).json({ message: 'Stock Opname berhasil dicatat', data: opname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
