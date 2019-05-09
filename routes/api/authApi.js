const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const User = require('../../models/userModel');

// @route   GET api/auth
// @desc    auth route
// @access  Public
router.get('/', auth, async (request, response) => {
    try {
        const user = await User.findById(request.user.id).select('-password');
        response.json(user);
    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error')
    }
});

module.exports = router;