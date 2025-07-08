// singlepost.js

import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../components/firebase';
import firebase from 'firebase';
import { useStateValue } from '../components/StateProvider';
import '../style/SinglePost.css';

export default function SinglePost() {
  const { id } = useParams();
  const [{ user }] = useStateValue();

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);

  const iconRef = useRef(null);

  // Set document title dynamically
  useEffect(() => {
    if (post?.username) {
      document.title = `${post.username} - ${post.caption || ''} | Pixora`;
    }
  }, [post.username, post.caption]);

  // Fetch post
  useEffect(() => {
    if (id) {
      db.collection('posts')
        .doc(id)
        .get()
        .then((doc) => {
          setPost(doc.data());
        });
    }
  }, [id]);

  // Fetch comments
  useEffect(() => {
    if (id) {
      db.collection('posts')
        .doc(id)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  // Fetch likes for the post
  useEffect(() => {
    if (id && user) {
      db.collection('users')
        .doc(user.email)
        .collection('likes')
        .onSnapshot((snapshot) => {
          const likes = snapshot.docs.map((doc) => doc.id);
          setLikedPosts(likes);

          if (likes.includes(id) && iconRef.current) {
            iconRef.current.classList.add('fas');
          }
        });
    }
  }, [id, user]);

  const postComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    db.collection('posts')
      .doc(id)
      .collection('comments')
      .add({
        text: comment,
        username: user.displayName || user.email.split('@')[0],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    setComment('');
  };

  const changeHeart = () => {
    if (!user) return;

    if (iconRef.current.classList.contains('fas')) {
      iconRef.current.classList.remove('fas');
      db.collection('users')
        .doc(user.email)
        .collection('likes')
        .doc(id)
        .delete();
    } else {
      iconRef.current.classList.add('fas');
      db.collection('users')
        .doc(user.email)
        .collection('likes')
        .doc(id)
        .set({ post: id });
    }
  };

  if (!post || Object.keys(post).length === 0) return null;

  return (
    <div className='singlePostContainer'>
      <div className='singlePost'>
        <img className='singlePostImage' src={post.imageUrl} alt={id} />

        <div className='singlePostRight'>
          <div className='postHeader'>
            <img className='avatar' src={post.avatar} alt={post.username} title={post.username} />
            <Link className='commentLink' to={`/profile/${post.email}`}>
              <h3 className='postUsername'>{post.username}</h3>
            </Link>
          </div>

          <div className='postComments singlePostComments'>
            {post.caption && (
              <p className='postCaption'>
                <strong>
                  <Link className='commentLink' to={`/profile/${post.email}`}>
                    {post.username}
                  </Link>
                </strong>{' '}
                {post.caption}
              </p>
            )}

            {comments.map((comment, i) => (
              <p key={i} className='postCaption'>
                <strong>
                  <Link className='commentLink' to={`/profile/${post.email}`}>
                    {comment.username}
                  </Link>
                </strong>{' '}
                {comment.text}
              </p>
            ))}
          </div>

          <div className='postInteractionBar singlePostInteractionBar'>
            <i
              ref={iconRef}
              onClick={changeHeart}
              className='far fa-heart postInteractionItem postHeart'
            ></i>
            <i className='far fa-comment postInteractionItem'></i>
          </div>

          {user && (
            <form className='postCommentsInput' onSubmit={postComment}>
              <input
                className='postComment'
                type='text'
                placeholder='Add a comment...'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className='postCommentButton'
                type='submit'
                disabled={!comment.trim()}
              >
                Post
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
