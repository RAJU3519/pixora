import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore"
import { db } from "../components/firebase"
//import { useStateValue } from "../components/stateprovider"
import {useStateValue } from "../components/StateProvider"; 

import Post from "../components/Post"
import "../style/Profile.css"

export default function Profile() {
  const { userid } = useParams()
  const [posts, setPosts] = useState([])
  const [{ user }] = useStateValue()

  // Update title when user’s post loads
  useEffect(() => {
    if (posts.length > 0) {
      document.title = `${posts[0].post.username} | Pixora`
    }
  }, [posts])

  useEffect(() => {
    if (!userid) return

    const postsRef = collection(db, "posts")
    const q = query(postsRef, orderBy("timestamp", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filtered = snapshot.docs
        .filter((doc) => doc.data().email === userid)
        .map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      setPosts(filtered)
    })

    return unsubscribe
  }, [userid])

  return (
    <div>
      {posts[0] && (
        <div className="profileContainer">
          <img
            className="profileAvatar"
            src={posts[0].post.avatar}
            alt="avatar"
          />
          <h2 className="profileName">{posts[0].post.username}</h2>
        </div>
      )}

      <div className="posts">
        {posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} post={post} />
        ))}
      </div>
    </div>
  )
}
