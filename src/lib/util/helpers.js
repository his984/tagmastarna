const {validationResult} = require("express-validator");
const db = require("../db/models");

function checkValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return false;
    }

    return true;
}


async function tokenValidator(value, {req}) {

    let user = await db.User.findOne({
        where: {
            token: (value ?? -1)
        }
    })
    if (!user) {
        throw new Error('Please login first');
    }
    req.user = user;
    return true;
}

async function userByToken(token) {
    return await db.User.findOne({
        where: {
            token: (token ?? -1)
        }
    })
}


async function routeWithDetails(from, to) {

    let routeId ;
    let query = `select DISTINCT startStation.routeId, startStation.arrival as start, endStation.arrival as \`end\`
                 from RouteStations endStation
                          INNER JOIN RouteStations startStation ON startStation.routeId = endStation.routeId
                     AND (((startStation.stationId = ${from.id}) AND (endStation.stationId = ${to.id})) AND
                          (endStation.arrival > startStation.arrival OR (startStation.arrival is NULL)));
    `
    let routeWithStartAndEnd = (await db.sequelize.query(query, {type: db.sequelize.QueryTypes.SELECT}))[0]
    if (routeWithStartAndEnd) {
        routeId = routeWithStartAndEnd.routeId;
        routeWithStartAndEnd = await db.RouteStation.findAll({
            where: {
                arrival: {
                    [db.Sequelize.Op.gte]: routeWithStartAndEnd.start,
                    [db.Sequelize.Op.lte]: routeWithStartAndEnd.end,
                    [db.Sequelize.Op.between]: [routeWithStartAndEnd.start - 1, routeWithStartAndEnd.end + 1]
                },
                routeId: routeWithStartAndEnd.routeId,
            },
            include: 'Station'
        });
    }

    return  [  routeId ,  routeWithStartAndEnd  ] ;

}


module.exports = {
    checkValidation,
    tokenValidator,
    userByToken,
    routeWithDetails
}