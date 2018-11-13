import Webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import webpackConfig from "./webpack.config"
import express from "express"

import ReactDOMServer from "react-dom/server"
import React from "react"

import { MediaStyle, SSRStyleID } from "./setup"
import { App } from "./app"

const app = express()

app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <ul>
          <li><a href="/ssr-only">server-side rendering <em>only</em></a></li>
          <li><a href="/client-only">client-side rendering <em>only</em></a></li>
          <li><a href="/rehydration">server-side rendering <em>and</em> client-side rehydration</a></li>
        </ul>
      </body>
    </html>
  `)
})

app.get("/ssr-only", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style type="text/css">${MediaStyle()}</style>
      </head>
      <body>
        <div id="react-root">
          ${ReactDOMServer.renderToString(<App />)}
        </div>
      </body>
    </html>
  `)
})

app.get("/rehydration", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style type="text/css" id="${SSRStyleID}">${MediaStyle()}</style>
      </head>
      <body>
        <div id="loading-indicator">Loading…</div>
        <div id="react-root">${ReactDOMServer.renderToString(<App />)}</div>
        <script>
          // This is to show that the layout already looks good while still
          // loading the JS bundle.
          setTimeout(function () {
            var script = document.createElement("script")
            script.src = "/bundle.js"
            document.getElementsByTagName("head")[0].appendChild(script);
            document.getElementById("loading-indicator").remove();
          }, 1000)
        </script>
      </body>
    </html>
  `)
})

app.get("/client-only", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <div id="react-root">Loading…</div>
        <script>
          setTimeout(function () {
            var script = document.createElement("script")
            script.src = "/bundle.js"
            document.getElementsByTagName("head")[0].appendChild(script);
          }, 1000)
        </script>
      </body>
    </html>
  `)
})

const compiler = Webpack(webpackConfig)
const devServerOptions = Object.assign({}, webpackConfig.devServer, {
  stats: {
    colors: true,
  },
  before(s) {
    s.use(app)
  },
})
const server = new WebpackDevServer(compiler, devServerOptions)

server.listen(8080, "127.0.0.1", () => {
  // tslint:disable-next-line:no-console
  console.log("Starting server on http://localhost:8080")
})
