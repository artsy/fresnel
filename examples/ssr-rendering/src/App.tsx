import React from "react"
import { Media, MediaContextProvider } from "./Media"

export const App = () => {
  return (
    <MediaContextProvider>
      <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media>
    </MediaContextProvider>
  )
}
