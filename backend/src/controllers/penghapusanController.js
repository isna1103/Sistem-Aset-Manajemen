const { Penghapusan, Aset, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Penghapusan.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'penghapus', attributes: ['id', 'nama', 'username'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { aset_id, tanggal_penghapusan, alasan } = req.body;
    
    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    const penghapusan = await Penghapusan.create({
      aset_id,
      tanggal_penghapusan,
      alasan,
      user_id: req.user.id
    });

    await aset.update({ status: 'Dihapus' });

    res.status(201).json({ message: 'Penghapusan aset berhasil dicatat', data: penghapusan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
