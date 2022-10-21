'use strict';

const {faker} = require("@faker-js/faker");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {


        let sequelize = queryInterface.sequelize;
        let timeTables = [];
        await sequelize.query("SELECT id FROM Routes;", {type: sequelize.QueryTypes.SELECT}).then(async (routes) => {
            let trains = await sequelize.query(`SELECT id
                                                FROM Trains limit ${routes.length};`, {type: sequelize.QueryTypes.SELECT});
            trains.forEach((train, index) => {
                Array.from({length: 3}).map(() => {
                    timeTables.push({
                        trainId: train.id,
                        routeId: routes[index].id,
                        startTime: faker.date.future().toLocaleTimeString("sv-SE", {hour12: false})
                    })
                })
            })
        });
        await queryInterface.bulkInsert('TimeTables', timeTables);


    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('TimeTables', null, {});
    }
};
