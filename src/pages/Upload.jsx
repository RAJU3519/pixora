//upload.js

import React, { useState } from "react"
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../components/firebase"
import uploadToImgbb from "../components/UploadImages"
import "../style/Upload.css"

export default function Upload({ user }) {
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(file)
    setFilePreview(URL.createObjectURL(file))

    let name = file.name
    if (name.length > 20) {
      const ext = name.split(".").pop()
      name = name.split(".")[0].substring(0, 20) + "...." + ext
    }

    setFileName(name)
    setShowDelete(true)
  }

  const handleTrash = () => {
    setShowDelete(false)
    setImage(null)
    setFileName("")
    setFilePreview(null)
  }

  const closeUpload = () => {
    document.querySelector(".upload").style.display = "none"
    document.querySelector(".filter").style.display = "none"
  }

  const openUpload = () => {
    document.querySelector(".upload").style.display = "grid"
    document.querySelector(".filter").style.display = "block"
  }

  const handleUpload = async () => {
    if (!image) return
    setLoading(true)

    try {
      const imageUrl = await uploadToImgbb(image)

      await addDoc(collection(db, "posts"), {
        timestamp: serverTimestamp(),
        avatar:
          user.photoURL ||
          `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.email}`,
        caption: caption,
        imageUrl: imageUrl,
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
      })

      // Reset state
      setCaption("")
      setImage(null)
      setFileName("")
      setFilePreview(null)
      setShowDelete(false)
      closeUpload()

      document.getElementById("root").scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      alert("Upload failed: " + error.message)
    }

    setLoading(false)
  }

  return (
    <>
      <div className="addPostBtn" onClick={openUpload}>
        <i className="fas fa-plus"></i>
      </div>

      <div className="upload">
        <div className="uploadContent">
          {filePreview && (
            <>
              <div className="postHeader">
                <h3 className="uploadPreview">POST PREVIEW</h3>
              </div>
              <img className="postImage" src={filePreview} alt={fileName} />
            </>
          )}

          <input
            className="uploadCaption"
            type="text"
            placeholder="Enter a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <div className="uploadButtons">
            <label htmlFor="file-upload" className="customFileUpload">
              <i className="fas fa-file-upload"></i> Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {showDelete && (
              <>
                <div className="fileName">{fileName}</div>
                <div className="trashBtn" onClick={handleTrash}>
                  <i className="fas fa-trash"></i>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!image || !caption || loading}
            onClick={handleUpload}
            className="postButton"
          >
            {loading ? "Posting..." : "Post"}
          </button>

          <div className="closeBtn" onClick={closeUpload}>
            <i className="fas fa-times"></i>
          </div>
        </div>
      </div>
    </>
  )
}
