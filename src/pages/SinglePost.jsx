import React, { useEffect, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import {
  doc,
  getDoc,
  collection,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
  query,
} from "firebase/firestore"
import { db, FieldValue } from "../components/firebase"
import { useStateValue } from "../components/stateprovider"
import "../style/SinglePost.css"

export default function SinglePost() {
  const { id } = useParams()
  const [{ user }] = useStateValue()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [likedPosts, setLikedPosts] = useState([])

  const iconRef = useRef(null)

  // Set dynamic title
  useEffect(() => {
    if (post?.username) {
      document.title = `${post.username} - ${post.caption || ""} | Pixora`
    }
  }, [post])

  // Fetch post once
  useEffect(() => {
    if (!id) return
    const fetchPost = async () => {
      const postRef = doc(db, "posts", id)
      const snapshot = await getDoc(postRef)
      if (snapshot.exists()) {
        setPost(snapshot.data())
      }
    }
    fetchPost()
  }, [id])

  // Realtime comment listener
  useEffect(() => {
    if (!id) return
    const q = query(
      collection(db, "posts", id, "comments"),
      orderBy("timestamp", "asc")
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => doc.data()))
    })
    return unsubscribe
  }, [id])

  // Likes listener
  useEffect(() => {
    if (!id || !user) return
    const likesRef = collection(db, "users", user.email, "likes")

    const unsubscribe = onSnapshot(likesRef, (snap) => {
      const likes = snap.docs.map((doc) => doc.id)
      setLikedPosts(likes)
      if (likes.includes(id) && iconRef.current) {
        iconRef.current.classList.add("fas")
      }
    })

    return unsubscribe
  }, [id, user])

  // Submit comment
  const postComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    const commentsRef = collection(db, "posts", id, "comments")
    await addDoc(commentsRef, {
      text: comment,
      username: user.displayName || user.email.split("@")[0],
      timestamp: FieldValue(),
    })

    setComment("")
  }

  // Like/unlike post
  const changeHeart = async () => {
    if (!user || !iconRef.current) return

    const likeRef = doc(db, "users", user.email, "likes", id)

    if (iconRef.current.classList.contains("fas")) {
      iconRef.current.classList.remove("fas")
      await deleteDoc(likeRef)
    } else {
      iconRef.current.classList.add("fas")
      await setDoc(likeRef, { post: id })
    }
  }

  if (!post) return null

  return (
    <div className="singlePostContainer">
      <div className="singlePost">
        <img className="singlePostImage" src={post.imageUrl} alt={id} />

        <div className="singlePostRight">
          <div className="postHeader">
            <img
              className="avatar"
              src={post.avatar}
              alt={post.username}
              title={post.username}
            />
            <Link className="commentLink" to={`/profile/${post.email}`}>
              <h3 className="postUsername">{post.username}</h3>
            </Link>
          </div>

          <div className="postComments singlePostComments">
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

            {comments.map((comment, i) => (
              <p key={i} className="postCaption">
                <strong>
                  <Link className="commentLink" to={`/profile/${post.email}`}>
                    {comment.username}
                  </Link>
                </strong>{" "}
                {comment.text}
              </p>
            ))}
          </div>

          <div className="postInteractionBar singlePostInteractionBar">
            <i
              ref={iconRef}
              onClick={changeHeart}
              className="far fa-heart postInteractionItem postHeart"
            ></i>
            <i className="far fa-comment postInteractionItem"></i>
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
      </div>
    </div>
  )
}
