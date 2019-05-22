### @artsy/fresnel

# Server-side Rendering Example

This example how to setup `@artsy/fresnel` for server-side rendering, via express.

To run the example:

```
yarn install
yarn start
```

#### Example Breakdown

First, configure `@artsy/fresnel` in a `Media.tsx` file that can be shared across the app:

```js
// Media.tsx

import { createMedia } from "@artsy/react-responsive-media"

const ExampleAppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
  interactions: {},
})

export const { Media, MediaContextProvider, createMediaStyle } = ExampleAppMedia
```

Create a new `App.tsx` file which will be the launching point for our application:

```js
import React from "react"
import { Media, MediaContextProvider } from "./Media"

export const App = () => {
  return (
    <MediaContextProvider>
      <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media>
    </MediaContextProvider>
  )
}
```

Then on the server, setup SSR rendering and call `createMediaStyle` which will inject the necessary css:

```js
// server.tsx

import React from "react"
import ReactDOMServer from "react-dom/server"
import express from "express"

import { App } from "./App"
import { createMediaStyle } from "./Media"

const app = express()

app.get("/", (_req, res) => {
  const html = ReactDOMServer.renderToString(<App />)

  res.send(`
    <html>
      <head>
        <title>@artsy/fresnel - SSR Example</title>
        <style type="text/css">${createMediaStyle()}</style>
      </head>
      <body>
        <div id='react'>${html}</div>

        <script src='/assets/app.js'></script>
      </body>
    </html>
  `)
})

app.listen(3000, () => {
  console.warn("\nApp started at http://localhost:3000 \n")
})
```

And that's it! To test, disable JS and scale your browser window down to a mobile size; it will correctly render without the need to use a user-agent or other server-side "hints".
