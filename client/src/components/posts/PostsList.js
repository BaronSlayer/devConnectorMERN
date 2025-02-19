import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/postActions';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const PostsList = ({ getPosts, post: { posts, loading } }) => {

    useEffect(() => {
        getPosts();
    }, [getPosts]);
    return (
        (loading) ? (<Spinner />) : (
            <Fragment>
                <h1 className="large text-primary">Posts</h1>
                <p className="lead">
                    <span className="fas fa-user"></span>&nbsp;&nbsp;Welcome to the community
                </p>

                <PostForm />

                <div className="posts">
                    {posts.map(post => (
                        <PostItem key={post._id} post={post} />
                    ))}
                </div>
            </Fragment>
        )
    )
}

PostsList.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.postReducer
})

export default connect(mapStateToProps, { getPosts })(PostsList);
