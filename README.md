# @artsy/fresnel

[![CircleCI][ci-icon]][ci] [![npm version][npm-icon]][npm]

> The Fresnel equations describe the reflection of light when incident on an
> interface between different optical media.

– https://en.wikipedia.org/wiki/Fresnel_equations

## Installation

```sh
  yarn add @artsy/fresnel
```

**Table of Contents**

- [Overview](#overview)
- [Basic Example](#basic-example)
- [Server-side Rendering (SSR)](#server-side-rendering-ssr-usage)
- [Usage with Gatsby or Next](#usage-with-gatsby-or-next)
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

By hooking into a breakpoint definition, `@artsy/fresnel` takes this declarative
approach and brings it into the React world.

## Basic Example

```tsx
import React from "react"
import ReactDOM from "react-dom"
import { createMedia } from "@artsy/fresnel"

const { MediaContextProvider, Media } = createMedia({
  // breakpoints values can be either strings or integers
  breakpoints: {
    sm: 0,
    md: 768,
    lg: 1024,
    xl: 1192,
  },
})

const App = () => (
  <MediaContextProvider>
    <Media at="sm">
      <MobileApp />
    </Media>
    <Media at="md">
      <TabletApp />
    </Media>
    <Media greaterThanOrEqual="lg">
      <DesktopApp />
    </Media>
  </MediaContextProvider>
)

ReactDOM.render(<App />, document.getElementById("react"))
```

## Server-side Rendering (SSR) Usage

The first important thing to note is that when server-rendering with
`@artsy/fresnel`, all breakpoints get rendered by the server. Each `Media`
component is wrapped by plain CSS that will only show that breakpoint if it
matches the user's current browser size. This means that the client can
accurately start rendering the HTML/CSS while it receives the markup, which is
long before the React application has booted. This improves perceived
performance for end-users.

Why not just render the one that the current device needs? We can't accurately
identify which breakpoint your device needs on the server. We could use a
library to sniff the browser user-agent, but those aren't always accurate, and
they wouldn't give us all the information we need to know when we are
server-rendering. Once client-side JS boots and React attaches, it simply washes
over the DOM and removes markup that is unneeded, via a `matchMedia` call.

### SSR Example

First, configure `@artsy/fresnel` in a `Media` file that can be shared across
the app:

```tsx
// Media.tsx

import { createMedia } from "@artsy/fresnel"

const ExampleAppMedia = createMedia({
  breakpoints: {
    sm: 0,
    md: 768,
    lg: 1024,
    xl: 1192,
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
      <Media at="sm">Hello mobile!</Media>
      <Media greaterThan="sm">Hello desktop!</Media>
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
mobile size and reload; it will correctly render the mobile layout without the
need to use a user-agent or other server-side "hints".

## Usage with Gatsby or Next

`@artsy/fresnel` works great with Gatsby or Next.js's static hybrid approach to
rendering. See the examples below for a simple implementation.

## Example Apps

There are four examples one can explore in the `/examples` folder:

- [Basic](examples/basic)
- [Server-side Rendering](examples/ssr-rendering)
- [Gatsby](examples/gatsby)
- [Next](examples/nextjs)
- [Kitchen Sink](examples/kitchen-sink)

While the `Basic` and `SSR` examples will get one pretty far, `@artsy/fresnel`
can do a lot more. For an exhaustive deep-dive into its features, check out the
[Kitchen Sink](examples/kitchen-sink) app.

If you're using Gatsby, you can also try [gatsby-plugin-fresnel](https://github.com/chrissantamaria/gatsby-plugin-fresnel) for easy configuration.

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
  {({ sm }) => {
    if (sm) {
      return <MobileApp />
    } else {
      return <DesktopApp />
    }
  }}
</Responsive>
```

On the client, when a given breakpoint is matched React conditionally renders a
tree.

However, this approach has some limitations for what we wanted to achieve with
our server-side rendering setup:

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
   from firing in hidden components and unused html being re-written to the DOM.

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
  {({ sm }) => {
    if (sm) return <SmallArticleItem {...props} />
    else return <LargeArticleItem {...props} />
  }}
</Responsive>
```

</td>
<td>

```tsx
<>
  <Media at="sm">
    <SmallArticleItem {...props} />
  </Media>
  <Media greaterThan="sm">
    <LargeArticleItem {...props} />
  </Media>
</>
```

</td></tr>
</table>

See the [server-side rendering](examples/ssr-rendering) app for a working
example.

## API

### createMedia

First things first. You’ll need to define the breakpoints and interaction needed
for your design to produce the set of media components you can use throughout
your application.

For example, consider an application that has the following breakpoints:

- A viewport width between 0 and 768 (768 not included) points, named `sm`.
- A viewport width between 768 and 1024 (1024 not included) points, named `md`.
- A viewport width between 1024 and 1192 (1192 not included) points, named `lg`.
- A viewport width from 1192 points and above, named `xl`.

And the following interactions:

- A device that supports hovering a pointer device, named `hover`.
- A device that does not support hovering a pointer device, named `notHover`.

You would then produce the set of media components like so:

```tsx
// Media.tsx

const ExampleAppMedia = createMedia({
  breakpoints: {
    sm: 0,
    md: 768,
    lg: 1024,
    xl: 1192,
  },
  interactions: {
    hover: "(hover: hover)",
    notHover: "(hover: none)",
    landscape: "not all and (orientation: landscape)",
    portrait: "not all and (orientation: portrait)",
  },
})

export const { Media, MediaContextProvider, createMediaStyle } = ExampleAppMedia
```

As you can see, breakpoints are defined by their _start_ offset, where the first
one is expected to start at 0.

### MediaContextProvider

The `MediaContextProvider` component influences how `Media` components will be
rendered. Mount it at the root of your component tree:

```tsx
import React from "react"
import { MediaContextProvider } from "./Media"

export const App = () => {
  return <MediaContextProvider>...</MediaContextProvider>
}
```

### Media

The `Media` component created for your application has a few mutually exclusive
props that make up the API you’ll use to declare your responsive layouts. These
props all operate based on the named breakpoints that were provided when you
created the media components.

```tsx
import React from "react"
import { Media } from "./Media"

export const HomePage = () => {
  return (
    <>
      <Media at="sm">Hello mobile!</Media>
      <Media greaterThan="sm">Hello desktop!</Media>
    </>
  )
}
```

The examples given for each prop use breakpoint definitions as defined in the
above ‘Setup’ section.

If you would like to avoid the underlying div that is generated by `<Media>` and
instead use your own element, use the render-props form but be sure to **not**
render any children when not necessary:

```tsx
export const HomePage = () => {
  return (
    <>
      <Media at="sm">Hello mobile!</Media>
      <Media greaterThan="sm">
        {(mediaClassNames, renderChildren) => {
          return (
            <MySpecialComponent className={mediaClassNames}>
              {renderChildren ? "Hello desktop!" : null}
            </MySpecialComponent>
          )
        }}
      </Media>
    </>
  )
}
```

#### createMediaStyle

> Note: This is only used when SSR rendering

Besides the `Media` and `MediaContextProvider` components, there's a
`createMediaStyle` function that produces the CSS styling for all possible media
queries that the `Media` instance can make use of while markup is being passed
from the server to the client during hydration. If only a subset of breakpoint
keys is used those can be optional specified as a parameter to minimize the
output. Be sure to insert this within a `<style>` tag
[in your document’s `<head>`](https://github.com/artsy/fresnel/blob/master/examples/ssr-rendering/src/server.tsx#L28).

It’s advisable to do this setup in its own module so that it can be easily
imported throughout your application:

```tsx
import { createMedia } from "@artsy/fresnel"

const ExampleAppMedia = createMedia({
  breakpoints: {
    sm: 0,
    md: 768,
    lg: 1024,
    xl: 1192,
  },
})

// Generate CSS to be injected into the head
export const mediaStyle = ExampleAppMedia.createMediaStyle() // optional: .createMediaStyle(['at'])
export const { Media, MediaContextProvider } = ExampleAppMedia
```

#### onlyMatch

Rendering can be constrained to specific breakpoints/interactions by specifying
a list of media queries to match. By default _all_ will be rendered.

#### disableDynamicMediaQueries

By default, when rendered client-side, the browser’s [`matchMedia`
api][match-media-api] will be used to _further_ constrain the `onlyMatch` list
to only the currently matching media queries. This is done to avoid triggering
mount related life-cycle hooks of hidden components.

Disabling this behaviour is mostly intended for debugging purposes.

#### at

Use this to declare that children should only be visible at a specific
breakpoint, meaning that the viewport width is greater than or equal to the
start offset of the breakpoint, but less than the next breakpoint, if one
exists.

For example, children of this `Media` declaration will only be visible if the
viewport width is between 0 and 768 (768 not included) points:

```tsx
<Media at="sm">...</Media>
```

The corresponding css rule:

```css
@media not all and (min-width: 0px) and (max-width: 767px) {
  .fresnel-at-sm {
    display: none !important;
  }
}
```

#### lessThan

Use this to declare that children should only be visible while the viewport
width is less than the start offset of the specified breakpoint.

For example, children of this `Media` declaration will only be visible if the
viewport width is between 0 and 1024 (1024 not included) points:

```tsx
<Media lessThan="lg">...</Media>
```

The corresponding css rule:

```css
@media not all and (max-width: 1023px) {
  .fresnel-lessThan-lg {
    display: none !important;
  }
}
```

#### greaterThan

Use this to declare that children should only be visible while the viewport
width is equal or greater than the start offset of the _next_ breakpoint.

For example, children of this `Media` declaration will only be visible if the
viewport width is equal or greater than 1024 points:

```tsx
<Media greaterThan="md">...</Media>
```

The corresponding css rule:

```css
@media not all and (min-width: 1024px) {
  .fresnel-greaterThan-md {
    display: none !important;
  }
}
```

#### greaterThanOrEqual

Use this to declare that children should only be visible while the viewport
width is equal to the start offset of the specified breakpoint _or_ greater.

For example, children of this `Media` declaration will only be visible if the
viewport width is 768 points or up:

```tsx
<Media greaterThanOrEqual="md">...</Media>
```

The corresponding css rule:

```css
@media not all and (min-width: 768px) {
  .fresnel-greaterThanOrEqual-md {
    display: none !important;
  }
}
```

#### between

Use this to declare that children should only be visible while the viewport
width is equal to the start offset of the first specified breakpoint but less
than the start offset of the second specified breakpoint.

For example, children of this `Media` declaration will only be visible if the
viewport width is between 768 and 1192 (1192 not included) points:

```tsx
<Media between={["md", "xl"]}>...</Media>
```

The corresponding css rule:

```css
@media not all and (min-width: 768px) and (max-width: 1191px) {
  .fresnel-between-md-xl {
    display: none !important;
  }
}
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
<Sans size={sm ? 2 : 3}>
```

```tsx
<>
  <Media at="sm">
    {this.getComponent('sm')}
  </Media>
  <Media greaterThan="sm">
    {this.getComponent()}
  </Media>
</>
```

```tsx
getComponent(breakpoint?: string) {
  const sm = breakpoint === 'sm'
  return <Sans size={sm ? 2 : 3} />
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

[ci]: https://circleci.com/gh/artsy/fresnel
[ci-icon]: https://circleci.com/gh/artsy/fresnel.svg?style=shield
[npm]: https://www.npmjs.com/package/@artsy/fresnel
[npm-icon]: https://badge.fury.io/js/%40artsy%2Ffresnel.svg
[react-responsive]: https://github.com/contra/react-responsive
[react-media]: https://github.com/ReactTraining/react-media
[match-media-api]:
  https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
[new-issue]: https://github.com/artsy/fresnel/issues/new
[release-tags]: https://github.com/artsy/fresnel/blob/master/package.json
