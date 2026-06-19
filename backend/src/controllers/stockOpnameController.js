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
    const { aset_id, jadwal_id, tanggal_opname, kondisi_fisik, lokasi_id, keterangan } = req.body;
    
    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    // Determine discrepancy (Selisih)
    let is_selisih = false;
    if (kondisi_fisik !== 'Sesuai') is_selisih = true;
    if (lokasi_id && parseInt(lokasi_id) !== aset.lokasi_id) is_selisih = true;

    // Check if already scanned in this schedule
    if (jadwal_id) {
      const existingScan = await StockOpname.findOne({ where: { jadwal_id, aset_id } });
      if (existingScan) {
        return res.status(400).json({ message: 'Aset ini sudah di-scan pada sesi opname ini.' });
      }
    }

    const opname = await StockOpname.create({
      aset_id,
      jadwal_id: jadwal_id || null,
      tanggal_opname: tanggal_opname || new Date(),
      kondisi_fisik,
      lokasi_id: lokasi_id || aset.lokasi_id,
      is_selisih,
      keterangan,
      user_id: req.user.id
    });

    res.status(201).json({ message: 'Hasil scan berhasil dicatat', data: opname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
