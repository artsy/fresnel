### @artsy/fresnel

# Basic Example

Showcases the simplest possible use-case for `@artsy/fresnel`, and how one would use the lib when working on a typical client-side app.

To run the example:

```
yarn install
yarn start
```

#### Example Breakdown

```js
const ExampleAppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
})

const { Media, MediaContextProvider } = ExampleAppMedia

const App = () => {
  return (
    <MediaContextProvider>
      <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media>
    </MediaContextProvider>
  )
}
```
