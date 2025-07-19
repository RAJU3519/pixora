// src/components/Post.jsx

import React, { useEffect, useState, useRef } from "react";
import "../style/Post.css";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Post({ postId, post, user }) {
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [hasMoreComments, setHasMore] = useState(false);

  const heartRef = useRef(null);

  useEffect(() => {
    document.title = "Home | Pixora";
  }, []);

  // 🔄 Listen for the latest 3 comments
  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snap) => {
      setHasMore(snap.size > 3);
      const recent = snap.docs.slice(Math.max(0, snap.size - 3)).map((doc) => doc.data());
      setComments(recent);
    });

    return unsubscribe;
  }, [postId]);

  // ❤️ Listen for likes by this user
  useEffect(() => {
    if (!postId || !user) return;

    const likesRef = collection(db, "users", user.email, "likes");

    const unsubscribe = onSnapshot(likesRef, (snap) => {
      const likes = snap.docs.map((d) => d.id);
      setLikedPosts(likes);

      if (likes.includes(postId) && heartRef.current) {
        heartRef.current.classList.add("fas");
      }
    });

    return unsubscribe;
  }, [postId, user]);

  // 🔁 Toggle like
  const toggleLike = async () => {
    if (!postId || !user || !heartRef.current) return;

    const likeRef = doc(db, "users", user.email, "likes", postId);

    if (heartRef.current.classList.toggle("fas")) {
      await setDoc(likeRef, { post: postId });
    } else {
      await deleteDoc(likeRef);
    }
  };

  // 💬 Post a comment
  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const commentsRef = collection(db, "posts", postId, "comments");
    await addDoc(commentsRef, {
      text: comment,
      username: user.displayName || user.email.split("@")[0],
      timestamp: serverTimestamp(),
    });

    setComment("");
  };

  if (!post) return null;

  return (
    <div className="post">
      <div className="postHeader">
        <img className="avatar" src={user?.photoURL || "/default-avatar.svg"} alt={post.username} />
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
              <Link className="commentLink" to={`/profile/${c.email}`}>
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
