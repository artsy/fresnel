import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app"
import { MediaStyle, SSRStyleID } from "./setup"

if (document.getElementById(SSRStyleID)) {
  // rehydration
  ReactDOM.hydrate(<App />, document.getElementById("react-root"))
} else {
  // client-side only
  const style = document.createElement("style")
  style.type = "text/css"
  style.id = SSRStyleID
  style.innerText = MediaStyle()
  document.getElementsByTagName("head")[0].appendChild(style)
  ReactDOM.render(<App />, document.getElementById("react-root"))
}
