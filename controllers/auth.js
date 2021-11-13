const responseHandler = require("../utils/response");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const userExistence = require("../middleware/userExistence");

const login = (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res
            .status(400)
            .json(responseHandler.response(false, 400, err.array()[0].msg, null));
    }
    try {
        User.login(req.body, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(true, 500, "server error", null));
    }
};
const loadUser = (req, res) => {
    try {
        User.loadUser(req.user.id, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(true, 500, "server error", null));
    }
};
module.exports = authController = {
    login,
    loadUser,
};