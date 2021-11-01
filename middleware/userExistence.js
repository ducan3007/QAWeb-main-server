const responseHandler = require('../utils/response');
const User = require('../models/user');


module.exports = async(req, res, next) => {
    const _username = req.body.username;
    try {
        const check = await User.findOne({
            username: _username
        }, { _id: 1 });

        if (check) {
            return res.status(400)
                .json(responseHandler.response(false, 400, 'User already exists', null));
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(err.code)
    }
}