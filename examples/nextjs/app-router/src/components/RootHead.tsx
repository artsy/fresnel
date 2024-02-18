"use client"

import React from "react"
import { mediaStyles } from "../media"

function RootHead() {
  return (
    <head>
      <style
        key="fresnel-css"
        dangerouslySetInnerHTML={{ __html: mediaStyles }}
        type="text/css"
      />
    </head>
  )
}

export default RootHead
