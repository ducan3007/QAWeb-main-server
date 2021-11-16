const express = require('express')
const router = express.Router();
const userExistence = require('../middleware/userExistence');
const commentsController = require('../controllers/comments');
const answersController = require('../controllers/answers');
const postController = require('../controllers/posts');
const userController = require('../controllers/user');
const tagController = require('../controllers/tags');
const commentController = require('../controllers/comments');
const authController = require('../controllers/auth')
const verifyToken = require('../middleware/verifyToken');
const validator = require('../utils/validator');

//authentication
router.get('/auth', verifyToken, authController.loadUser);
router.post('/auth', validator.validatorUser, authController.login)

//questions
router.get('/posts', postController.getPosts);
router.get('/posts/top', postController.getPosts);
router.get('/posts/:post_id', postController.getOnePost);
router.get('/posts/tag/:tagname', postController.getPosts);
router.post('/posts', [verifyToken, validator.validatorPost], postController.addPost);

router.get('/posts/comments/:post_id', commentController.getPostComment);
router.post('/posts/comments/:post_id', verifyToken, validator.validatorComments, commentController.addPostComment);

router.get('/posts/answers/:id', answersController.getAnswer);
router.post('/posts/answers/:id', [verifyToken, validator.validatorAnswers], answersController.addAnswer);

router.delete('/posts/:post_id', verifyToken, answersController.deletePost);
router.delete('/posts/answers/:answer_id', verifyToken, answersController.deleteAnswer);
router.delete('/posts/comments/:post_id/:comment_id', verifyToken, commentController.deletePostComment);

//users
router.get('/users', userController.getUsers);
router.post('/users', [validator.validatorUser, userExistence], userController.register);

router.get('/users/:id', userController.getUsers);
router.get('/users/:id/posts/', userController.getUserPost);

//tags
router.get('/tags', tagController.getAllTags);
router.get('/tags/:tagname', tagController.getOneTags);

//answers
router.get('/answers/comments/:answer_id', commentsController.getAnswerComment);
router.post('/answers/comments/:answer_id', [verifyToken, validator.validatorComments], commentsController.addAnswerComment);

router.delete('/answers/comments/:answer_id/:comment_id', verifyToken, commentsController.deleteAnswerComment);

//votes
router.get('/vote/post/:post_id/:action/', verifyToken, postController.votePost);
router.get('/vote/answer/:answer_id/:action/', verifyToken, answersController.voteAnswer);

module.exports = router
