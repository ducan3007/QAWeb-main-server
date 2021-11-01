const express = require('express');
const { check } = require('express-validator');
const userExistence = require('../middleware/userExistence');
const validator = require('../utils/validator');
const user = require('../controllers/user')

const router = express.Router();

router.get('/', user.getUsers);

router.get('/:id', user.getUsers);


router.post('/', [validator.validatorUser, userExistence], user.register);


module.exports = router;