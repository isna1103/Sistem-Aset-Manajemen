const { JadwalOpname } = require('./src/models');
const sequelize = require('./src/config/database');

async function test() {
  try {
    const jadwal = await JadwalOpname.create({
      judul: 'Test Sesi',
      tanggal_mulai: '2026-06-01',
      tanggal_selesai: '2026-06-30',
      catatan: 'Test catatan',
      penanggung_jawab_id: 1, // Assuming admin is 1
      status: 'Berlangsung'
    });
    console.log("Success:", jadwal.toJSON());
  } catch (err) {
    console.error("Error creating:", err);
  } finally {
    process.exit();
  }
}

test();
