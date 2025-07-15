//  login.js

import React, { useEffect, useState } from "react"
import "../style/Login.css"
import { Link, useNavigate } from "react-router-dom"
import { auth, provider } from "../components/firebase"
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    document.title = "Login | Pixora"
  }, [])

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (error) {
      alert(error.message)
    }
  }

  const signInEmail = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (error) {
      alert(error.message)
    }
  }

  const register = async (e) => {
    e.preventDefault()
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      if (userCred) {
        navigate("/")
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <Link to="/" className="link">
          <h1 className="loginLogo">pixora</h1>
        </Link>
        <h1>Sign-in</h1>

        <form>
          <h5>E-mail</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            onClick={signInEmail}
            className="loginSignInButton"
          >
            Sign In
          </button>
        </form>

        <button className="loginRegisterButton" onClick={register}>
          Create your Pixora Account
        </button>

        <br />
        <h5>OR</h5>
        <button onClick={signIn} className="loginSignInButtonGoogle">
          <i className="fab fa-google"></i> Sign In with Google
        </button>

        <p>
          Disclaimer: This is a fake social media platform called Pixora built
          for educational purposes only.
        </p>
      </div>
    </div>
  )
}
