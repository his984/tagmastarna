const express = require("express");
const db = require("../db/models/index");
const authRoute = require("./auth");
const userRoute = require("./user");
const {
  contactUsValidation,
  phoneRegex,
} = require("../util/common-validations");
const {
  checkValidation,
  userByToken,
  routeWithDetails,
} = require("../util/helpers");
const { param, header, body } = require("express-validator");
const { validator } = require("sequelize/lib/utils/validator-extras");
const { hash } = require("../util/enc_dec");
const router = express.Router();
const dateParse = require("date-and-time");
const { Op } = require("sequelize");

router.use("/auth", authRoute);
router.use("/user", userRoute);


// timetable  get all timeTable rows
router.get("/timetable", async (_req, res) => {
  res.status(200).json(
    await db["TimeTable"].findAll({
      include: [db.Route, db.Train],
    })
  );
});




// stations
router.get("/stations", async (_req, res) => {
  res.status(200).json(await db["Station"].findAll());
});





// search for route
router.get("/routes/:from/:to", async (_req, res) => {
  let from = parseInt(_req.params.from);
  let to = parseInt(_req.params.to);
  from = await db.Station.findByPk(from);
  to = await db.Station.findByPk(to);
  if (!from || !to) {
    res.status(400).json({
      message: "stations error",
    });
  }
  let routeDetails = await routeWithDetails(from, to);
  if (routeDetails[0] && routeDetails[1]) {
    let timeTable = await db.TimeTable.findAll({
      where: {
        routeId: routeDetails[0],
      },
    });
    res.status(200).json({ route: routeDetails[1], timeTable });
    return;
  }
  res.status(200).json({ message: "No routes founded" });
});






// train capacity
router.get(
  "/seats/:timetableId/:day/:startStation/:endStation",
  param("timetableId")
    .isNumeric()
    .custom((value, { req }) => {
      return db.TimeTable.findOne({
        where: {
          id: value ?? -1,
        },
      }).then((timeTable) => {
        if (timeTable) {
          req.timeTable = timeTable;
        } else {
          return Promise.reject("selected time  isn't found");
        }
      });
    }),
  param("day")
    .isString()
    .notEmpty()
    .custom((value) => {
      return /^20[0-9]{2}-[0-9]{1,2}-[0-9]{1,2}$/.test(value);
    }),
  async (_req, res) => {
    if (!checkValidation(_req, res)) return;
    let routeDetails = await routeWithDetails(
      await db.Station.findByPk(_req.params.startStation),
      await db.Station.findByPk(_req.params.endStation)
    );
    if (!routeDetails[1] || routeDetails[1].length === 0) {
      return res.status(400).json({
        message: "please select valid stations",
      });
    }

    let usedSeats = (
      await db.TicketSeat.findAll({
        where: {
          tripId: `${_req.timeTable.startTime}-${_req.params.day}-${_req.timeTable.TrainId}-${_req.timeTable.RouteId}`,
          arrivalEnd: {
            [db.Sequelize.Op.gte]:
              routeDetails[1][routeDetails[1].length - 1].arrival,
          },
        },
        include: db.Seat,
      })
    ).map((ticketSeat) => {
      return { used: true, ...ticketSeat.Seat.dataValues };
    });

    //console.log(usedSeats.map((seat) => seat.id))
    let allSeats = usedSeats;
    (
      await db.Carriage.findAll({
        where: {
          trainId: _req.timeTable.TrainId,
        },
        include: [
          {
            model: db.Seat,
            where: {
              id: {
                [Op.notIn]: usedSeats.map((seat) => seat.id),
              },
            },
          },
        ],
      })
    ).map((c) => {
      c.Seats.map((s) => {
        allSeats.push({ used: false, ...s.dataValues });
      });
    });
    allSeats = allSeats
      .map((seat) => {
        return {
          ...seat,
          isSelected: false,
        };
      })
      .sort((a, b) => a.id - b.id);
    res.status(200).json({
      allSeats,
    });
  }
);






