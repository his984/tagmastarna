'use strict';

const faker = require('@faker-js/faker').faker
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        let sequelize = queryInterface.sequelize;
        let seats = [];
        await sequelize.query("SELECT id, carriageNumber  FROM Carriages;", {type: sequelize.QueryTypes.SELECT}).then((carriages) => {
            carriages.forEach((carriage) => {
                Array.from({length: 20}).map(( x , index ) => {
                    seats.push({
                        seatNumber: carriage.carriageNumber + ( index + 1  ),
                        carriageId: carriage.id
                    })
                })
            })
        })
        await queryInterface.bulkInsert('Seats', seats);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Seats', null, {});
    }
};
