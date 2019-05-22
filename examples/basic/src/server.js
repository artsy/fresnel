require("@babel/register")({
  extensions: [".ts", ".tsx", ".js", ".jsx"],
})

const express = require("express")
const webpack = require("webpack")
const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackConfig = require("../webpack.config")
const compiler = webpack(webpackConfig)

const app = express()

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
    stats: "errors-only",
  })
)

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>@artsy/fresnel - SSR Example</title>
      </head>
      <body>
        <div id='react'></div>

        <script src='/assets/app.js'></script>
      </body>
    </html>
  `)
})

app.listen(3000, () => {
  console.log("\nApp started at http://localhost:3000 \n")
})
