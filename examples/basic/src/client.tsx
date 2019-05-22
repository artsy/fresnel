import React from "react"
import ReactDOM from "react-dom"
import { createMedia } from "@artsy/react-responsive-media"

const ExampleAppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
})

const { Media, MediaContextProvider } = ExampleAppMedia

const App = () => {
  return (
    <MediaContextProvider>
      <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media>
    </MediaContextProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("react"))
