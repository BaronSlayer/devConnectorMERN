const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('config');
const passport = require('passport');

// Load input validation
// const validateRegisterInput = require('../../validation/registerValidation');
// const validateLoginInput = require('../../validation/loginValidation');

// Load User model
const User = require('../../models/userModel');

// @route   GET api/users
// @desc    Tests users route
// @access  Public
router.get('/', (request, response) => response.send('User Route'));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        password
    } = request.body;

    try {

        // check if user exists
        let user = await User.findOne({
            email
        });

        if (user) {
            return response.status(400).json({
                errors: [{
                    message: 'User already exists'
                }]
            });
        }

        // get gravatar for the user
        const avatar = gravatar.url(request.body.email, {
            s: '200', // size
            r: 'pg', // rating
            d: 'mm' // default no picture
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

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

    // const {
    //     errors,
    //     isValid
    // } = validateRegisterInput(req.body);

    // // Check validation
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    // User.findOne({
    //         email: req.body.email
    //     })
    //     .then(user => {
    //         if (user) {
    //             errors.email = 'Email already exists';
    //             return res.status(400).json(errors);
    //         } else {
    //             const avatar = gravatar.url(req.body.email, {
    //                 s: '200', // size
    //                 r: 'pg', // rating
    //                 d: 'mm' // default no picture
    //             });

    //             const newUser = new User({
    //                 name: req.body.name,
    //                 email: req.body.email,
    //                 avatar,
    //                 password: req.body.password
    //             });

    //             bcrypt.genSalt(10, (err, salt) => {
    //                 bcrypt.hash(newUser.password, salt, (err, hash) => {
    //                     if (err) throw err;
    //                     newUser.password = hash;
    //                     newUser.save()
    //                         .then(user => res.json(user))
    //                         .catch(err => console.log(err));
    //                 })
    //             })
    //         }
    //     })
});

module.exports = router;