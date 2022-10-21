'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TicketSeat extends Model {

        static associate(models) {
            TicketSeat.belongsTo(models.Ticket);
            TicketSeat.belongsTo(models.Seat);
        }
    }

    TicketSeat.init({
        tripId: DataTypes.STRING,
        type: DataTypes.STRING,
        arrivalEnd: DataTypes.INTEGER,
        seatId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'TicketSeat',
    });
    return TicketSeat;
};