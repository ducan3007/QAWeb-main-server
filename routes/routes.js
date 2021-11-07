const express = require('express')
const auth = require('./auth');
const users = require('./users');
const posts = require('./posts');
const router = express.Router();
const tags = require('./tags');
const answers = require('./answers');
const comments = require('./comments');
const commentsController = require('../controllers/comments');
const userController = require('../controllers/user');
const verifyToken = require('../middleware/verifyToken');
const validator = require('../utils/validator');
const checkOwner = require('../middleware/auth');

router.use('/auth', auth);
router.use('/users', users);
router.use('/posts', posts);
router.use('/tags', tags);
router.use('/posts/answers', answers);
router.use('/posts/comments', comments);

router.post('/answers/comments/:answer_id', [verifyToken, validator.validatorComments], commentsController.addAnswerComment);

router.delete('/answers/comments/:answer_id/:comment_id', verifyToken, commentsController.deleteAnswerComment);

router.get('/users/:id/posts/', userController.getUserPost);

router.get('/answers/comments/:answer_id', commentsController.getAnswerComment);
module.exports = router