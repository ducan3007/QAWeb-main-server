const { body, check, validationResult } = require('express-validator');

module.exports.validatorUser = [
    check('username')
    .exists()
    .trim()
    .withMessage('Username is required')

    .notEmpty()
    .withMessage('Username cannot be blank')

    .isLength({ min: 5 })
    .withMessage('User name must be at least 5 characters long')

    .isLength({ max: 16 })
    .withMessage('Username must be at most 16 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('User name contains invalid characters'),

    check('password')
    .exists()
    .trim()
    .withMessage('Password is required')

    .notEmpty()
    .withMessage('Password cannot be blank')

    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('Password must be at most 50 characters long')

];

module.exports.validatorPost = [
    check('title')
    .exists()
    .trim()
    .withMessage('Post title is required')

    .notEmpty()
    .withMessage('Post title cannot be blank')

    .isLength({ min: 10 })
    .withMessage('Post title must be at least 10 characters long')
    .isLength({ max: 200 })
    .withMessage('Post title must be at most 200 characters long'),
    check('body')
    .exists()
    .trim()
    .withMessage('Please enter valid body !')

    .notEmpty()
    .withMessage('Please enter valid body !')

    .isLength({ min: 10 })
    .withMessage('Body must be at least 10 characters long')
    .isLength({ max: 1500 })
    .withMessage('Body is at most 1500 character long'),

    check('tagname')
    .exists()
    .trim()
    .withMessage('Please enter valid tagname !')

    .notEmpty()
    .withMessage('Please enter valid tagname !')
    .toLowerCase()

    .isLength({ max: 50 })
    .withMessage('Tagname is too long')
    .matches(/^[a-zA-Z0-9#++.-]+([^,~!@$%^&*()_=/\\ ]*,[^,@#/\\. ][a-zA-Z0-9#++.-]*){0,5}$/)
    // .matches(/^[a-zA-Z0-9#++]+([^, ]*,[^, ]*){0,5}$/)
    .withMessage("Please enter valid tagname !")

];
module.exports.validatorAnswers = [
    check('text')
    .exists()
    .trim()
    .withMessage('Answers is required')

    .notEmpty()
    .withMessage('Answers cannot be blank')

    .isLength({ min: 5 })
    .withMessage('answers must be at least 15 characters long')

    .isLength({ max: 4000 })
    .withMessage('Answers is too long'),
];
module.exports.validatorComments = [
    check('body')
    .exists()
    .trim()
    .withMessage('comment is required')

    .notEmpty()
    .withMessage('comment cannot be blank')

    .isLength({ min: 5 })
    .withMessage('commnet must be at least 5 characters long')

    .isLength({ max: 200 })
    .withMessage('comment too long'),
];