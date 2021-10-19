const express = require('express');
const { check } = require('express-validator');
const jwtAuth = require('../middleware/verify');
const authController = require('../controllers/auth')

const router = express.Router();

router.get('/', );



module.exports = router;