require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../.env') });
const { Role, Permission } = require('../database');

const talentMenus = [
  'Data Karyawan',
  'Divisi',
  'Jabatan',
  'Kompetensi',
  'Training & Sertifikasi',
  'Performance Review',
  'Talent Pool',
  'Career Path',
  'Succession Planning'
];

const actions = ['Create', 'Read/View', 'Update', 'Delete', 'Export'];

const seedTalentRBAC = async () => {
  try {
    console.log('Menyiapkan Permission untuk Talent Management...');
    
    // 1. Buat semua permission untuk menu Talent
    const createdPermissions = [];
    for (const menu of talentMenus) {
      for (const action of actions) {
        const [perm] = await Permission.findOrCreate({
          where: { menu, action }
        });
        createdPermissions.push(perm);
      }
    }

    // 2. Ambil Role Admin dan Super Admin (jika ada) untuk diberi akses penuh
    const adminRole = await Role.findOne({ where: { nama_role: 'Admin' } });
    const superAdminRole = await Role.findOne({ where: { nama_role: 'Super Admin' } });

    if (adminRole) {
      console.log('Memberikan akses Talent Management ke Admin...');
      await adminRole.addPermissions(createdPermissions);
    }
    if (superAdminRole) {
      console.log('Memberikan akses Talent Management ke Super Admin...');
      await superAdminRole.addPermissions(createdPermissions);
    }

    // 3. Buat Role Khusus HR / Talent
    console.log('Membuat Role HR Manager dan HR Staff...');
    const [hrManagerRole] = await Role.findOrCreate({ 
      where: { nama_role: 'HR Manager' }, 
      defaults: { deskripsi: 'Manajer SDM dan Talent' } 
    });
    
    const [hrStaffRole] = await Role.findOrCreate({ 
      where: { nama_role: 'HR Staff' }, 
      defaults: { deskripsi: 'Staff Operasional SDM' } 
    });

    // HR Manager dapat semua akses di Talent Management
    await hrManagerRole.addPermissions(createdPermissions);

    // HR Staff hanya bisa Read/View dan Create (contoh)
    const staffPerms = createdPermissions.filter(p => ['Create', 'Read/View'].includes(p.action));
    await hrStaffRole.addPermissions(staffPerms);

    console.log('Berhasil membuat Role & Permission untuk Talent Management!');
    process.exit(0);
  } catch (err) {
    console.error('Gagal membuat Role & Permission:', err);
    process.exit(1);
  }
};

seedTalentRBAC();
