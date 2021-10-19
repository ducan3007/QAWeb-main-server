const express = require('express');
const { check } = require('express-validator');
const userExistence = require('../middleware/userExistence');
const user = require('../controllers/user');

const router = express.Router();



router.post('/', user.validatorUser, userExistence, user.register, );


module.exports = router;