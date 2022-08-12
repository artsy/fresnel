import { useEffect } from "react"

export const Mobile = () => {
  useEffect(() => {
    // tslint:disable-next-line:no-console
    console.log("firing mobile")
  }, [])

  return (
    <div>
      <h1>Mobile</h1>
    </div>
  )
}
