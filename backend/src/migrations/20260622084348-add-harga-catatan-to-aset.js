'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('aset', 'harga', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.addColumn('aset', 'catatan', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('aset', 'harga');
    await queryInterface.removeColumn('aset', 'catatan');
  }
};
