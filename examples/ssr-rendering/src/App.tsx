// ummjik
import React from "react"
import { Media, MediaContextProvider } from "./Media"

export const App = () => {
  return (
    <MediaContextProvider>
      <Media interaction="landscape">landscape</Media>
      <Media interaction="portrait">portrait</Media>

      <Media at="sm">Hello mobile!</Media>
      <Media greaterThan="sm">Hello desktop!</Media>
    </MediaContextProvider>
  )
}
