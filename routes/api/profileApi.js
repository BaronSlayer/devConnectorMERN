const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
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

    try {
        let profile = await Profile.findOne({
            user: request.user.id
        });

        // update profile

        if (profile) {

            profile = await Profile.findOneAndUpdate(
                { user: request.user.id },
                { $set: profileFields },
                { new: true }
            );

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

// @route   PUT api/profile/experience
// @desc    add profile experience
// @access  Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = request.body;

    const newExperince = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({
            user: request.user.id
        });
        profile.experience.unshift(newExperince);
        await profile.save();
        response.json(profile);

    } catch (err) {

        console.error(err.message);
        response.status(500).send('Server Error');

    }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({
            user: request.user.id
        });

        // get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(request.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        response.json(profile);

    } catch (err) {

        console.error(err.message);
        response.status(500).send('Server Error');

    }
});

// @route   PUT api/profile/education
// @desc    add profile education
// @access  Private
router.put('/education', [auth, [
    check('school', 'School name is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldOfStudy', 'Major is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }

    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = request.body;

    const newEducation = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({
            user: request.user.id
        });
        profile.education.unshift(newEducation);
        await profile.save();
        response.json(profile);

    } catch (err) {

        console.error(err.message);
        response.status(500).send('Server Error');

    }
});

// @route   DELETE api/profile/education/:edu_id
// @desc    delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({
            user: request.user.id
        });

        // get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(request.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        response.json(profile);

    } catch (err) {

        console.error(err.message);
        response.status(500).send('Server Error');

    }
});




// @route   GET api/profile/github/:username
// @desc    get user repos from Github
// @access  Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&
            client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({
                    message: 'No Github profile was found'
                });
            }

            res.json(JSON.parse(body));
        });

    } catch (err) {

        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

module.exports = router;
