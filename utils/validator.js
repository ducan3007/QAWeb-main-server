const { body, check, validationResult } = require('express-validator');

module.exports.validatorUser = [
    check('username')
    .exists()
    .trim()
    .withMessage('username is required')

    .notEmpty()
    .withMessage('username cannot be blank')

    .isLength({ min: 5 })
    .withMessage('must be at least 5 characters long')

    .isLength({ max: 16 })
    .withMessage('must be at most 16 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('User name contains invalid characters'),

    check('password')
    .exists()
    .trim()
    .withMessage('password is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('must be at most 50 characters long')

];

module.exports.validatorPost = [
    check('title')
    .exists()
    .trim()
    .withMessage('title is required')

    .notEmpty()
    .withMessage('title cannot be blank')

    .isLength({ min: 10 })
    .withMessage('title must be at least 5 characters long'),

    check('body')
    .exists()
    .trim()
    .withMessage('body is required')

    .notEmpty()
    .withMessage('body cannot be blank')

    .isLength({ min: 30 })
    .withMessage('body must be at least 30 characters long'),

    check('tagname')
    .exists()
    .trim()
    .withMessage('tagname is required')

    .notEmpty()
    .withMessage('tagname cannot be blank')
    .toLowerCase()

    .isLength({ max: 100 })
    .withMessage('tagname too long')
    .matches('^[a-zA-Z0-9]+([^,]*,[^,]*){0,4}$')
    .withMessage("You can only add up to 5 tags")

];
module.exports.validatorAnswers = [
    check('text')
    .exists()
    .trim()
    .withMessage('answers is required')

    .notEmpty()
    .withMessage('answers cannot be blank')

    .isLength({ min: 5 })
    .withMessage('answers must be at least 15 characters long')

    .isLength({ max: 1000 })
    .withMessage('answers too long'),
];
module.exports.validatorComments = [
    check('body')
    .exists()
    .trim()
    .withMessage('comment is required')

    .notEmpty()
    .withMessage('comment cannot be blank')

    .isLength({ min: 5 })
    .withMessage('commnet must be at least 15 characters long')

    .isLength({ max: 200 })
    .withMessage('comment too long'),
];