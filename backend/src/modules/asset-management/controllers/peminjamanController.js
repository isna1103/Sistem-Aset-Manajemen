const { Peminjaman, Aset, User } = require('../../shared/database');

exports.getAll = async (req, res) => {
  try {
    const data = await Peminjaman.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'peminjam', attributes: ['id', 'nama', 'username'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const data = await Peminjaman.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Aset, as: 'aset' }],
      order: [['created_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { aset_id, tanggal_pinjam, jadwal_kembali, nama_peminjam, divisi } = req.body;
    
    let lampiran = null;
    if (req.file) {
      lampiran = `/uploads/${req.file.filename}`;
    }

    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    if (aset.status !== 'Tersedia') return res.status(400).json({ message: 'Aset tidak tersedia untuk dipinjam' });

    const peminjaman = await Peminjaman.create({
      aset_id,
      user_id: req.user.id,
      nama_peminjam,
      divisi,
      tanggal_pinjam,
      jadwal_kembali,
      lampiran,
      status: 'Dipinjam'
    });

    await aset.update({ status: 'Dipinjam' });

    res.status(201).json({ message: 'Peminjaman berhasil', data: peminjaman });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.pengembalian = async (req, res) => {
  try {
    const { id } = req.params; // Peminjaman ID
    const { tanggal_kembali, kondisi_kembali } = req.body;

    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman) return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    if (peminjaman.status === 'Dikembalikan') return res.status(400).json({ message: 'Aset sudah dikembalikan' });

    // Cek apakah user yang mengembalikan sama dengan yang meminjam, atau jika admin boleh
    if (req.user.role !== 'Admin' && peminjaman.user_id !== req.user.id) {
       return res.status(403).json({ message: 'Akses ditolak' });
    }

    let lampiran_kembali = peminjaman.lampiran_kembali;
    if (req.file) {
      lampiran_kembali = `/uploads/${req.file.filename}`;
    }

    await peminjaman.update({
      tanggal_kembali,
      kondisi_kembali,
      lampiran_kembali,
      status: 'Dikembalikan'
    });

    const aset = await Aset.findByPk(peminjaman.aset_id);
    await aset.update({ 
      status: 'Tersedia',
      kondisi: kondisi_kembali || aset.kondisi 
    });

    res.json({ message: 'Pengembalian berhasil dicatat', data: peminjaman });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id);
    if (!peminjaman) return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });

    // Jika peminjaman belum dikembalikan, ubah status aset kembali menjadi Tersedia
    if (peminjaman.status === 'Dipinjam') {
      const aset = await Aset.findByPk(peminjaman.aset_id);
      if (aset) {
        await aset.update({ status: 'Tersedia' });
      }
    }

    await peminjaman.destroy();
    res.json({ message: 'Data peminjaman berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
