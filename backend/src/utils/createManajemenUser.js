const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

const createManajemenUser = async () => {
  try {
    const roleManajemen = await Role.findOne({ where: { nama_role: 'Manajemen' } });
    if (!roleManajemen) {
      console.log('Role Manajemen not found!');
      process.exit(1);
    }

    const password_hash = await bcrypt.hash('password123', 10);
    
    await User.findOrCreate({
      where: { username: 'manajemen' },
      defaults: {
        password_hash,
        nama: 'Bapak Manajer',
        role_id: roleManajemen.id
      }
    });

    console.log('User manajemen successfully created!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createManajemenUser();
