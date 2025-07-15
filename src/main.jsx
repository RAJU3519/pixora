// src/main.jsx or index.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

//import { StateProvider } from "./components/stateprovider"
import { StateProvider } from "./components/StateProvider"; 

import reducer, { initialState } from "./components/reducer"

import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StateProvider>
  </React.StrictMode>
)