// book
router.post(
  "/book",
  header("token").custom((value, { req }) => {
    return userByToken(value ?? -1).then(async (user) => {
      if (user) req.user = user;
      else if (
        req.body.name &&
        validator.isEmail(req.body.email) &&
        phoneRegex.test(req.body.phone)
      ) {
        req.user = (
          await db.User.findOrCreate({
            where: {
              email: req.body.email,
            },
            defaults: {
              name: req.body.name,
              phone: req.body.phone,
              password: hash("password"),
            },
          })
        )[0];
      } else {
        return Promise.reject("name or email or phone are not correct");
      }
    });
  }),
  body("ticket").custom((value, { req }) => {
    if (!(value && value.grade && value.day && value.seats && value.seats[0]))
      throw new Error("please set ticket information");
    let priceM = value.grade === "F" ? 3.0 : 2.0;
    priceM *= value.cancellable ? 1.2 : 1.0;
    let validate = async () => {
      let from = await db.Station.findByPk(value.startStationId);
      let to = await db.Station.findByPk(value.endStationId);
      if (!from || !to) {
        throw new Error("please set stations");
      }
      let timeTable = await db.TimeTable.findByPk(value.timeTableId);
      if (!timeTable) {
        throw new Error("please set timeTableId");
      }
      let routeDetails = await routeWithDetails(from, to);
      if (routeDetails[0] !== parseInt(value.routeId) || !routeDetails[1]) {
        return Promise.reject("Please Select a valid route");
      }

      // check if any seats are used

      let usedSelectedSeats = await db.TicketSeat.count({
        where: {
          seatId: value.seats.map((s) => s.seatId),
          tripId: `${timeTable.startTime}-${value.day}-${timeTable.TrainId}-${timeTable.RouteId}`,
          arrivalEnd: {
            [db.Sequelize.Op.lte]:
              routeDetails[1][routeDetails[1].length - 1].arrival,
          },
        },
      });
      if (usedSelectedSeats > 0) {
        throw new Error("can't book a seat many times in same route");
      }

      let usedSeats = await db.TicketSeat.count({
        where: {
          tripId: `${timeTable.startTime}-${value.day}-${timeTable.TrainId}-${timeTable.RouteId}`,
          arrivalEnd: {
            [db.Sequelize.Op.lte]:
              routeDetails[1][routeDetails[1].length - 1].arrival,
          },
        },
      });

      priceM *= 1.5 - usedSeats / 80;
      req.bookInfo = {
        priceM,
        minutes:
          routeDetails[1][routeDetails[1].length - 1].arrival -
          routeDetails[1][0].departure,
        timeTable,
        routeDetails,
        tripId: `${timeTable.startTime}-${value.day}-${timeTable.TrainId}-${timeTable.RouteId}`,
      };
    };

    return validate();
  }),
  async (_req, res) => {
    if (!checkValidation(_req, res)) return;
    let priceList = {
      p: 0.9,
      s: 0.85,
      y: 0.85,
      b: 0.5,
    };
    let gPrice = _req.bookInfo.priceM * _req.bookInfo.minutes;
    let totalPrice = 0;
    _req.body.ticket.seats.forEach((seat) => {
      totalPrice +=
        gPrice *
        (priceList[seat.type.toLowerCase()]
          ? priceList[seat.type.toLowerCase()]
          : 1.0);
    });
    let departureTime = dateParse.parse(
      _req.body.ticket.day + " " + _req.bookInfo.timeTable.startTime,
      "YYYY-MM-DD HH:mm:ss"
    );
    let ticket = await db.Ticket.create(
      {
        tripId: _req.bookInfo.tripId,
        grade: _req.body.ticket.grade,
        cancellable: _req.body.ticket.cancellable,
        price: totalPrice,
        departureTime: dateParse
          .addMinutes(departureTime, _req.bookInfo.routeDetails[1][0].departure)
          .toLocaleString("sv-SE"),
        arrivalTime: dateParse
          .addMinutes(
            departureTime,
            _req.bookInfo.routeDetails[1][
              _req.bookInfo.routeDetails[1].length - 1
            ].arrival
          )
          .toLocaleString("sv-SE"),
        startStationId: _req.bookInfo.routeDetails[1][0].StationId,
        endStationId:
          _req.bookInfo.routeDetails[1][
            _req.bookInfo.routeDetails[1].length - 1
          ].StationId,
        userId: _req.user.id,
        trainId: _req.bookInfo.timeTable.trainId,
        routeId: _req.bookInfo.timeTable.routeId,
        startPlatform: _req.bookInfo.routeDetails[1][0].platform,
        endPlatform:
          _req.bookInfo.routeDetails[1][
            _req.bookInfo.routeDetails[1].length - 1
          ].platform,
        TicketSeats: _req.body.ticket.seats.map((seat) => {
          return {
            tripId: _req.bookInfo.tripId,
            seatId: seat.seatId,
            type: seat.type,
            arrivalEnd:
              _req.bookInfo.routeDetails[1][
                _req.bookInfo.routeDetails[1].length - 1
              ].arrival,
          };
        }),
      },
      {
        include: [db.TicketSeat],
      }
    );

    res.status(200).json(ticket);
  }
);




// contact us
router.post("/contact-us", contactUsValidation, async (_req, res) => {
  if (!checkValidation(_req, res)) return;
  await db.ContactUs.create({
    name: _req.body.name,
    email: _req.body.email,
    content: _req.body.content,
  });
  res.status(200).json({
    message: "Thank you for your message",
  });
});

module.exports = router;
