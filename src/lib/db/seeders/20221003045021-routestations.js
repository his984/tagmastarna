'use strict';

const fs = require("fs");
 require("path")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let routes = JSON.parse(fs.readFileSync( __dirname + "/data.json"))
    let routesStations = [] ;
    let routesNames = Object.keys(routes);
    routesNames =   await queryInterface.sequelize.query(`select id as \`key\`  , name from Routes where name in ( "${ routesNames.join('","') }" ) `, {type: queryInterface.sequelize.QueryTypes.SELECT})
      for (const routeName of routesNames) {
           let stationsInfo = routes[routeName.name];
           let stationsDbResult =  await queryInterface.sequelize.query(`select id as \`key\`  , name from Stations where name in ( "${ stationsInfo.map((s) => s.station).join('","') }" ) `, {type: queryInterface.sequelize.QueryTypes.SELECT})
            stationsInfo.forEach((stationInfo) => {
                  let stationResultDb = stationsDbResult.find( (sdr) => {
                        return  sdr.name === stationInfo.station
                  });
                  if(stationResultDb){
                    delete  stationInfo.station ;
                    if (stationInfo.arrival == null  ) stationInfo.arrival = 0 ;
                    routesStations.push( {
                      routeId : routeName.key,
                      ...stationInfo,
                      stationId : stationResultDb.key,
                    });
                  }
            });
    }
      await  queryInterface.bulkInsert('RouteStations' ,  routesStations )

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('RouteStations', null, {});
  }
};
