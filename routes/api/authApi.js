const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const {
    check,
    validationResult
} = require('express-validator/check');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/userModel');

// @route   GET api/auth
// @desc    auth route
// @access  Public
router.get('/', auth, async (request, response) => {
    try {
        let user = await User.findById(request.user.id).select('-password');
        response.json(user);
    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error')
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        });
    }

    const {
        email,
        password
    } = request.body;

    try {

        // check if user exists
        let user = await User.findOne({
            email
        });

        if (!user) {
            return response.status(400).json({
                errors: [{
                    message: 'Invalid credentials'
                }]
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(400).json({
                errors: [{
                    message: 'Invalid credentials'
                }]
            });
        }

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            response.json({
                token
            })
        });

    } catch (err) {
        console.error(err.message);
        response.status(500).send('Server error');
    }

});

module.exports = router;