const express = require('express');
const comments = require('../controllers/comments');

const verifyToken = require('../middleware/verifyToken');
const validator = require('../utils/validator');

const router = express.Router();

router.post('/:post_id', verifyToken, validator.validatorComments, comments.addPostComment);

router.get('/:post_id', comments.getPostComment);




module.exports = router;