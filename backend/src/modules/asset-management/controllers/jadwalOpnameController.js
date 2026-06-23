const { JadwalOpname, User, StockOpname, Aset, Lokasi } = require('../../shared/database');

exports.getAll = async (req, res) => {
  try {
    const jadwal = await JadwalOpname.findAll({
      include: [
        { model: User, as: 'penanggung_jawab', attributes: ['id', 'nama', 'username'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(jadwal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const jadwal = await JadwalOpname.findByPk(req.params.id, {
      include: [
        { model: User, as: 'penanggung_jawab', attributes: ['id', 'nama', 'username'] },
        { 
          model: StockOpname, 
          as: 'detail_opname',
          include: [
            { model: Aset, as: 'aset' },
            { model: Lokasi, as: 'lokasi_aktual' },
            { model: User, as: 'pemeriksa', attributes: ['id', 'nama'] }
          ]
        }
      ]
    });
    if (!jadwal) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    
    // Auto-calculate un-scanned assets
    const allAset = await Aset.findAll();
    const scannedAsetId = jadwal.detail_opname.map(d => d.aset_id);
    const unscanned = allAset.filter(a => !scannedAsetId.includes(a.id));

    res.json({
      jadwal,
      unscanned_aset: unscanned
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { judul, tanggal_mulai, tanggal_selesai, catatan } = req.body;
    const jadwal = await JadwalOpname.create({
      judul,
      tanggal_mulai,
      tanggal_selesai,
      catatan,
      penanggung_jawab_id: req.user.id,
      status: 'Berlangsung'
    });
    res.status(201).json(jadwal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const jadwal = await JadwalOpname.findByPk(req.params.id);
    if (!jadwal) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });

    if (status === 'Selesai' && jadwal.status !== 'Selesai') {
      // Rekonsiliasi Otomatis
      const selisihList = await StockOpname.findAll({
        where: { jadwal_id: jadwal.id, is_selisih: true }
      });
      
      for (let item of selisihList) {
        const aset = await Aset.findByPk(item.aset_id);
        if (aset) {
          // Update kondisi
          if (['Sesuai', 'Tidak Sesuai'].includes(item.kondisi_fisik)) {
            await aset.update({ kondisi: 'Baik' }); 
          } else {
            await aset.update({ kondisi: item.kondisi_fisik }); // Rusak, Hilang
          }
          
          // Update lokasi jika pindah
          if (item.lokasi_id && item.lokasi_id !== aset.lokasi_id) {
            await aset.update({ lokasi_id: item.lokasi_id });
          }
        }
      }
    }

    await jadwal.update({ status });
    res.json({ message: 'Status jadwal berhasil diperbarui', data: jadwal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
