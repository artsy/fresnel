import { createMedia } from "@artsy/react-responsive-media"

const ExampleAppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
  interactions: {},
})

export const { Media, MediaContextProvider, createMediaStyle } = ExampleAppMedia
