const { body, header, param } = require("express-validator");
const db = require("../db/models");
const { tokenValidator } = require("./helpers");
const { validator } = require("sequelize/lib/utils/validator-extras");

let phoneRegex = /^[0-9]{10}$/;

module.exports = {
  emailValidation: body("email").isEmail(),
  emailUniqueValidation: body("email")
    .isEmail()
    .custom((value) => {
      return db.User.findOne({
        where: {
          email: value.toLowerCase(),
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("Email already in use");
        }
      });
    }),
  passwordValidation: body("password").isLength({ min: 8 }),
  phoneValidation: body("phone").custom((value) => {
    return phoneRegex.test(value);
  }),
  nameValidation: body("name").notEmpty({ ignore_whitespace: true }),
  confirmPasswordValidation: body("passwordConfirmation").custom(
    (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }
  ),
  tokenValidation: header("token").custom(tokenValidator),
  emailUpdateValidation: body("email").custom((value, { req }) => {
    return db.User.findOne({
      where: {
        id: {
          [db.Sequelize.Op.not]: req.user.id,
        },
        email: value ? value.toLowerCase() : req.user.email,
      },
    }).then((user) => {
      if (user) {
        return Promise.reject("Email already in use");
      }
    });
  }),
  passwordUpdateValidation: body("password").custom((value, { req }) => {
    let status = false;
    if (!value) status = true;
    else if (
      value.trim().length === 0 &&
      req.body.confirm_password &&
      req.body.confirm_password.trim().length === 0
    ) {
      status = true;
    } else if (
      value.trim().length >= 8 &&
      req.body.confirm_password &&
      req.body.confirm_password.trim().length >= 8 &&
      req.body.confirm_password === value
    ) {
      status = true;
    }
    if (!status) {
      throw new Error(
        "password length must be greater than or equal 8  and equal confirm_password "
      );
    }
    return status;
  }),
  phoneUpdateValidation: body("phone").custom((value, { req }) => {
    if (value && value.trim().length > 8 && !phoneRegex.test(value))
      throw new Error("Phone is incorrect");
    req.body.phone = req.user.phone;
    return true;
  }),
  ticketValidation: param("ticketId")
    .isNumeric()
    .custom(async (value, { req }) => {
      return db.Ticket.findOne({
        where: {
          id: value ?? -1,
          userId: req.user.id ?? -1,
        },
        include: [
          db.Route,
          "startStation",
          "endStation",
          db.Train,
          {
            model: db.TicketSeat,
            include: [{ model: db.Seat, include: [db.Carriage] }],
          },
        ],
      }).then((ticket) => {
        if (ticket) {
          req.ticket = ticket;
        } else {
          return Promise.reject("Ticket isn't found");
        }
      });
    }),
  contactUsValidation: body("contact_us").custom(async (value, { req }) => {
    req.user =
      (await db.User.findOne({
        where: {
          token: req.header("token") ?? -1,
        },
      })) ?? {};
    req.body.name = req.body.name ?? req.user.name;
    req.body.email = req.body.email ?? req.user.email;
    if (
      req.body.name &&
      validator.isEmail(req.body.email) &&
      req.body.content
    ) {
      return true;
    }

    throw new Error("email or content or name are invalid");
  }),
  phoneRegex,
};
