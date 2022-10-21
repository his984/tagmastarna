'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Tickets', Array.from({length : 4 }).map(() => {
    //     return {
    //       information : JSON.stringify({}),
    //       userId : 1
    //     }
    //
    // }), {});
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('Tickets', null, {});
  }
};
