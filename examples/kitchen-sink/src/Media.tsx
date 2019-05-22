import { createMedia } from "@artsy/react-responsive-media"

const ExampleAppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 500,
    md: 1000,
    lg: 1200,
  },
  interactions: {
    hover: "(pointer: coarse), (-moz-touch-enabled: 1)",
    notHover:
      "not all and (pointer: coarse), not all and (-moz-touch-enabled: 1)",
  },
})

export const mediaStyle = ExampleAppMedia.createMediaStyle()

export const {
  Media,
  MediaContextProvider,
  findBreakpointsForWidths,
  findBreakpointAtWidth,
  SortedBreakpoints,
} = ExampleAppMedia

export const SSRStyleID = "ssr-rrm-style"
