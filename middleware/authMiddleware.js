const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (request, response, next) {
    // get token from the header
    const token = request.header('x-auth-token');

    // check if there is no token
    if (!token) {
        return response.status(401).json({
            message: 'No token, authorization denied'
        });
    }

    // verify token
    try {

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        request.user = decoded.user;
        next();

    } catch (err) {

        response.status(401).json({
            message: 'Token is invalid'
        });

    }
};