const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/auth');
const validator = require('../utils/validator');
const post = require('../controllers/posts');
const router = express.Router();


// router.get('/', post.)

router.post('/', [verifyToken, validator.validatorPost], post.addPost);
router.delete('/:post_id', verifyToken, post.deletePost);


router.get('/', post.getPosts);
router.get('/top', post.getPosts);
router.get('/tag/:tagname', post.getPosts);
router.get('/:post_id', post.getOnePost);


module.exports = router;