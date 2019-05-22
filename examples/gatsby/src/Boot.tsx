import React from "react"
import { MediaContextProvider } from "./Media"

export const Boot = ({ element }) => {
  return <MediaContextProvider>{element}</MediaContextProvider>
}
