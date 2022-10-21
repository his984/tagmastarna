const faker =  require('@faker-js/faker').faker

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    function createRandomUser() {
      return {
        name: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number("073#######"),
        password: "$2b$06$mL2b7N/75xSKR.EgN3VcyOZx42OyoMWdjpzBCnLIQtTYkm0S7e5ea", // password
      };
    }


    await  queryInterface.bulkInsert('Users' ,     Array.from( {length:10}).map(() => createRandomUser() ));

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Users', null, {});
  }
};
