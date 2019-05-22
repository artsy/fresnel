import React from "react"
import { Media } from "../Media"

export default function IndexPage() {
  return (
    <>
      <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media>
    </>
  )
}
