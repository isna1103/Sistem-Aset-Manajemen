const { Maintenance, Aset, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Maintenance.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'teknisi', attributes: ['id', 'nama', 'username'] }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { aset_id, tanggal_maintenance, deskripsi } = req.body;
    
    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    const maintenance = await Maintenance.create({
      aset_id,
      tanggal_maintenance,
      deskripsi,
      status: 'Proses',
      user_id: req.user.id
    });

    await aset.update({ status: 'Maintenance' });

    res.status(201).json({ message: 'Maintenance berhasil dicatat', data: maintenance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.selesai = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await Maintenance.findByPk(id);
    if (!maintenance) return res.status(404).json({ message: 'Data maintenance tidak ditemukan' });

    await maintenance.update({ status: 'Selesai' });

    const aset = await Aset.findByPk(maintenance.aset_id);
    await aset.update({ status: 'Tersedia', kondisi: 'Baik' });

    res.json({ message: 'Maintenance selesai', data: maintenance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
