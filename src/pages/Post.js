// src/components/Post.js

import React, { useEffect, useState, useRef } from "react";
import { db, FieldValue } from "../components/firebase";
import "../style/Post.css";
import { Link } from "react-router-dom";

export default function Post({ postId, post, user }) {
  const [comments, setComments]       = useState([]);
  const [likedPosts, setLikedPosts]   = useState([]);
  const [comment, setComment]         = useState("");
  const [hasMoreComments, setHasMore] = useState(false);

  // reference to the heart‑icon element
  const heartRef = useRef(null);

  /* set page title */
  useEffect(() => {
    document.title = "Home | Pixora";
  }, []);

  /* listen for latest THREE comments */
  useEffect(() => {
    if (!postId) return;
    return db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .onSnapshot((snap) => {
        setHasMore(snap.size > 3);
        setComments(
          snap.docs.slice(Math.max(0, snap.size - 3)).map((d) => d.data())
        );
      });
  }, [postId]);

  /* listen for likes for this user */
  useEffect(() => {
    if (!postId || !user) return;
    return db
      .collection("users")
      .doc(user.email)
      .collection("likes")
      .onSnapshot((snap) => {
        const likes = snap.docs.map((d) => d.id);
        setLikedPosts(likes);
        if (likes.includes(postId) && heartRef.current) {
          heartRef.current.classList.add("fas");
        }
      });
  }, [postId, user]);

  /* toggle like */
  const toggleLike = () => {
    if (!postId || !user || !heartRef.current) return;

    const likeRef = db
      .collection("users")
      .doc(user.email)
      .collection("likes")
      .doc(postId);

    if (heartRef.current.classList.toggle("fas")) {
      likeRef.set({ post: postId });
    } else {
      likeRef.delete();
    }
  };

  /* add comment */
  const postComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName || user.email.split("@")[0],
      timestamp: FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  /* nothing to render if post is still loading */
  if (!post) return null;

  return (
    <div className="post">
      <div className="postHeader">
        <img className="avatar" src={post.avatar} alt={post.username} />
        <Link to={`/profile/${post.email}`}>
          <h3 className="postUsername">{post.username}</h3>
        </Link>
      </div>

      <Link to={`/post/${postId}`}>
        <img className="postImage" src={post.imageUrl} alt={postId} />
      </Link>

      <div className="postInteractionBar">
        <i
          ref={heartRef}
          onClick={toggleLike}
          className="far fa-heart postInteractionItem postHeart"
        ></i>
        <Link to={`/post/${postId}`}>
          <i className="far fa-comment postInteractionItem"></i>
        </Link>
      </div>

      <div className="postComments">
        {post.caption && (
          <p className="postCaption">
            <strong>
              <Link className="commentLink" to={`/profile/${post.email}`}>
                {post.username}
              </Link>
            </strong>{" "}
            {post.caption}
          </p>
        )}

        {comments.map((c, i) => (
          <p key={i} className="postCaption">
            <strong>
              <Link className="commentLink" to={`/profile/${post.email}`}>
                {c.username}
              </Link>
            </strong>{" "}
            {c.text}
          </p>
        ))}

        {hasMoreComments && (
          <Link to={`/post/${postId}`}>
            <p className="postCaption postMoreComments">See all comments ...</p>
          </Link>
        )}
      </div>

      {user && (
        <form className="postCommentsInput" onSubmit={postComment}>
          <input
            className="postComment"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="postCommentButton"
            type="submit"
            disabled={!comment.trim()}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
