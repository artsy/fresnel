import { createMedia } from "../../../src/index"

const ExampleAppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
})

export const { Media, MediaContextProvider, createMediaStyle } = ExampleAppMedia
