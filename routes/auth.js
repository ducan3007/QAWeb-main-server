const express = require('express');
const { check } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');
const authController = require('../controllers/auth')
const validator = require('../utils/validator');
const router = express.Router();

router.get('/', verifyToken, authController.loadUser);

router.post('/', validator.validatorUser, authController.login)

module.exports = router;