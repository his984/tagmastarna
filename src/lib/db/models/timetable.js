'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeTable extends Model {
    static associate(models) {
        TimeTable.belongsTo(models.Route);
        TimeTable.belongsTo(models.Train);
    }
  }

  TimeTable.init({
    startTime: DataTypes.TIME,
    weekends: DataTypes.JSON,
    trainId : DataTypes.INTEGER,
    routeId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TimeTable',
  });
  return TimeTable;
};