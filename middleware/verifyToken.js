const responseHandler = require('../utils/response');
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res
            .status(401)
            .json(responseHandler.response(false, 401, 'Require Sign in!', null));
    }
    try {
        jwt.verify(token, process.env.KEY, (error, decoded) => {
            if (error) {
                return res
                    .status(400)
                    .json(responseHandler.response(false, 400, 'Verify token failed!', null));
            }
            req.user = decoded.user;
            next();
        })
    } catch (err) {
        console.error(`error: ${err}`);
        return res
            .json(500)
            .json(responseHandler.response(false, 500, 'Some thing wrong', null), );
    }

};