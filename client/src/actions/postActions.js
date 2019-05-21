import axios from 'axios';
import { setAlert } from './alertAction';
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_ONE_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types';

// get posts

export const getPosts = () => async dispatch => {

    try {

        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
};

// add like

export const addLike = id => async dispatch => {

    try {

        const res = await axios.put(`/api/posts/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        });

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
};

// remove like

export const removeLike = id => async dispatch => {

    try {

        const res = await axios.put(`/api/posts/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        });

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
};

// delete post

export const deletePost = id => async dispatch => {

    try {

        dispatch({
            type: DELETE_POST,
            payload: id
        });

        dispatch(setAlert('Post has been removed', 'success'))

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
}

// add post

export const addPost = formData => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

        const res = await axios.post('/api/posts', formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });

        dispatch(setAlert('Post has been added', 'success'))

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
};

// get one post

export const getOnePost = id => async dispatch => {

    try {

        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type: GET_ONE_POST,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
};

// add comment

export const addComment = (postId, formData) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });

        dispatch(setAlert('Comment has been added', 'success'))

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
};

// delete comment

export const deleteComment = (postId, commentID) => async dispatch => {

    try {

        await axios.delete(`/api/posts/comment/${postId}/${commentID}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentID
        });

        dispatch(setAlert('Comment has been removed', 'success'))

    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
}
