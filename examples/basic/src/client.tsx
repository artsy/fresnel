import React from "react"
import { createMedia } from "@artsy/fresnel"
import { createRoot } from "react-dom/client"

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

const root = createRoot(document.getElementById("root")!)

root.render(<App />)
