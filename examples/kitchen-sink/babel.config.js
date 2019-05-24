module.exports = api => {
  api.cache(true)

  return {
    presets: ["@babel/env", "@babel/typescript", "@babel/react"],
    plugins: ["@babel/plugin-proposal-class-properties"],
  }
}
