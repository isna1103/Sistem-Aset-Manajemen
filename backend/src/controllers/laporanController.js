const { Barang, Kategori, BarangMasuk, BarangKeluar } = require('../models');
const PDFDocument = require('pdfkit');

exports.getLaporanAset = async (req, res) => {
  try {
    const data = await Barang.findAll({
      include: [{ model: Kategori, as: 'kategori', attributes: ['nama_kategori'] }]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLaporanStok = async (req, res) => {
  try {
    // Assuming laporan stok is same as aset but specific fields
    const data = await Barang.findAll({
      attributes: ['kode_barang', 'nama_barang', 'jumlah_stok', 'satuan', 'lokasi_penyimpanan'],
      include: [{ model: Kategori, as: 'kategori', attributes: ['nama_kategori'] }]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const barangList = await Barang.findAll({
      include: [{ model: Kategori, as: 'kategori', attributes: ['nama_kategori'] }]
    });

    const doc = new PDFDocument({ margin: 30 });
    let filename = 'Laporan_Aset.pdf';
    
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text('Sistem Aset Manajemen', { align: 'center' });
    doc.fontSize(16).text('Laporan Data Aset', { align: 'center' });
    doc.moveDown();

    // Table Header
    doc.fontSize(12);
    doc.text('Kode', 30, doc.y, { continued: true, width: 80 });
    doc.text('Nama Barang', 110, doc.y, { continued: true, width: 150 });
    doc.text('Kategori', 260, doc.y, { continued: true, width: 100 });
    doc.text('Stok', 360, doc.y, { continued: true, width: 50 });
    doc.text('Lokasi', 410, doc.y);
    doc.moveDown();
    
    doc.moveTo(30, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Table Content
    barangList.forEach(b => {
      doc.text(b.kode_barang, 30, doc.y, { continued: true, width: 80 });
      doc.text(b.nama_barang, 110, doc.y, { continued: true, width: 150 });
      doc.text(b.kategori?.nama_kategori || '-', 260, doc.y, { continued: true, width: 100 });
      doc.text(b.jumlah_stok.toString(), 360, doc.y, { continued: true, width: 50 });
      doc.text(b.lokasi_penyimpanan, 410, doc.y);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
