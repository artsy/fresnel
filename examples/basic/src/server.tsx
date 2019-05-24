import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackConfig from "../webpack.config"

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
  res.send(`
    <html>
      <head>
        <title>@artsy/fresnel | Basic Example</title>
      </head>
      <body>
        <div id="react"></div>

        <script src="/assets/app.js"></script>
      </body>
    </html>
  `)
})

app.listen(3000, () => {
  console.warn("\nApp started at http://localhost:3000 \n")
})
