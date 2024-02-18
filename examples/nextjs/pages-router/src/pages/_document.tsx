import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"

import { mediaStyles } from "../media"

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: mediaStyles }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
