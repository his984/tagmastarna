'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Ticket.belongsTo(models.Route);
            Ticket.belongsTo(models.User);
            Ticket.hasMany(models.TicketSeat);
            Ticket.belongsTo(models.Train);
            Ticket.belongsTo(models.Station, {
                as: "startStation",
                foreignKey: {
                    name: "startStationId",
                    allowNull: false
                }
            });
            Ticket.belongsTo(models.Station, {
                as: "endStation",
                foreignKey: {
                    name: "endStationId",
                    allowNull: false
                }
            });

        }
    }

    Ticket.init({
        grade: DataTypes.STRING,
        cancellable: DataTypes.BOOLEAN,
        arrivalTime: DataTypes.STRING,
        departureTime: DataTypes.STRING,
        startPlatform: DataTypes.STRING,
        endPlatform: DataTypes.STRING,
        price: DataTypes.FLOAT,
        tripId: DataTypes.STRING,
        routeId: DataTypes.INTEGER,
        trainId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Ticket',
    });
    return Ticket;
};