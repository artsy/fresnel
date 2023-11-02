import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./app"
import { SSRStyleID, mediaStyle } from "./Media"

let root

if (document.getElementById(SSRStyleID)) {
  root = ReactDOM.hydrateRoot(document.getElementById("react-root"), <App />)
} else {
  // client-side only
  const style = document.createElement("style")
  style.type = "text/css"
  style.id = SSRStyleID
  style.innerText = mediaStyle
  document.getElementsByTagName("head")[0].appendChild(style)

  root = ReactDOM.createRoot(document.getElementById("react-root"))
  root.render(<App />)
}
