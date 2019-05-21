import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getOnePost } from '../../actions/postActions';

const PostComponent = ({ getOnePost, post: { post, loading }, match }) => {

    useEffect(() => {
        getOnePost(match.params.id)
    }, [getOnePost, match.params.id])
    return (loading || post === null
    ) ? (
            <Spinner />
        ) : (
            <Fragment>
                <Link to='/posts' className='btn'>All Posts</Link>
                <PostItem post={post} showActions={false} />
                <CommentForm postId={post._id} />
                <div className="comments">
                    {post.comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} postId={post._id} />
                    ))}
                </div>
            </Fragment>
        )
}

PostComponent.propTypes = {
    getOnePost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.postReducer
})

export default connect(mapStateToProps, { getOnePost })(PostComponent);
