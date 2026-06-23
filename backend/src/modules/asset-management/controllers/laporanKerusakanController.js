const { LaporanKerusakan, Aset, User, Maintenance } = require('../../shared/database');

exports.getAll = async (req, res) => {
  try {
    const isStaff = req.userRole !== 'Admin';
    const whereClause = isStaff ? { user_id: req.user.id } : {};

    const data = await LaporanKerusakan.findAll({
      where: whereClause,
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'pelapor', attributes: ['id', 'nama', 'username'] },
        { model: User, as: 'teknisi', attributes: ['id', 'nama', 'username'] }
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
    const { aset_id, tanggal_laporan, deskripsi_kerusakan, prioritas, teknisi_id, pihak_ketiga } = req.body;
    let lampiran = req.body.lampiran || null;

    if (req.file) {
      lampiran = `/uploads/${req.file.filename}`;
    }

    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    const laporan = await LaporanKerusakan.create({
      aset_id,
      user_id: req.user.id,
      tanggal_laporan,
      deskripsi_kerusakan,
      prioritas: prioritas || 'Sedang',
      lampiran,
      status: 'Menunggu Review',
      teknisi_id: teknisi_id || null,
      pihak_ketiga: pihak_ketiga || null
    });

    res.status(201).json({ message: 'Laporan kerusakan berhasil dibuat', data: laporan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.review = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body;

    if (!['Disetujui', 'Ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const laporan = await LaporanKerusakan.findByPk(id);
    if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    if (status === 'Disetujui') {
      const aset = await Aset.findByPk(laporan.aset_id);
      if (aset) {
        await aset.update({ status: 'Maintenance' });
      }

      await Maintenance.create({
        laporan_id: laporan.id,
        aset_id: laporan.aset_id,
        tanggal_maintenance: new Date(),
        deskripsi: laporan.deskripsi_kerusakan,
        status: 'Proses',
        user_id: req.user.id,
        teknisi_id: laporan.teknisi_id,
        pihak_ketiga: laporan.pihak_ketiga
      });

      await laporan.update({ status: 'Diproses', catatan_admin });
      return res.json({ message: 'Laporan disetujui dan otomatis masuk ke Proses Maintenance', data: laporan });
    } else {
      await laporan.update({ status, catatan_admin });
      return res.json({ message: `Laporan berhasil di${status.toLowerCase()}`, data: laporan });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
