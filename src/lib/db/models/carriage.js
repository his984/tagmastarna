'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carriage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Carriage.hasMany(models.Seat)
      Carriage.belongsTo(models.Train)
    }
  }
  Carriage.init({
    carriageNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Carriage',
  });
  return Carriage;
};