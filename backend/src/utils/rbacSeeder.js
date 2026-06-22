const sequelize = require('../config/database');
const { User, Role, Permission, RolePermission } = require('../models');

const menus = [
  'Dashboard',
  'Master Data Aset',
  'Mutasi Aset',
  'Peminjaman Aset',
  'Pengembalian Aset',
  'Maintenance Aset',
  'Stock Opname',
  'QR Code Tracking',
  'Penghapusan Aset',
  'Laporan',
  'Manajemen User',
  'Manajemen Role & Permission'
];

const actions = ['Create', 'Read/View', 'Update', 'Delete', 'Export'];

const seedRBAC = async () => {
  try {
    console.log('Syncing database...');
    // Sync all models, alter true ensures new tables are created without dropping existing ones completely
    await sequelize.sync({ alter: true });
    
    console.log('Seeding Permissions...');
    const createdPermissions = [];
    for (const menu of menus) {
      for (const action of actions) {
        const [perm] = await Permission.findOrCreate({
          where: { menu, action }
        });
        createdPermissions.push(perm);
      }
    }

    console.log('Seeding Roles...');
    const [adminRole] = await Role.findOrCreate({ where: { nama_role: 'Admin' }, defaults: { deskripsi: 'Administrator System' } });
    const [staffRole] = await Role.findOrCreate({ where: { nama_role: 'Staff' }, defaults: { deskripsi: 'Staff Operasional' } });
    const [manajemenRole] = await Role.findOrCreate({ where: { nama_role: 'Manajemen' }, defaults: { deskripsi: 'Top Level Management' } });

    console.log('Assigning Permissions to Roles...');
    
    // 1. Admin gets all permissions
    await adminRole.setPermissions(createdPermissions);

    // 2. Staff gets specific permissions
    // - Dashboard (View)
    // - Peminjaman Aset (Create, View)
    // - Pengembalian Aset (Create, View)
    // - QR Code Tracking (View)
    const staffPerms = createdPermissions.filter(p => 
      (p.menu === 'Dashboard' && p.action === 'Read/View') ||
      (p.menu === 'Peminjaman Aset' && ['Create', 'Read/View'].includes(p.action)) ||
      (p.menu === 'Pengembalian Aset' && ['Create', 'Read/View'].includes(p.action)) ||
      (p.menu === 'QR Code Tracking' && p.action === 'Read/View') ||
      (p.menu === 'Master Data Aset' && p.action === 'Read/View') // Minimal view
    );
    await staffRole.setPermissions(staffPerms);

    // 3. Manajemen gets specific permissions
    // - Dashboard (View)
    // - Laporan (View, Export)
    // - Seluruh Modul Aset (View)
    const manajemenPerms = createdPermissions.filter(p => 
      (p.action === 'Read/View') || 
      (p.menu === 'Laporan' && p.action === 'Export')
    );
    await manajemenRole.setPermissions(manajemenPerms);

    console.log('Migrating existing Users to new Roles...');
    const users = await User.findAll();
    for (const user of users) {
      if (user.username === 'admin') {
        user.role_id = adminRole.id;
      } else {
        user.role_id = staffRole.id;
      }
      await user.save();
    }

    console.log('RBAC Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('RBAC Seeding failed:', err);
    process.exit(1);
  }
};

seedRBAC();
