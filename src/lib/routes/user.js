const express = require('express');
const db = require('../db/models/index')

const { checkValidation} = require("../util/helpers");
const {
    tokenValidation,
    emailUpdateValidation, passwordUpdateValidation, phoneUpdateValidation, ticketValidation
} = require("../util/common-validations");
const {hash} = require("../util/enc_dec");
const userRoute = express.Router();


userRoute.get("/profile", tokenValidation, async (_req, res) => {
    if (!checkValidation(_req, res)) return;
    _req.user.password = undefined;
    res.status(200).json(_req.user);
})

userRoute.post("/profile",
    tokenValidation,
    phoneUpdateValidation,
    emailUpdateValidation,
    passwordUpdateValidation,
    async (_req, res) => {
        if (!checkValidation(_req, res)) return;
        _req.user.name = _req.body.name ?? _req.user.name ;
        _req.user.phone = _req.body.phone ?? _req.user.phone;
        _req.user.email = (_req.body.email ?? _req.user.email).toLowerCase();
        if ( _req.body.password &&  _req.body.password.trim().length > 0) {
            _req.user['password'] = hash(_req.body.password.trim())
        }
        _req.user.save();
        _req.user.password = undefined;
        res.status(200).json(_req.user);
    });




userRoute.get("/tickets",
    tokenValidation,
    async (_req, res) => {
    if (!checkValidation(_req, res)) return;
    res.status(200).json(  await _req.user.getTickets({
        include : [db.Route, "startStation", "endStation"]
    }) );
})

userRoute.get("/get-ticket/:ticketId",
    tokenValidation,
    ticketValidation
    , async (_req, res) => {
        if (!checkValidation(_req, res)) return;
    res.status(200).json(_req.ticket);
});


// ------------- wait until finish other routes
// userRoute.post("/cancel-ticket/:ticketId",
//     tokenValidation,
//     ticketValidation
//     ,async (_req, res) => {
//     res.status(200).json({});
// });


module.exports = userRoute;