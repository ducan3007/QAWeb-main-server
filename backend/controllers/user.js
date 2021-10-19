const User = require('../models/user')
const { body, validationResult } = require('express-validator');
const responseHandler = require('../utils/response');


const register = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400)
            .json(responseHandler.response(false, 400, errors.array()[0].msg, null));
    }
    try {
        await User.register(req.body, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(result.code).json(result);
        })

    } catch (err) {
        console.log(err);
        return res.status(500)
            .json(responseHandler.response(true, 500, 'Sign up failed, try again later', null));
    }
}
const validatorUser = [
    body('username')
    .exists()
    .trim()
    .withMessage('username is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 5 })
    .withMessage('must be at least 5 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('User name contains invalid characters'),

    body('password')
    .exists()
    .trim()
    .withMessage('password is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('must be at most 50 characters long')

]
module.exports = {
    register,
    validatorUser
};