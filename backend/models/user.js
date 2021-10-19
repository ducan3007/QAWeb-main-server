const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const responseHandler = require('../utils/response');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    views: { type: Number, default: 0 },
    created: { type: Date, default: Date.now }
})

const User = module.exports = mongoose.model('users', userSchema);

module.exports.register = async(newUser, result) => {
    const salt = bcrypt.genSaltSync(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    newUser.username = newUser.username.toLowerCase();
    const user = new User(newUser);
    console.log(user._id.toString());
    try {
        const savedUser = await user.save();
        if (savedUser) {
            const payload = {
                user: {
                    id: user._id
                }
            }
            jwt.sign(payload, process.env.KEY, { expiresIn: 7200 }, (error, token) => {
                if (error) {
                    console.log(`Jwt error : ${error}`);
                    result(responseHandler.response(false, error.code, error.message, null), null);
                    return;
                }
                result(null, responseHandler.response(true, 200, 'User sigup successfully', { token }))
            })
        }
    } catch (err) {
        console.log(`User signup error : ${error}`);

    }
}