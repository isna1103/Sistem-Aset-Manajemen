const { JadwalOpname, User, StockOpname, Aset, Lokasi } = require('./src/models');
const sequelize = require('./src/config/database');

async function test() {
  try {
    await sequelize.sync({ alter: true });
    const jadwal = await JadwalOpname.findAll();
    console.log("Jadwal count:", jadwal.length);
    if (jadwal.length > 0) {
      const res = await JadwalOpname.findByPk(jadwal[0].id, {
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
      console.log("Jadwal by ID:", res.toJSON());
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
}

test();
