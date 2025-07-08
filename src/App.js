import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Post from "./pages/Post";
import SinglePost from "./pages/SinglePost";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Footer from "./pages/Footer";
import { db, auth } from "./components/firebase";
import "./App.css";
import { useEffect, useState } from "react";
import { useStateValue } from "./components/StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="App">
      <div className="filter"></div>
      <Router>
        <Switch>
          <Route exact path="/login">
            <Header />
            <Login />
            <Footer />
          </Route>

          <Route exact path="/post/:id">
            <Header />
            <SinglePost />
            {user && <Upload user={user} />}
            <Footer />
          </Route>

          <Route exact path="/profile/:userid">
            <Header />
            <Profile />
            {user && <Upload user={user} />}
            <Footer />
          </Route>

          <Route exact path="/">
            <Header />
            <div className="posts">
              {posts.map(({ id, post }) => (
                <Post key={id} postId={id} user={user} post={post} />
              ))}
            </div>
            {user && <Upload user={user} />}
            <Footer />
          </Route>

          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
