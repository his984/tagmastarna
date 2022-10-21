'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Train extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Train.hasMany(models.Carriage);
      Train.hasMany(models.TimeTable);

    }
  }
  Train.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Train',
  });
  return Train;
};