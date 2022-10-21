'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('Routes', [
            {
                name: "Stockholm C - Göteborg C"
            },
            {
                name: "Göteborg C - Stockholm C"
            },
            {
                name: "Göteborg C - Hyllie"
            },
            {
                name: "Hyllie - Göteborg C"
            },
            {
                name: "Helsingborg C - Trelleborg"
            },
            {
                name: "Trelleborg - Helsingborg C"
            },
        ]);


    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Routes', null, {});
    }
};
