'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. roles
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nama_role: { type: Sequelize.STRING, allowNull: false, unique: true },
      deskripsi: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. permissions
    await queryInterface.createTable('permissions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      menu: { type: Sequelize.STRING, allowNull: false },
      action: { type: Sequelize.STRING, allowNull: false }
    });

    // 3. role_permissions
    await queryInterface.createTable('role_permissions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      role_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'roles', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      permission_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'permissions', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      }
    });

    // 4. kategori
    await queryInterface.createTable('kategori', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nama_kategori: { type: Sequelize.STRING, allowNull: false },
      deskripsi: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 5. lokasi
    await queryInterface.createTable('lokasi', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nama_lokasi: { type: Sequelize.STRING, allowNull: false },
      deskripsi: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 6. users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      nama: { type: Sequelize.STRING, allowNull: false },
      role_id: { 
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'roles', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 7. aset
    await queryInterface.createTable('aset', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      kode_aset: { type: Sequelize.STRING, allowNull: false, unique: true },
      nama_aset: { type: Sequelize.STRING, allowNull: false },
      kategori_id: { 
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'kategori', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      lokasi: { type: Sequelize.STRING, allowNull: false },
      tanggal_pengadaan: { type: Sequelize.DATEONLY, allowNull: false },
      kondisi: { type: Sequelize.ENUM('Baik', 'Kurang Baik', 'Rusak', 'Hilang'), allowNull: false, defaultValue: 'Baik' },
      status: { type: Sequelize.ENUM('Tersedia', 'Dipinjam', 'Maintenance', 'Dihapus'), allowNull: false, defaultValue: 'Tersedia' },
      qr_code: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 8. mutasi
    await queryInterface.createTable('mutasi', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aset_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'aset', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      lokasi_lama: { type: Sequelize.STRING, allowNull: false },
      lokasi_baru: { type: Sequelize.STRING, allowNull: false },
      tanggal_mutasi: { type: Sequelize.DATEONLY, allowNull: false },
      keterangan: { type: Sequelize.TEXT, allowNull: true },
      user_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 9. peminjaman
    await queryInterface.createTable('peminjaman', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aset_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'aset', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      user_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      nama_peminjam: { type: Sequelize.STRING, allowNull: true },
      divisi: { type: Sequelize.STRING, allowNull: true },
      tanggal_pinjam: { type: Sequelize.DATEONLY, allowNull: false },
      jadwal_kembali: { type: Sequelize.DATEONLY, allowNull: true },
      tanggal_kembali: { type: Sequelize.DATEONLY, allowNull: true },
      kondisi_kembali: { type: Sequelize.ENUM('Baik', 'Kurang Baik', 'Rusak', 'Hilang'), allowNull: true },
      status: { type: Sequelize.ENUM('Dipinjam', 'Dikembalikan'), allowNull: false, defaultValue: 'Dipinjam' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 10. laporan_kerusakan
    await queryInterface.createTable('laporan_kerusakan', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aset_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'aset', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      user_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      tanggal_lapor: { type: Sequelize.DATEONLY, allowNull: false },
      deskripsi_kerusakan: { type: Sequelize.TEXT, allowNull: false },
      foto_bukti: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.ENUM('Menunggu Review', 'Diproses', 'Selesai', 'Ditolak'), allowNull: false, defaultValue: 'Menunggu Review' },
      catatan_admin: { type: Sequelize.TEXT, allowNull: true },
      teknisi_id: { 
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      pihak_ketiga: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 11. maintenance
    await queryInterface.createTable('maintenance', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      laporan_id: { 
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'laporan_kerusakan', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      aset_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'aset', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      tanggal_maintenance: { type: Sequelize.DATEONLY, allowNull: false },
      tanggal_selesai: { type: Sequelize.DATEONLY, allowNull: true },
      deskripsi: { type: Sequelize.TEXT, allowNull: false },
      tindakan_perbaikan: { type: Sequelize.TEXT, allowNull: true },
      biaya: { type: Sequelize.INTEGER, allowNull: true },
      catatan_hasil: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('Proses', 'Selesai'), allowNull: false, defaultValue: 'Proses' },
      user_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      teknisi_id: { 
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      pihak_ketiga: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 12. jadwal_opname
    await queryInterface.createTable('jadwal_opname', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      judul: { type: Sequelize.STRING, allowNull: false },
      tanggal_mulai: { type: Sequelize.DATEONLY, allowNull: false },
      tanggal_selesai: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.ENUM('Menunggu Approval', 'Berlangsung', 'Selesai'), allowNull: false, defaultValue: 'Menunggu Approval' },
      catatan: { type: Sequelize.TEXT, allowNull: true },
      penanggung_jawab_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 13. stock_opname
    await queryInterface.createTable('stock_opname', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aset_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'aset', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      tanggal_opname: { type: Sequelize.DATEONLY, allowNull: false },
      kondisi_fisik: { type: Sequelize.ENUM('Sesuai', 'Tidak Sesuai', 'Hilang', 'Rusak'), allowNull: false },
      keterangan: { type: Sequelize.TEXT, allowNull: true },
      user_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      jadwal_id: { 
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'jadwal_opname', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      lokasi_id: { 
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'lokasi', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      is_selisih: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 14. penghapusan
    await queryInterface.createTable('penghapusan', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aset_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'aset', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      tanggal_penghapusan: { type: Sequelize.DATEONLY, allowNull: false },
      alasan: { type: Sequelize.TEXT, allowNull: false },
      user_id: { 
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('penghapusan');
    await queryInterface.dropTable('stock_opname');
    await queryInterface.dropTable('jadwal_opname');
    await queryInterface.dropTable('maintenance');
    await queryInterface.dropTable('laporan_kerusakan');
    await queryInterface.dropTable('peminjaman');
    await queryInterface.dropTable('mutasi');
    await queryInterface.dropTable('aset');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('lokasi');
    await queryInterface.dropTable('kategori');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('roles');
  }
};
