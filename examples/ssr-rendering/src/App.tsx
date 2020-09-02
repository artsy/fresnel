import React from "react"
import { Media, MediaContextProvider } from "./Media"

export const App = () => {
  return (
    <MediaContextProvider>
      <Media interaction="hover">
        media has hover interaction capabilities
      </Media>
      <Media interaction="notHover">
        media lacks hover interaction capabilities
      </Media>

      <Media interaction="landscape">landscape</Media>
      <Media interaction="portrait">portrait</Media>

      <Media at="sm">Hello mobile!</Media>
      <Media greaterThan="sm">Hello desktop!</Media>
    </MediaContextProvider>
  )
}
