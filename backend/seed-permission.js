const { Role, Permission, RolePermission } = require('./src/models');
const sequelize = require('./src/config/database');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // 1. Add Permissions for Laporan Kerusakan
    const menus = ['Laporan Kerusakan'];
    const actions = ['Read/View', 'Create', 'Update', 'Delete'];
    
    for (const menu of menus) {
      for (const action of actions) {
        await Permission.findOrCreate({
          where: { menu, action }
        });
      }
    }
    console.log('Permissions Laporan Kerusakan created');

    // 2. Assign to Staff Role (Assuming role name is 'Staff')
    const staffRole = await Role.findOne({ where: { nama_role: 'Staff' } });
    if (staffRole) {
      const readPerm = await Permission.findOne({ where: { menu: 'Laporan Kerusakan', action: 'Read/View' } });
      const createPerm = await Permission.findOne({ where: { menu: 'Laporan Kerusakan', action: 'Create' } });
      
      if (readPerm) await RolePermission.findOrCreate({ where: { role_id: staffRole.id, permission_id: readPerm.id } });
      if (createPerm) await RolePermission.findOrCreate({ where: { role_id: staffRole.id, permission_id: createPerm.id } });
      console.log('Assigned Laporan Kerusakan to Staff role');
    } else {
      console.log('Staff role not found. Please assign manually via Admin UI.');
    }

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
