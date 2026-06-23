const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { User, Kategori, Barang } = require('../shared/database');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true }); // Reset DB

    const passwordHash = await bcrypt.hash('password123', 10);

    // Seed Users
    await User.bulkCreate([
      { username: 'admin', password_hash: passwordHash, nama: 'Administrator', role: 'Admin' },
      { username: 'staff', password_hash: passwordHash, nama: 'Staff', role: 'Staff' }
    ]);

    // Seed Kategori
    const kategoriElektronik = await Kategori.create({ nama_kategori: 'Elektronik', deskripsi: 'Perangkat elektronik dan komputer' });
    const kategoriFurnitur = await Kategori.create({ nama_kategori: 'Furnitur', deskripsi: 'Perabotan kantor' });

    // Seed Barang
    await Barang.create({
      kode_barang: 'ELK-001',
      nama_barang: 'Laptop Lenovo Thinkpad',
      kategori_id: kategoriElektronik.id,
      jumlah_stok: 15,
      satuan: 'Unit',
      lokasi_penyimpanan: 'Ruang IT',
      tanggal_perolehan: '2023-01-15',
      harga_barang: 15000000,
      qr_code: 'qr-data-placeholder' // Will be generated automatically later
    });

    console.log('Seeding success!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
