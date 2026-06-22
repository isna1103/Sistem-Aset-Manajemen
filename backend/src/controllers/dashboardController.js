const { Aset, Mutasi, Peminjaman, Maintenance, Penghapusan } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAset = await Aset.count({ where: { status: ['Tersedia', 'Dipinjam', 'Maintenance'] } }); // Exclude Dihapus? Or include all. Let's include all.
    const allAset = await Aset.count();
    const asetDipinjam = await Aset.count({ where: { status: 'Dipinjam' } });
    const asetMaintenance = await Aset.count({ where: { status: 'Maintenance' } });
    const asetDihapus = await Aset.count({ where: { status: 'Dihapus' } });
    const totalHargaAset = await Aset.sum('harga');
    
    // Aktivitas Terbaru (Gabungan mutasi, peminjaman, dll - asumsikan ambil 5 peminjaman terakhir)
    const recentActivity = await Peminjaman.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: ['aset']
    });

    res.json({
      totalAset: allAset,
      asetDipinjam,
      asetMaintenance,
      asetDihapus,
      totalHargaAset: totalHargaAset || 0,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
