const { validationResult } = require('express-validator');
const responseHandler = require('../utils/response');
const Post = require('../models/posts');


const addPost = (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res
            .status(400)
            .json(responseHandler.response(false, 400, err.array()[0].msg, null));
    }
    try {
        Post.createPost(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        })


    } catch (err) {
        console.log(err);
        return res.status(500)
            .json(responseHandler.response(false, 500, 'Server Error', null));
    }

}

const getPosts = (req, res) => {
    try {
        Post.getPosts(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        })
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(true, 500, 'server error', null));
    }
}
const getOnePost = (req, res) => {
    try {
        Post.getOnePost(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        })
    } catch (err) {
        return res
            .status(500)
            .json(responseHandler.response(true, 500, 'server error', null));
    }
}

const votePost = (req, res) => {
    try {
        Post.vote(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        })
    } catch (err) {
        return res
            .status(500)
            .json(responseHandler.response(true, 500, 'server error', null));
    }
}

module.exports = postController = {
    addPost,
    getPosts,
    getOnePost,
    votePost
    // deletePost
}