const { Barang, Kategori, BarangMasuk, BarangKeluar } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalAsetResult = await Barang.findAll({
      attributes: [
        [Barang.sequelize.fn('SUM', Barang.sequelize.literal('harga_barang * jumlah_stok')), 'total_nilai']
      ],
      raw: true
    });
    const totalAset = totalAsetResult[0]?.total_nilai || 0;

    const totalBarang = await Barang.count();
    const totalKategori = await Kategori.count();
    const totalStok = await Barang.sum('jumlah_stok');
    
    const totalBarangMasuk = await BarangMasuk.count();
    const totalBarangKeluar = await BarangKeluar.count();
    
    // Kategori stats for chart
    const kategoriStats = await Barang.findAll({
      attributes: [
        'kategori_id',
        [Barang.sequelize.fn('COUNT', Barang.sequelize.col('id_barang')), 'total']
      ],
      include: [{ model: Kategori, as: 'kategori', attributes: ['nama_kategori'] }],
      group: ['kategori_id']
    });

    res.json({
      summary: {
        totalAset: totalAset || 0,
        totalBarang,
        totalKategori,
        totalStok: totalStok || 0,
        totalBarangMasuk,
        totalBarangKeluar
      },
      charts: {
        kategoriStats
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
