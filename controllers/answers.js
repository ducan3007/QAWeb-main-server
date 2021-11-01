const { validationResult } = require('express-validator');
const responseHandler = require('../utils/response');
const Answers = require('../models/answers');

const addAnswer = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(responseHandler.response(false, 400, errors.array()[0].msg, null));
    }
    try {
        Answers.addAnswers(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        })
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(false, 500, 'Server Error', null));
    }
}
const getAnswer = (req, res) => {
    try {
        Answers.getAnswer(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {

    }
}
module.exports = answersController = {
    addAnswer,
    getAnswer
}