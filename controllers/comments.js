const { validationResult } = require("express-validator");
const responseHandler = require("../utils/response");
const Post = require("../models/posts");
const Answer = require("../models/answers");

const addPostComment = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(responseHandler.response(false, 400, errors.array()[0].msg, null));
    }
    try {
        Post.addPostComment(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(false, 500, "Server Error", null));
    }
};
const getPostComment = (req, res) => {
    try {
        Post.getPostComments(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(false, 500, "Server Error", null));
    }
};
const addAnswerComment = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(responseHandler.response(false, 400, errors.array()[0].msg, null));
    }
    try {
        Answer.addAnswerComment(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(false, 500, "Server Error", null));
    }
};
const getAnswerComment = (req, res) => {
    try {
        Answer.getAnswerComment(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json(responseHandler.response(false, 500, "Server Error", null));
    }
};
const deleteAnswerComment = (req, res) => {
    try {
        Answer.deleteAnswercomment(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
const deletePostComment = (req, res) => {
    try {
        Post.deletePostComment(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

module.exports = commentsController = {
    addPostComment,
    getPostComment,
    addAnswerComment,
    getAnswerComment,
    deleteAnswerComment,
    deletePostComment,
};