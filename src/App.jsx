import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Post from "./components/Post";
import SinglePost from "./pages/SinglePost";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Footer from "./pages/Footer";
import { db, auth } from "./components/firebase";
import { useStateValue } from "./components/StateProvider";
import "./App.css";

// 🔁 Modular Firestore imports
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [posts, setPosts] = useState([]);

  // ✅ Firestore listener for posts
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // ✅ Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      dispatch({
        type: "SET_USER",
        user: authUser || null,
      });
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="App">
      <div className="filter"></div>
      <Header />

      <Routes>
        <Route
          path="/login"
          element={
            <>
              <Login />
              <Footer />
            </>
          }
        />

        <Route
          path="/post/:id"
          element={
            <>
              <SinglePost />
              {user && <Upload user={user} />}
              <Footer />
            </>
          }
        />

        <Route
          path="/profile/:userid"
          element={
            <>
              <Profile />
              {user && <Upload user={user} />}
              <Footer />
            </>
          }
        />

        <Route
          path="/"
          element={
            <>
              <div className="posts">
                {posts.map(({ id, post }) => (
                  <Post key={id} postId={id} user={user} post={post} />
                ))}
              </div>
              {user && <Upload user={user} />}
              <Footer />
            </>
          }
        />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
