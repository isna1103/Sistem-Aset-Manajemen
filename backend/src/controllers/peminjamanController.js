const { Peminjaman, Aset, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Peminjaman.findAll({
      include: [
        { model: Aset, as: 'aset' },
        { model: User, as: 'peminjam', attributes: ['id', 'nama', 'username'] }
      ]
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
      include: [{ model: Aset, as: 'aset' }]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { aset_id, tanggal_pinjam } = req.body;
    
    const aset = await Aset.findByPk(aset_id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    if (aset.status !== 'Tersedia') return res.status(400).json({ message: 'Aset tidak tersedia untuk dipinjam' });

    const peminjaman = await Peminjaman.create({
      aset_id,
      user_id: req.user.id,
      tanggal_pinjam,
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

    await peminjaman.update({
      tanggal_kembali,
      kondisi_kembali,
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
