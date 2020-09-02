import { createMedia } from "@artsy/fresnel"

const ExampleAppMedia = createMedia({
  interactions: {
    landscape: "not all and (orientation: landscape)",
    portrait: "not all and (orientation: portrait)",
    hover: "(hover: hover)",
    notHover: "(hover: none)",
  },
  breakpoints: {
    sm: 0,
    md: 768,
    lg: 1024,
    xl: 1192,
  },
})

// Make styles for injection into the header of the page
export const mediaStyles = ExampleAppMedia.createMediaStyle()

export const { Media, MediaContextProvider } = ExampleAppMedia
