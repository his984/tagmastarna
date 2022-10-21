const faker =  require('@faker-js/faker').faker

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {



    await queryInterface.bulkInsert('Trains', Array.from({length : 6 }).map(()=>{
      return {
        name : faker.word.noun(10)
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Trains', null, {});
  }
};
