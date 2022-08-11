import { useEffect } from "react"

export const Mobile = () => {
  useEffect(() => {
    console.log("firing mobile")
  }, [])

  return (
    <div>
      <h1>Mobile</h1>
    </div>
  )
}
