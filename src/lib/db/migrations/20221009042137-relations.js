'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Tickets', "routeId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Routes',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }),
                queryInterface.addColumn('Tickets', "trainId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Trains',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }),
                queryInterface.addColumn('Carriages', "trainId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Trains',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('Seats', "carriageId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Carriages',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('TicketSeats', "ticketId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Tickets',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('TicketSeats', "seatId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Seats',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('RouteStations', "routeId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Routes',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('RouteStations', "stationId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Stations',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('TimeTables', "routeId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Routes',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('TimeTables', "trainId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Trains',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('Tickets', "userId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Users',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',

                }, {transaction: t}),
                queryInterface.addColumn('Tickets', "startStationId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Stations',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),
                queryInterface.addColumn('Tickets', "endStationId", {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Stations',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                }, {transaction: t}),


            ]);
        });
    },


    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
        //  */
        // await Promise.all([
        //     queryInterface.removeColumn('Tickets', "userId"),
        //     queryInterface.removeColumn('Trains', "routeId"),
        //     queryInterface.removeColumn('Carriages', "trainId"),
        //     queryInterface.removeColumn('Seats', "carriageId"),
        //     queryInterface.removeColumn('TicketRoutes', "routeId"),
        //     queryInterface.removeColumn('TicketRoutes', "ticketId"),
        //     queryInterface.removeColumn('TicketRoutes', "seatId"),
        //     queryInterface.removeColumn('TicketRoutes', "startStationId"),
        //     queryInterface.removeColumn('TicketRoutes', "endStationId"),
        //     queryInterface.removeColumn('RouteStations', "routeId"),
        //     queryInterface.removeColumn('RouteStations', "stationId"),
        //     queryInterface.removeColumn('TimeTables', "routeId"),
        // ]);
    }
}
;
