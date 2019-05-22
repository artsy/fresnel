import React from "react"
import { Media } from "../Media"

export default function IndexPage() {
  return (
    <>
      <Media at="xs">Hello mobile view</Media>
      <Media greaterThan="xs">Hello destop view!</Media>
    </>
  )
}
