const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const {
    check,
    validationResult
} = require('express-validator/check');

// Load Profile model
const Profile = require('../../models/profileModel');

// Load User model
const User = require('../../models/userModel');

// @route   GET api/profile/me
// @desc    Get current user profile route
// @access  Private
router.get('/me', auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({
            user: request.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return response.status(400).json({
                message: 'There is no profile for this user'
            })
        }

        response.json(profile);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error')
    }
});

// @route   Post api/profile
// @desc    Create or Update user profile route
// @access  Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty(),
]], async (request, response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = request.body;

    // build profile object
    const profileFields = {};
    profileFields.user = request.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // skills array split csv at comma
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // console.log(profileFields.skills);
    // response.send('Hello');
    // console.log(profileFields.social.twitter);

    try {
        let profile = await Profile.findOne({
            user: request.user.id
        });

        // update profile

        if (profile) {

            profile = await Profile.findOneAndUpdate({
                user: request.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });

            return response.json(profile);

        }

        // create profile
        profile = new Profile(profileFields);

        await profile.save();
        response.json(profile);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error')
    }
});

// @route   GET api/profile
// @desc    get all profiles
// @access  Public
router.get('/', async (request, response) => {

    try {

        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        response.json(profiles);

    } catch (err) {

        console.error(err.message);
        response.status(500).send('Server Error');

    }
});

// @route   GET api/profile/user/:user_id
// @desc    get profile by user id
// @access  Public
router.get('/user/:user_id', async (request, response) => {

    try {

        const profile = await Profile.findOne({
            user: request.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) return response.status(400).json({
            message: 'Profile was not found'
        });

        response.json(profile);

    } catch (err) {

        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return response.status(400).json({
                message: 'Profile was not found'
            });
        }

        response.status(500).send('Server Error');

    }
});

// @route   DELETE api/profile
// @desc    delete profile, user & posts
// @access  Private
router.delete('/', auth, async (request, response) => {

    try {

        // delete profile
        await Profile.findOneAndRemove({
            user: request.user.id
        });

        // delete user
        await User.findOneAndRemove({
            _id: request.user.id
        });

        response.json({
            message: 'User has been deleted'
        });

    } catch (err) {

        console.error(err.message);
        response.status(500).send('Server Error');

    }
});

module.exports = router;