require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../.env') });
const bcrypt = require('bcrypt');
const { User, Role } = require('../database');

const createSuperAdmin = async () => {
  try {
    // Cari role Super Admin (jika belum ada, kita buat sekalian)
    const [roleSuperAdmin] = await Role.findOrCreate({ 
      where: { nama_role: 'Super Admin' },
      defaults: { deskripsi: 'Memiliki akses penuh ke seluruh sistem' }
    });

    const password_hash = await bcrypt.hash('superadmin123', 10);
    
    // Buat User Super Admin
    const [user, created] = await User.findOrCreate({
      where: { username: 'superadmin' },
      defaults: {
        password_hash,
        nama: 'Super Administrator',
        role_id: roleSuperAdmin.id
      }
    });

    if (created) {
      console.log('✅ Akun Super Admin berhasil dibuat!');
      console.log('   Username : superadmin');
      console.log('   Password : superadmin123');
    } else {
      console.log('⚠️ Akun Super Admin sudah ada di database.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal membuat akun Super Admin:', err);
    process.exit(1);
  }
};

createSuperAdmin();
