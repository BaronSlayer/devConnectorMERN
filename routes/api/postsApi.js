const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/authMiddleware');
const {
    check,
    validationResult
} = require('express-validator/check');

// Post model
const Post = require('../../models/postModel');

// Profile model
const Profile = require('../../models/profileModel');

// Profile model
const User = require('../../models/userModel');

// @route   POST api/posts
// @desc    create a post
// @access  Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const user = await User.findById(request.user.id).select('-password');

        const newPost = new Post({
            text: request.body.text,
            name: user.name,
            avatar: user.avatar,
            user: request.user.id
        });

        const post = await newPost.save();

        response.json(post);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error');
    }

});

// @route   GET api/posts
// @desc    get all posts
// @access  Private
router.get('/', auth, async (request, response) => {
    try {

        const posts = await Post.find().sort({
            date: -1
        });
        response.json(posts);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error');
    }
});

// @route   GET api/posts/:id
// @desc    get post by id
// @access  Private
router.get('/:id', auth, async (request, response) => {
    try {

        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({
                message: 'post not found'
            });
        }

        response.json(post);

    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return response.status(404).json({
                message: 'post not found'
            });
        }

        response.status(500).send('server error');
    }
});

// @route   DELETE api/posts/:id
// @desc    delete a post
// @access  Private
router.delete('/:id', auth, async (request, response) => {
    try {

        const post = await Post.findById(request.params.id);

        // check if post exists

        if (!post) {
            return response.status(404).json({
                message: 'post not found'
            });
        }

        // check if user is authorizrd

        if (post.user.toString() !== request.user.id) {
            return response.status(401).json({
                message: 'User is not authorized'
            });
        }

        await post.remove();

        response.json({
            message: 'Post has been removed'
        });

    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return response.status(404).json({
                message: 'post not found'
            });
        }

        response.status(500).send('server error');
    }
});

// @route   PUT api/posts/like/:id
// @desc    like a post
// @access  Private
router.put('/like/:id', auth, async (request, response) => {
    try {

        const post = await Post.findById(request.params.id);

        // check if post has been already liked by this user
        if (post.likes.filter(like => like.user.toString() === request.user.id).length > 0) {
            return response.status(400).json({
                message: 'Post has been already liked'
            });
        }

        post.likes.unshift({
            user: request.user.id
        });
        await post.save();
        response.json(post.likes);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error');
    }
});

// @route   PUT api/posts/unlike/:id
// @desc    unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (request, response) => {
    try {

        const post = await Post.findById(request.params.id);

        // check if post has been liked by this user
        if (post.likes.filter(like => like.user.toString() === request.user.id).length === 0) {
            return response.status(400).json({
                message: 'Post has not yet been liked'
            });
        }

        // get the remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(request.user.id);

        post.likes.splice(removeIndex, 1);
        await post.save();
        response.json(post.likes);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error');
    }
});

// @route   POST api/posts/comment/:id
// @desc    comment on a post
// @access  Private
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const user = await User.findById(request.user.id).select('-password');
        const post = await Post.findById(request.params.id);

        const newComment = {
            text: request.body.text,
            name: user.name,
            avatar: user.avatar,
            user: request.user.id
        };

        post.comments.unshift(newComment);
        await post.save();
        response.json(post.comments);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error');
    }

});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        // find comment
        const comment = post.comments.find(comment => comment.id === request.params.comment_id);

        // check if comment exists
        if (!comment) {
            return response.status(404).json({
                message: 'Cpmment does not exist'
            });
        }

        // check if comment belongs to this user
        if (comment.user.toString() !== request.user.id) {
            return response.status(401).json({
                meassage: 'User is not authorized'
            });
        }

        // get the remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(request.user.id);

        post.comments.splice(removeIndex, 1);
        await post.save();
        response.json(post.comments);

    } catch (err) {
        console.error(err.message);
        response.status(500).send('server error');
    }
});

module.exports = router;