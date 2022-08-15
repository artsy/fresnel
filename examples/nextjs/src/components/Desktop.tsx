import { Suspense, useEffect } from "react"
import { Artists } from "./Artists"

export const Desktop = () => {
  useEffect(() => {
    // tslint:disable-next-line:no-console
    console.log("firing desktop")
  }, [])

  return (
    <div>
      <h1>Desktop</h1>
    </div>
  )
}
