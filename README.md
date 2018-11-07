# @artsy/react-responsive-media

[![CircleCI](https://circleci.com/gh/artsy/responsive.svg?style=shield)](https://circleci.com/gh/artsy/react-responsive-media)
[![npm version](https://badge.fury.io/js/%40artsy%2Fresponsive.svg)](https://www.npmjs.com/package/@artsy/react-responsive-media)

### Installation

```sh
  yarn add @artsy/react-responsive-media
```

# TODO:

- [x] API
- [x] Core implementation
- [ ] Deal with issue of invisible components being mounted (which may lead to accidental side-effects).
      _A quick and dirty implementation exists, but needs to be taken to completion either now or in a next PR._
- [ ] Put examples of API usage in this PR description.
- [ ] Make a final call on the deprecation path for `Responsive`.
- [ ] Write guide for README repo that outlines process of writing responsive components:
  1. Use styled-system’s responsive props when layout only slightly adapts (TODO come up with better terminology for this)
  2. When design changes in a way that’s not solvable by responsive props, use `Media` API, but on the component nearest to the leaf of the tree.
- [ ] Add a link to the README guide in the `Responsive` deprecation warning.

### Overview

When writing responsive components it's common to use media queries to adjust the display when certain conditions are met. Historically this has taken place directly in CSS:

```js
const Layout = styled.div`
  @media screen and (max-width: 767px) {
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    width: 50%;
  }
`
```

By hooking into a breakpoint definition, `@artsy/react-responsive-media` takes this imperative approach and makes it declarative:

```js
import { createMedia } from '@artsy/react-responsive-media'

const { MediaContextProvider, Media } = createMedia({
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
```

But why go this route when one can use a conditionally rendered approach similar to [`react-responsive`](https://github.com/contra/react-responsive) or [`react-media`](https://github.com/ReactTraining/react-media)?

Server side rendering!

But first, what is conditional rendering?

In the React ecosystem a common approach to writing declarative responsive components is to use the [`matchMedia` api](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia):

```js
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

On the client, when a given breakpoint is matched React conditionally renders a tree.

However, this approach suffers from a few flaws when used in conjunction with server-side rendering (SSR):

- It's impossible to reliably know the user's current breakpoint during the server render phase since that requires a browser.
- Setting breakpoint sizes based on user-agent sniffing is prone to errors due the inability to precisely match device capabilities to size. One mobile device might have greater pixel density than another, a mobile device may fit multiple breakpoints when taking device orientation into consideration, etc. The best devs can do is guess the current breakpoint and populate `<Responsive>` with assumed state.

Artsy approaches this problem in the following way:

1. Render markup for all breakpoints on the server and send it down the wire.
2. The browser receives markup with proper media query styling and will immediately start rendering the expected visual result for whatever viewport width the browser is at.
3. When all JS has loaded and React starts the rehydration phase, we query the browser synchronously for what breakpoint it’s at and then limit the rendered components to the matching breakpoints. This prevents lifecycle methods from firing in hidden components and unused html being written to the DOM.
4. Additionally, we register event listeners with the browser to notify the `MediaContextProvider` when a different breakpoint is matched and then re-render the tree using the new value for `renderOnlyAt`.

See [#server-side-rendering] for a complete example.

### Setup

First things first. You’ll need to define the breakpoints of your design to
produce the set of media components you can use throughout your application.

For example, consider an application that has the following breakpoints:

- A viewport width between 1 and 768 points, named `sm`.
- A viewport width between 768 and 1024 points, named `md`.
- A viewport width between 1024 and 1192 points, named `lg`.
- A viewport width from 1192 points and above, named `xl`.

You would then produce the set of media components like so:

```tsx
const MyAppMediaComponents = createMedia({
  breakpoints: {
    sm: 0,
    md: 768
    lg: 1024,
    xl: 1192,
  },
  interactions: {}, // TODO: Ignore for now
})
```

As you can see, breakpoints are defined by their _start_ offset, where the first
one is expected to start at 0.

It’s advisable to do this setup in its own module so that it can be easily
imported throughout your application:

```tsx
// Responsive.js

export const { MediaContextProvider, Media } = MyAppMediaComponents
```

And then elsewhere

````tsx
// App.js

import { MediaContextProvider } from './Responsive'
import { Home } from './Home'

const App = () => (
  <MediaContextProvider>
    <Home />
  </MediaContextProvider>
)


// Home.js

import { Media } from './Responsive'

export const Home = () => (
  <>
    <Media at='sm'>
      <MobileLayout />
    </Media>
    <Media greaterThanOrEqual='md'>
      <DesktopLayout />
    </Media>
  </>
)
````

### Usage API

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
````

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

## Server-side rendering

## Client-side rendering

## Pros vs Cons

## Development

<details>

Circle CI is set up to publish releases to NPM automatically via [semantic-release](https://github.com/semantic-release/semantic-release) following every successful merge to master.

Release versions (major, minor, patch) are triggered [by commit messages](https://github.com/semantic-release/semantic-release#commit-message-format), when they adhere to [Ember conventions](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-ember/readme.md):

```
[TAG context] commit message
```

[Valid tags](https://github.com/artsy/responsive/blob/master/package.json#L10) for release include PATCH, DOC, FIX (patch), FEATURE (minor), and BREAKING (major). A context is also required. Commits that do not adhere to this convention will not trigger an NPM release.

##### Example Patch Release

```
[FIX typeface] Add missing unit
[PATCH tooling] Bump version
```

##### Example Minor (Feature) Release

```
[FEATURE ios] Add View primitive
```

##### Example Major (Breaking) Release

```
[BREAKING refactor] Update API to support new platform
```

</details>
