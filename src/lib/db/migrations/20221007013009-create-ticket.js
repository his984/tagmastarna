'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tickets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tripId: {
                type: Sequelize.STRING
            },
            grade: {
                type: Sequelize.STRING
            },
            cancellable: {
                type: Sequelize.BOOLEAN
            },
            price: {
                type: Sequelize.FLOAT
            },
            departureTime: {
                type: Sequelize.STRING
            },
            arrivalTime: {
                type: Sequelize.STRING
            },
            startPlatform: {
                type: Sequelize.STRING
            },
            endPlatform: {
                type: Sequelize.STRING
            },
            createdAt: {
                type: "TIMESTAMP",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false,
            },
            updatedAt: {
                type: "TIMESTAMP",
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Tickets');
    }
};