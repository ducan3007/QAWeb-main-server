const { check, validationResult } = require('express-validator');
const User = require('../models/user')
const responseHandler = require('../utils/response');
const Post = require('../models/posts');

const register = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400)
            .json(responseHandler.response(false, 400, errors.array()[0].msg, null));
    }
    try {
        await User.register(req.body, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(result.code).json(result);
        })

    } catch (err) {
        console.log(err);
        return res.status(500)
            .json(responseHandler.response(true, 500, 'Sign up failed, try again later', null));
    }
}
const getUsers = (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            User.getOneUser(id, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(err.code).json(err);
                }
                return res.status(data.code).json(data);
            });
        } else {
            User.getAllUser((err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(err.code).json(err);
                }
                return res.status(data.code).json(data);
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json(responseHandler.response(false, 500, 'Server internal error', null))
    }

}
const getUserPost = (req, res) => {
    try {
        Post.getUserPost(req, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(err.code).json(err);
            }
            return res.status(data.code).json(data);
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    register,
    getUsers,
    getUserPost
};