const { StockOpname, Aset, User } = require('../../shared/database');

exports.getAll = async (req, res) => {
  try {
    const data = await StockOpname.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'pemeriksa', attributes: ['id', 'nama', 'username'] }
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
    const { aset_id, tanggal_opname, kondisi_fisik, lokasi_id, keterangan } = req.body;
    
    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    // Determine discrepancy (Selisih)
    let is_selisih = false;
    if (kondisi_fisik !== 'Sesuai') is_selisih = true;
    if (lokasi_id && parseInt(lokasi_id) !== aset.lokasi_id) is_selisih = true;

    const opname = await StockOpname.create({
      aset_id,
      jadwal_id: null,
      tanggal_opname: tanggal_opname || new Date(),
      kondisi_fisik,
      lokasi_id: lokasi_id || aset.lokasi_id,
      is_selisih,
      keterangan,
      user_id: req.user.id
    });

    // Otomatis Rekonsiliasi/Update Data Aset
    let newKondisi = 'Baik';
    if (kondisi_fisik === 'Tidak Sesuai') {
      newKondisi = 'Kurang Baik';
    } else if (kondisi_fisik === 'Rusak') {
      newKondisi = 'Rusak';
    } else if (kondisi_fisik === 'Hilang') {
      newKondisi = 'Hilang';
    }

    await aset.update({ 
      kondisi: newKondisi,
      lokasi_id: lokasi_id || aset.lokasi_id
    });

    res.status(201).json({ message: 'Hasil scan berhasil dicatat dan data aset diperbarui', data: opname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
