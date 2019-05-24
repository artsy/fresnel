import Webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import webpackConfig from "../webpack.config"
import express from "express"
import ReactDOMServer from "react-dom/server"
import React from "react"
import chalk from "chalk"

import { findDevice } from "@artsy/detect-responsive-traits"

import {
  mediaStyle,
  findBreakpointsForWidths,
  findBreakpointAtWidth,
  MediaContextProvider,
  SortedBreakpoints,
  SSRStyleID,
} from "./Media"
import { App } from "./app"

const app = express()

/**
 * Find the breakpoints and interactions that the server should render
 */
function onlyMatchListForUserAgent(userAgent: string): OnlyMatchList {
  const device = findDevice(userAgent)
  if (!device) {
    log(userAgent)
    return undefined
  } else {
    const supportsHover = device.touch ? "notHover" : "hover"
    const onlyMatch: any = device.resizable
      ? [
          supportsHover,
          ...(findBreakpointsForWidths(device.minWidth, device.maxWidth) as []),
        ]
      : [
          supportsHover,
          findBreakpointAtWidth(device.minWidth),
          findBreakpointAtWidth(device.maxWidth),
        ]
    log(userAgent, onlyMatch, device.description)
    return onlyMatch
  }
}

/**
 * Demonstrate server-side _only_ rendering
 */
app.get("/ssr-only", (req, res) => {
  res.send(
    template({
      includeCSS: true,
      body: `
        <div id="react-root">
          ${ReactDOMServer.renderToString(
            <MediaContextProvider
              onlyMatch={onlyMatchListForUserAgent(req.header(
                "User-Agent"
              ) as string)}
            >
              <App />
            </MediaContextProvider>
          )}
        </div>
      `,
    })
  )
})

/**
 * Demonstrate server-side rendering _with_ client-side JS rehydration
 */
app.get("/rehydration", (req, res) => {
  res.send(
    template({
      includeCSS: true,
      body: `
        <div id="loading-indicator">Loading…</div>
        <div id="react-root">
          ${ReactDOMServer.renderToString(
            <MediaContextProvider
              onlyMatch={onlyMatchListForUserAgent(req.header(
                "User-Agent"
              ) as string)}
            >
              <App />
            </MediaContextProvider>
          )}
        </div>
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
      `,
    })
  )
})

/**
 * Demonstrate client-side JS _only_ rendering
 */
app.get("/client-only", (_req, res) => {
  res.send(
    template({
      includeCSS: false,
      body: `
        <div id="react-root">Loading…</div>
        <script>
          setTimeout(function () {
            var script = document.createElement("script")
            script.src = "/bundle.js"
            document.getElementsByTagName("head")[0].appendChild(script);
          }, 1000)
        </script>
      `,
    })
  )
})

/**
 * Misc things that are not of interest for demonstrating fresnel
 */

// TODO: Simplify this hideous typing.
type OnlyMatchList =
  | Array<"hover" | "notHover" | (typeof SortedBreakpoints)[0]>
  | undefined

app.get("/", (_req, res) => {
  res.send(
    template({
      includeCSS: false,
      body: `
        <ul>
          <li><a href="/ssr-only">server-side rendering <em>only</em></a></li>
          <li><a href="/client-only">client-side rendering <em>only</em></a></li>
          <li><a href="/rehydration">server-side rendering <em>and</em> client-side rehydration</a></li>
        </ul>
      `,
    })
  )
})

const template = ({ includeCSS, body }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
      ${
        includeCSS
          ? `<style type="text/css" id="${SSRStyleID}">${mediaStyle}</style>`
          : ""
      }
    </head>
    <body>
      ${body}
    </body>
  </html>
`

function log(userAgent: string, onlyMatch?: string[], device?: string) {
  // tslint:disable-next-line:no-console
  console.log(
    `Render: ${chalk.green(onlyMatch ? onlyMatch.join(", ") : "ALL")}\n` +
      `Device: ${device ? chalk.green(device) : chalk.red("n/a")}\n` +
      `User-Agent: ${chalk.yellow(userAgent)}\n`
  )
}

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
