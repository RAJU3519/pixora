//Header.js

import React, { useEffect } from "react"
import { Link } from "react-router-dom"
//import { useStateValue } from "../components/stateprovider"
import { useStateValue } from "../components/StateProvider"; 

import "../style/Header.css"
import { auth } from "../components/firebase"

export default function Header() {
  const [{ user }] = useStateValue()

  const handleAuthentication = () => {
    if (user) {
      auth.signOut()
    }
  }

  useEffect(() => {
    const btnToggle = document.querySelector("#themeToggle i")
    const theme = localStorage.getItem("theme")

    if (theme === "light") {
      btnToggle.classList.add("fa-sun")
      btnToggle.classList.remove("fa-moon")
      document.body.classList.add("light")
    }

    const toggleHandler = () => {
      if (btnToggle.classList.contains("fa-moon")) {
        btnToggle.classList.add("fa-sun")
        btnToggle.classList.remove("fa-moon")
        localStorage.setItem("theme", "light")
      } else {
        btnToggle.classList.add("fa-moon")
        btnToggle.classList.remove("fa-sun")
        localStorage.clear()
      }
      document.body.classList.toggle("light")
    }

    btnToggle.addEventListener("click", toggleHandler)

    return () => {
      btnToggle.removeEventListener("click", toggleHandler)
    }
  }, [])

  return (
    <div className="header">
      <Link className="link headerTitle" to="/">
        <h1 className="headerLogo">pixora</h1>
      </Link>

      <div className="headerSearchContainer">{/* Future search bar */}</div>

      <div className="break"></div>

      <div className="headerNavContainer">
        <Link to="/" className="link headerOptionBasket">
          <div className="headerOptionBasket">
            <i className="fas fa-home"></i>
          </div>
        </Link>

        {/* Optional external link */}
        {/* <Link target="_blank" to="/chat" className="link headerOptionBasket" onClick={(e) => {e.preventDefault(); window.open("http://messagemeapp.netlify.app/");}}>
          <div className="headerOptionBasket">
            <i className="far fa-comment"></i>
          </div>
        </Link> */}

        <Link to={`/profile/${user?.email}`} className="link headerOptionBasket">
          <div className="headerOptionBasket">
            {user && (
              <img
                className="headerAvatar"
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.email}`
                }
                alt={user?.email}
                title={user?.email}
              />
            )}
          </div>
        </Link>

        <Link to={!user ? "/login" : "#"} className="link headerOptionBasket">
          <div onClick={handleAuthentication}>
            <span className="headerOption">
              <span className="headerOptionLineOne">
                {user ? user.email.split("@")[0] : "Hello Guest"}
              </span>
              <span className="headerOptionLineTwo">
                {user ? "Sign Out" : "Sign In"}
              </span>
            </span>
          </div>
        </Link>
      </div>

      <div id="themeToggle" className="headerTheme">
        <i className="far fa-moon"></i>
      </div>
    </div>
  )
}
