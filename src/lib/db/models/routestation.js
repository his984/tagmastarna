'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RouteStation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RouteStation.belongsTo(models.Route)
      RouteStation.belongsTo(models.Station)
    }
  }
  RouteStation.init({
    arrival: DataTypes.INTEGER,
    departure: DataTypes.INTEGER,
    platform: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RouteStation',
  });
  return RouteStation;
};