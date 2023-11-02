const webpack = require("webpack")

module.exports = {
  mode: "development",
  devtool: "eval",
  entry: {
    app: "./src/client.tsx",
  },
  output: {
    filename: "[name].js",
    publicPath: "/assets",
    hashFunction: "sha256",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: /src/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules", "src"],
  },
}
