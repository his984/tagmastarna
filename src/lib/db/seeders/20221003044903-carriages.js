const faker = require('@faker-js/faker').faker

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        let carriages = [];
        await queryInterface.sequelize.query('select id from Trains', {type: queryInterface.sequelize.QueryTypes.SELECT}).then((trains) => {

            trains.forEach((train) => {
                Array.from({length: 4}).forEach(() => {
                    carriages.push({
                        carriageNumber: faker.random.alpha({count: 1, casing: 'upper'}),
                        trainId: train.id
                    })
                })

            })
        })
        // console.log(carriages);
        await queryInterface.bulkInsert('Carriages', carriages);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Carriages', null, {});
    }
};
