const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const auth = require('../middleware/auth');
const validator = require('../utils/validator');
const answers = require('../controllers/answers');
const comments = require('../controllers/comments');

const router = express.Router();

router.post('/:id', [verifyToken, validator.validatorAnswers], answers.addAnswer);
router.get('/:id', answers.getAnswer);

router.post('/:post_id', answers.getAnswer);

module.exports = router;