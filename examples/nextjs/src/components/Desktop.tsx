import { useEffect } from "react"

export const Desktop = () => {
  useEffect(() => {
    console.log("firing desktop")
  }, [])

  return (
    <div>
      <h1>Desktop</h1>
    </div>
  )
}
