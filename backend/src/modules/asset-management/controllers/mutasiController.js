const { Mutasi, Aset, User } = require('../../shared/database');

exports.getAll = async (req, res) => {
  try {
    const data = await Mutasi.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'user', attributes: ['id', 'nama', 'username'] }
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
    const { aset_id, lokasi_baru, tanggal_mutasi, keterangan } = req.body;
    
    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    const lokasi_lama = aset.lokasi;

    const mutasi = await Mutasi.create({
      aset_id,
      lokasi_lama,
      lokasi_baru,
      tanggal_mutasi,
      keterangan,
      user_id: req.user.id
    });

    // Update lokasi aset
    await aset.update({ lokasi: lokasi_baru });

    res.status(201).json({ message: 'Mutasi berhasil dicatat', data: mutasi });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
