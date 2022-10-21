const express = require('express');
const db = require('../db/models/index')
const authRoute = express.Router();
const {compare, hash} = require("../util/enc_dec");
const {checkValidation} = require("../util/helpers");
const {
    emailValidation, passwordValidation, emailUniqueValidation, nameValidation, confirmPasswordValidation, phoneValidation,
    tokenValidation
} = require("../util/common-validations");


authRoute.post("/login",
    emailValidation,
    passwordValidation,
    async (_req, res) => {
        if (!checkValidation(_req, res)) return;
        let email = _req.body.email.toLowerCase();
        let password = _req.body.password;
        let user = await db.User.findOne({
            where: {
                email
            }
        })
        if (user && compare(password, user.password)) {
            let token = hash(user.email + (new Date()).toUTCString())
            await db.User.update({token}, {
                where: {
                    id: user.id
                }
            })
            user.password = undefined;
            user.token = token;
            return res.status(200).json(user);
        }
        return res.status(400).json({
            message: "email or password are incorrect"
        });
    });
authRoute.post("/login-by-token",
    tokenValidation,
    async (_req, res) => {
        if (!checkValidation(_req, res)) return;
        return res.status(200).json(_req.user);
    });
authRoute.post("/signup",
    emailUniqueValidation,
    nameValidation,
    phoneValidation,
    passwordValidation,
    confirmPasswordValidation,
    async (_req, res) => {
        if (!checkValidation(_req, res)) return;
        let user = await db.User.create({
            email: _req.body.email.toLowerCase(),
            name: _req.body.name,
            phone: _req.body.phone,
            password: hash(_req.body.password),
            token: hash(_req.body.email + (new Date()).toUTCString())
        })
        user.password = undefined;
        res.status(200).json(user);
    })


authRoute.post("/logout", tokenValidation, async (_req, res) => {
    if (!checkValidation(_req, res)) return;
    _req.user.token = 'null';
    _req.user.save()
    return res.status(200).json({
        message: "logout successfully"
    });
})

module.exports = authRoute;