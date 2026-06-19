const { Maintenance, Aset, User, LaporanKerusakan } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Maintenance.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'pembuat', attributes: ['id', 'nama', 'username'] },
        { model: User, as: 'teknisi', attributes: ['id', 'nama', 'username'] },
        { model: LaporanKerusakan, as: 'laporan' }
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
    const { laporan_id, tanggal_maintenance, deskripsi } = req.body;
    
    const laporan = await LaporanKerusakan.findByPk(laporan_id);
    if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    if (laporan.status !== 'Disetujui') return res.status(400).json({ message: 'Laporan belum disetujui' });

    const aset = await Aset.findByPk(laporan.aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    const maintenance = await Maintenance.create({
      laporan_id,
      aset_id: aset.id,
      tanggal_maintenance,
      deskripsi,
      status: 'Proses',
      user_id: req.user.id,
      teknisi_id: laporan.teknisi_id,
      pihak_ketiga: laporan.pihak_ketiga
    });

    await aset.update({ status: 'Maintenance' });
    await laporan.update({ status: 'Diproses' });

    res.status(201).json({ message: 'Maintenance berhasil dicatat', data: maintenance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.selesai = async (req, res) => {
  try {
    const { id } = req.params;
    const { tindakan_perbaikan, biaya, catatan_hasil, tanggal_selesai } = req.body;

    const maintenance = await Maintenance.findByPk(id);
    if (!maintenance) return res.status(404).json({ message: 'Data maintenance tidak ditemukan' });

    await maintenance.update({ 
      status: 'Selesai',
      tindakan_perbaikan,
      biaya: biaya || null,
      catatan_hasil,
      tanggal_selesai: tanggal_selesai || new Date()
    });

    if (maintenance.laporan_id) {
      const laporan = await LaporanKerusakan.findByPk(maintenance.laporan_id);
      if (laporan) await laporan.update({ status: 'Selesai' });
    }

    const aset = await Aset.findByPk(maintenance.aset_id);
    await aset.update({ status: 'Tersedia', kondisi: 'Baik' });

    res.json({ message: 'Maintenance selesai', data: maintenance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
