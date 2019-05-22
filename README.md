# @artsy/react-responsive-media

[![CircleCI][ci-icon]][ci] [![npm version][npm-icon]][npm]

## Installation

```sh
  yarn add @artsy/react-responsive-media
```

**Table of Contents**

- [Overview](#overview)
- [Basic Example](#basic-example)
- [Server-side Rendering (SSR)](#server-side-rendering-ssr-usage)
- [Usage with Gatsby](#usage-with-gatsby)
- [Example Apps](#example-apps)
- [Why not conditionally render?](#why-not-conditionally-render)
- [API](#api)
- [Pros vs Cons](#pros-vs-cons)
- [Development](#development)

## Overview

When writing responsive components it's common to use media queries to adjust
the display when certain conditions are met. Historically this has taken place
directly in CSS/HTML:

```css
@media screen and (max-width: 767px) {
  .my-container {
    width: 100%;
  }
}
@media screen and (min-width: 768px) {
  .my-container {
    width: 50%;
  }
}
```

```html
<div class="my-container" />
```

By hooking into a breakpoint definition, `@artsy/react-responsive-media` takes
this imperative approach and makes it declarative.

## Basic Example

```tsx
import React from "react"
import ReactDOM from "react-dom"
import { createMedia } from "@artsy/react-responsive-media"

const { MediaContextProvider, Media  } = createMedia({
  breakpoints: {
    sm: 0,
    md: 768
    lg: 1024,
    xl: 1192,
  },
})

const App = () => (
  <MediaContextProvider>
    <Media at='sm'>
      <MobileApp />
    </Media>
    <Media at='md'>
      <TabletApp />
    </Media>
    <Media greaterThanOrEqual='lg'>
      <DesktopApp />
    </Media>
  </MediaContextProvider>
)

ReactDOM.render(<App />, document.getElementById("react"))
```

## Server-side Rendering (SSR) Usage

The first important thing to note is that when server-rendering with
`@artsy/fresnel`, all breakpoints get rendered by the server. Each Media
component is wrapped by plain CSS that will only show that breakpoint if it
matches the user's current browser size. This means that the client can
accurately start rendering the HTML/CSS while it receives it, which is long
before the React application has booted. This improves perceived performance for
end-users.

Why not just the one that the current device needs? A couple reasons. First, we
can't accurately identify which breakpoint your device needs on the server. We
could use a library to sniff the browser user-agent, but those aren't always
accurate, and they wouldn't give us all the information we need to know when we
are server-rendering.

What this means in practice is we can automatically match layouts for mobile,
difficult-to-infer "in between" sizes, or whatever outlandish media query one
might need to design for because we don't need JS or server-side "hints" to
determine whether a media query is active or not. Once client-side JS boots and
React attaches, it simply washes over and removes markup that is unneeded, via a
`matchMedia` call.

This is a unique solution to the long-standing problem of how best to design
for, and respond to, layouts that can be viewed on any kind of device, and at
any size, but which also need to be server-side rendered.

### SSR Example

First, configure `@artsy/fresnel` in a `Media` file that can be shared across
the app:

```tsx
// Media.tsx

import { createMedia } from "@artsy/fresnel"

const ExampleAppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
})

// Generate CSS to be injected into the head
export const mediaStyle = ExampleAppMedia.createMediaStyle()
export const { Media, MediaContextProvider } = ExampleAppMedia
```

Create a new `App` file which will be the launching point for our application:

```tsx
// App.tsx

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

Mount `<App />` on the client:

```tsx
// client.tsx

import React from "react"
import ReactDOM from "react-dom"
import { App } from "./App"

ReactDOM.render(<App />, document.getElementById("react"))
```

Then on the server, setup SSR rendering and pass `mediaStyle` into a `<style>`
tag in the header:

```tsx
// server.tsx

import React from "react"
import ReactDOMServer from "react-dom/server"
import express from "express"

import { App } from "./App"
import { mediaStyle } from "./Media"

const app = express()

app.get("/", (_req, res) => {
  const html = ReactDOMServer.renderToString(<App />)

  res.send(`
    <html>
      <head>
        <title>@artsy/fresnel - SSR Example</title>

        <!–– Inject the generated styles into the page head -->
        <style type="text/css">${mediaStyle}</style>
      </head>
      <body>
        <div id="react">${html}</div>

        <script src='/assets/app.js'></script>
      </body>
    </html>
  `)
})

app.listen(3000, () => {
  console.warn("\nApp started at http://localhost:3000 \n")
})
```

And that's it! To test, disable JS and scale your browser window down to a
mobile size; it will correctly render without the need to use a user-agent or
other server-side "hints".

## Usage with Gatsby

`@artsy/fresnel` works great with Gatsby's static hybrid approach to rendering.
See the [Gatsby Example](`/examples/gatsby`) for a simple implementation.

## Example Apps

There are three examples one can look explore in the `/examples` folder:

- [Basic]('/examples/basic)
- [Server-side Rendering]('/examples/ssr-rendering)
- [Gatsby]('/examples/gatsby)
- [Kitchen Sink]('/examples/kitchen-sink)

While the `Basic` and `SSR` examples will get one pretty far, `@artsy/fresnel`
can do _a lot_, and can be used as a tool to build other tools. For an
exhaustive deep-dive into its features, check out the `Kitchen Sink` app.

## Why not conditionally render?

Other existing solutions take a conditionally rendered approach, such as
[`react-responsive`][react-responsive] or [`react-media`][react-media], so where
does this approach differ?

Server side rendering!

But first, what is conditional rendering?

In the React ecosystem a common approach to writing declarative responsive
components is to use the browser’s [`matchMedia` api][match-media-api]:

```tsx
<Responsive>
  {({ xs }) => {
    if (xs) {
      return <MobileApp />
    } else {
      return <DesktopApp />
    }
  }}
</Responsive>
```

On the client, when a given breakpoint is matched React conditionally renders a
tree.

However, this approach suffers from a few flaws when used in conjunction with
server-side rendering (SSR):

- It's impossible to reliably know the user's current breakpoint during the
  server render phase since that requires a browser.

- Setting breakpoint sizes based on user-agent sniffing is prone to errors due
  the inability to precisely match device capabilities to size. One mobile
  device might have greater pixel density than another, a mobile device may fit
  multiple breakpoints when taking device orientation into consideration, and on
  desktop clients there is no way to know at all. The best devs can do is guess
  the current breakpoint and populate `<Responsive>` with assumed state.

Artsy settled on what we think makes the best trade-offs. We approach this
problem in the following way:

1. Render markup for all breakpoints on the server and send it down the wire.

1. The browser receives markup with proper media query styling and will
   immediately start rendering the expected **visual** result for whatever
   viewport width the browser is at.

1. When all JS has loaded and React starts the rehydration phase, we query the
   browser for what breakpoint it’s currently at and then limit the rendered
   components to the matching media queries. This prevents life-cycle methods
   from firing in hidden components and unused html being written to the DOM.

1. Additionally, we register event listeners with the browser to notify the
   `MediaContextProvider` when a different breakpoint is matched and then
   re-render the tree using the new value for the `onlyMatch` prop.

Let’s compare what a component tree using `matchMedia` would look like with our
approach:

<table>
<tr><th>Before</th><th>After</th></tr>
<tr><td>

```tsx
<Responsive>
  {({ xs }) => {
    if (xs) return <SmallArticleItem {...props} />
    else return <LargeArticleItem {...props} />
  }}
</Responsive>
```

</td>
<td>

```tsx
<>
  <Media at="xs">
    <SmallArticleItem {...props} />
  </Media>
  <Media greaterThan="xs">
    <LargeArticleItem {...props} />
  </Media>
</>
```

</td></tr>
</table>

See [#server-side-rendering][] for a complete example.

## API

### createMedia

First things first. You’ll need to define the breakpoints and interaction needed
for your design to produce the set of media components you can use throughout
your application.

For example, consider an application that has the following breakpoints:

- A viewport width between 1 and 768 points, named `sm`.
- A viewport width between 768 and 1024 points, named `md`.
- A viewport width between 1024 and 1192 points, named `lg`.
- A viewport width from 1192 points and above, named `xl`.

And the following interactions:

- A device that supports hovering a pointer device, named `hover`.
- A device that does not support hovering a pointer device, named `notHover`.

You would then produce the set of media components like so:

```tsx
const MyAppMediaComponents = createMedia({
  breakpoints: {
    sm: 0,
    md: 768
    lg: 1024,
    xl: 1192,
  },
  interactions: {
    hover: "(hover: hover)",
    notHover: "(hover: none)",
  },
})
```

As you can see, breakpoints are defined by their _start_ offset, where the first
one is expected to start at 0.

Besides the `Media` and `MediaContextProvider` components, a `MediaStyle`
function that produces the CSS styling for all possible media queries that the
`Media` instance can make use of. Be sure to insert this with a `<style>`
element into your document’s `<head>` element.

```tsx
import { Style } from "react-head"
import { MediaContextProvider } from "./Responsive"
import { Home } from "./Home"

const App = () => (
  <>
    <Style>{MediaStyle()}</Style>
    <MediaContextProvider>
      <Home />
    </MediaContextProvider>
  </>
)
```

It’s advisable to do this setup in its own module so that it can be easily
imported throughout your application:

```tsx
export const { MediaContextProvider, Media, MediaStyle } = MyAppMediaComponents
```

### MediaContextProvider

The `MediaContextProvider` component influences how `Media` components will be
rendered.

#### onlyMatch

Rendering can be constrained to specific breakpoints/interactions by specifying
a list of media queries to match. By default _all_ will be rendered.

#### disableDynamicMediaQueries

By default, when rendered client-side, the browser’s [`matchMedia`
api][match-media-api] will be used to _further_ constrain the `onlyMatch` list
to only the currently matching media queries. This is done to avoid triggering
mount related life-cycle hooks of hidden components.

Disabling this behaviour is mostly intended for debugging purposes.

### Media

The `Media` component created for your application has a few mutually exclusive
props that make up the API you’ll use to declare your responsive layouts. These
props all operate based on the named breakpoints that were provided when you
created the media components.

The examples given for each prop use breakpoint definitions as defined in the
above ‘Setup’ section.

#### at

Use this to declare that children should only be visible at a specific
breakpoint, meaning that the viewport width is greater than or equal to the
start offset of the breakpoint, but less than the next breakpoint, if one
exists.

For example, children of this `Media` declaration will only be visible if the
viewport width is between 0 and 768 points:

```tsx
<Media at="sm">...</Media>
```

#### lessThan

Use this to declare that children should only be visible while the viewport
width is less than the start offset of the specified breakpoint.

For example, children of this `Media` declaration will only be visible if the
viewport width is between 0 and 1024 points:

```tsx
<Media lessThan="lg">...</Media>
```

#### greaterThan

Use this to declare that children should only be visible while the viewport
width is greater than the start offset of the _next_ breakpoint.

For example, children of this `Media` declaration will only be visible if the
viewport width is greater than 1024 points:

```tsx
<Media greaterThan="md">...</Media>
```

#### greaterThanOrEqual

Use this to declare that children should only be visible while the viewport
width is equal to the start offset of the specified breakpoint _or_ greater.

For example, children of this `Media` declaration will only be visible if the
viewport width is 768 points or up:

```tsx
<Media greaterThanOrEqual="md">...</Media>
```

#### between

Use this to declare that children should only be visible while the viewport
width is equal to the start offset of the first specified breakpoint but less
than the start offset of the second specified breakpoint.

For example, children of this `Media` declaration will only be visible if the
viewport width is between 768 and 1192 points:

```tsx
<Media between={["md", "xl"]}>...</Media>
```

## Pros vs Cons

Pros:

- Built on top of simple, proven technology: HTML and CSS media queries.
- Users see rendered markup at the correct breakpoint for their device, even
  before React has been loaded.

Cons:

- If utilizing SSR rendering features, when the markup is passed down from the
  server to the client it includes _all_ breakpoints, which increases the page
  size. (However, once the client mounts, the unused breakpoint markup is
  cleared from the DOM.)
- The current media query is no longer something components can access; it is
  determined only by the props of the `<Media>` component they find themselves
  in.

That last point presents an interesting problem. How might we represent a
component that gets styled differently at different breakpoints? (Let’s imagine
a `matchMedia` example.)

```tsx
<Sans size={xs ? 2 : 3}>
```

```tsx
<>
  <Media at="xs">
    {this.getComponent('xs')
  </Media>
  <Media greaterThan="xs">
    {this.getComponent()
  </Media>
</>
```

```tsx
getComponent(breakpoint?: string) {
  const xs = breakpoint === 'xs'
  return <Sans size={xs ? 2 : 3} />
}
```

We're still figuring out patterns for this, so please [let us know][new-issue]
if you have suggestions.

## Development

<details>

This project uses [auto-release](https://github.com/intuit/auto-release#readme)
to automatically release on every PR. Every PR should have a label that matches
one of the following

- Version: Trivial
- Version: Patch
- Version: Minor
- Version: Major

Major, minor, and patch will cause a new release to be generated. Use major for
breaking changes, minor for new non-breaking features, and patch for bug fixes.
Trivial will not cause a release and should be used when updating documentation
or non-project code.

If you don't want to release on a particular PR but the changes aren't trivial
then use the `Skip Release` tag along side the appropriate version tag.

</details>

[ci]: https://circleci.com/gh/artsy/react-responsive-media
[ci-icon]: https://circleci.com/gh/artsy/react-responsive-media.svg?style=shield
[npm]: https://www.npmjs.com/package/@artsy/react-responsive-media
[npm-icon]: https://badge.fury.io/js/%40artsy%2Freact-responsive-media.svg
[react-responsive]: https://github.com/contra/react-responsive
[react-media]: https://github.com/ReactTraining/react-media
[match-media-api]:
  https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
[new-issue]: https://github.com/artsy/react-responsive-media/issues/new
[release-tags]:
  https://github.com/artsy/react-responsive-media/blob/master/package.json
