import React from "react"
import ReactDOMServer from "react-dom/server"
import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackConfig from "../webpack.config"
import { createMediaStyle } from "./Media"
import { App } from "./App"

const compiler = webpack(webpackConfig)
const app = express()

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
    stats: "errors-only",
  })
)

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
