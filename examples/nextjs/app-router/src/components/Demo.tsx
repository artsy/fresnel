"use client"

import { Media, MediaContextProvider } from "../media"
import React from "react"

function Demo() {
  return (
    <MediaContextProvider>
      <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media>
    </MediaContextProvider>
  )
}

export default Demo
