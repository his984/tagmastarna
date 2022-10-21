'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Station extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Station.belongsToMany(models.Route, {
                through: models.RouteStation
            })
            Station.hasMany(models.Ticket, {
                as: "startTickets",
                foreignKey: {
                    name: "startStationId",
                    allowNull: false
                }
            });
            Station.hasMany(models.Ticket, {
                as: "endTickets",
                foreignKey: {
                    name: "endStationId",
                    allowNull: false
                }
            });
        }
    }

    Station.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Station',
    });
    return Station;
};