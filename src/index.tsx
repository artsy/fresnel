// FIXME: Remove palette
import { themeProps } from "@artsy/palette"
import React from "react"
import styled, { css, InterpolationValue } from "styled-components"
import { createResponsiveComponents } from "./DeprecatedResponsive"

type RenderProp = ((
  generatedStyle: RenderPropStyleGenerator
) => React.ReactNode)

type RenderPropStyleGenerator = (
  matchingStyle?: InterpolationValue[]
) => InterpolationValue[]

const MutuallyExclusiveProps = [
  "query",
  "at",
  "lessThan",
  "greaterThan",
  "greaterThanOrEqual",
  "between",
  "interaction",
]

// TODO: All of these props should be mutually exclusive. Using a union should
//       probably be made possible by https://github.com/Microsoft/TypeScript/pull/27408.
export interface MediaProps<B, I> {
  /**
   * Allows you to pass in any CSS Media Query that will be used to
   * conditionally show or hide the children.
   *
   * Use this sparingly and consider making your use-case part of the API,
   * because these raw strings cannot be used directly on React Native.
   */
  query?: string

  // tslint:disable:jsdoc-format

  /**
   * Children will only be shown if the viewport matches the specified
   * breakpoint. That is, a viewport width that’s higher than the configured
   * breakpoint value, but lower than the value of the next breakpoint, if any
   * larger breakpoints exist at all.
   *
   * @example

     ```tsx
     // With breakpoints defined like these
     { xs: 0, sm: 768, md: 1024 }

     // Matches a viewport that has a width between 0 and 768
     <Media at="xs">ohai</Media>

     // Matches a viewport that has a width between 768 and 1024
     <Media at="sm">ohai</Media>

     // Matches a viewport that has a width over 1024
     <Media at="md">ohai</Media>
     ```
   *
   */
  at?: B

  /**
   * Children will only be shown if the viewport is smaller than the specified
   * breakpoint.
   *
   * @example

     ```tsx
     // With breakpoints defined like these
     { xs: 0, sm: 768, md: 1024 }

    // Matches a viewport that has a width from 0 to 767
     <Media lessThan="sm">ohai</Media>

     // Matches a viewport that has a width from 0 to 1023
     <Media lessThan="md">ohai</Media>
     ```
   *
   */
  lessThan?: B

  /**
   * Children will only be shown if the viewport is greater than the specified
   * breakpoint.
   *
   * @example

     ```tsx
     // With breakpoints defined like these
     { xs: 0, sm: 768, md: 1024 }

     // Matches a viewport that has a width from 768 to infinity
     <Media greaterThan="xs">ohai</Media>

     // Matches a viewport that has a width from 1024 to infinity
     <Media greaterThan="sm">ohai</Media>
     ```
   *
   */
  greaterThan?: B

  /**
   * Children will only be shown if the viewport is greater or equal to the
   * specified breakpoint.
   *
   * @example

     ```tsx
     // With breakpoints defined like these
     { xs: 0, sm: 768, md: 1024 }

     // Matches a viewport that has a width from 0 to infinity
     <Media greaterThanOrEqual="xs">ohai</Media>

     // Matches a viewport that has a width from 768 to infinity
     <Media greaterThanOrEqual="sm">ohai</Media>

     // Matches a viewport that has a width from 1024 to infinity
     <Media greaterThanOrEqual="md">ohai</Media>
     ```
   *
   */
  greaterThanOrEqual?: B

  /**
   * Children will only be shown if the viewport is between the specified
   * breakpoints. That is, a viewport width that’s higher than or equal to the
   * small breakpoint value, but lower than the value of the large breakpoint.
   *
   * @example

     ```tsx
     // With breakpoints defined like these
     { xs: 0, sm: 768, md: 1024 }

     // Matches a viewport that has a width from 0 to 767
     <Media between={["xs", "sm"]}>ohai</Media>

     // Matches a viewport that has a width from 0 to 1023
     <Media between={["xs", "md"]}>ohai</Media>
     ```
   *
   */
  between?: [B, B]

  /**
   * Children will only be shown if the interaction query matches.
   *
   * @example

     ```tsx
     // With interactions defined like these
     { hover: negate => `(hover: ${negate ? "hover" : "none"})` }

     // Matches an input device that is capable of hovering
     <Media interaction="hover">ohai</Media>
     ```
   */
  interaction?: I

  /**
   * Used to negate an `interaction`.
   *
   * @example

     ```tsx
     // With interactions defined like these
     { hover: negate => `(hover: ${negate ? "hover" : "none"})` }

     // Matches an input device that is not capable of hovering
     <Media not interaction="hover">ohai</Media>
     ```
   *
   */
  not?: boolean

  /**
   * Either typical React nodes, in which case they will be wrapped in a `div`
   * element that using styled-components has had the media query applied.
   *
   * In case a different element is preferred or styling for both the matching
   * and not matching states should be added, a render prop can be provided.
   *
   * @example
   *
     ```tsx
     <Media greaterThan="xs">
      {generatedStyle => {
        const Container = styled.span`
          // Regular component styling
          ${generatedStyle(css`
            // Optional styling that is applied to the matching state
            font-family: "Comic Sans MS";
          `)}
        `
        return <Container>ohai</Container>
      }}
     </Media>
     ```
   *
   */
  children: React.ReactNode | RenderProp
}

export interface MediaContextProviderProps<B> {
  /**
   * This list of breakpoints can be used to limit the rendered output to these.
   *
   * For instance, when a server knows for some user-agents that certain
   * breakpoints will never apply, omitting them altogether will lower the
   * rendered byte size.
   */
  onlyRenderAt?: B[]
}

/**
 * This is used to generate a Media component and its context provider based on
 * your application’s breakpoints and interactions.
 *
 * @example
 *
   ```tsx
   const MyAppMedia = createMedia({
     breakpoints: {
       xs: 0,
       sm: 768,
       md: 900
       lg: 1024,
       xl: 1192,
     },
     interactions: {
       hover: negate => `(hover: ${negate ? "hover" : "none"})`
     },
   })

   export const Media = MyAppMedia.Media
   export const MediaContextProvider = MyAppMedia.MediaContextProvider
   ```
 *
 */
export function createMedia<
  C extends {
    breakpoints: { [key: string]: number }
    interactions: { [key: string]: (negated: boolean) => string }
  }
>(config: C) {
  type B = keyof C["breakpoints"]
  type I = keyof C["interactions"]

  const DynamicResponsive = createResponsiveComponents()

  const MediaContext = React.createContext<MediaContextProviderProps<B>>({})
  const MediaContextProvider: React.SFC<MediaContextProviderProps<B>> = ({
    onlyRenderAt,
    children,
  }) => {
    const { hover, ...breakpointMediaQueries } = themeProps.mediaQueries
    return (
      <DynamicResponsive.Provider
        mediaQueries={breakpointMediaQueries as any}
        initialMatchingMediaQueries={["xs", "sm", "md", "lg", "xl"]}
      >
        <DynamicResponsive.Consumer>
          {matches => {
            const matchingBreakpoints = Object.keys(matches).filter(
              key => matches[key]
            )

            // FIXME: Remove
            // console.log(matchingBreakpoints)
            return (
              <MediaContext.Provider
                value={{
                  onlyRenderAt: onlyRenderAt || matchingBreakpoints,
                }}
              >
                {children}
              </MediaContext.Provider>
            )
          }}
        </DynamicResponsive.Consumer>
      </DynamicResponsive.Provider>
    )
  }

  const sortedBreakpoints = createSortedBreakpoints(config.breakpoints)
  const atRanges = createAtRanges(sortedBreakpoints)

  const findNextBreakpoint = (breakpoint: string) => {
    const nextBreakpoint =
      sortedBreakpoints[sortedBreakpoints.indexOf(breakpoint) + 1]
    if (!nextBreakpoint) {
      throw new Error(`There is no breakpoint larger than ${breakpoint}`)
    }
    return nextBreakpoint
  }

  // TODO: Ensure the component does not re-render if the instance’s query still
  //       matches a new `renderOnlyAt` value.
  const Media: React.SFC<MediaProps<B, I>> = props => {
    validateProps(props)

    return (
      <MediaContext.Consumer>
        {({ onlyRenderAt }) => {
          let query: string
          if (props.query) {
            query = props.query
          } else if (props.interaction) {
            query = config.interactions[props.interaction as string](
              !!props.not
            )
          } else {
            let breakpointProps = props
            if (breakpointProps.at) {
              if (onlyRenderAt && !onlyRenderAt.includes(breakpointProps.at)) {
                return null
              }
              breakpointProps = atRanges[breakpointProps.at as string]
            }
            if (breakpointProps.lessThan) {
              const width =
                config.breakpoints[breakpointProps.lessThan as string]
              if (onlyRenderAt) {
                const lowestAllowedWidth = Math.min(
                  ...onlyRenderAt.map(
                    breakpoint => config.breakpoints[breakpoint as string]
                  )
                )
                if (lowestAllowedWidth >= width) {
                  return null
                }
              }
              query = `(max-width:${width - 1}px)`
            } else if (breakpointProps.greaterThan) {
              const width =
                config.breakpoints[
                  findNextBreakpoint(breakpointProps.greaterThan as string)
                ]
              if (onlyRenderAt) {
                const highestAllowedWidth = Math.max(
                  ...onlyRenderAt.map(
                    breakpoint => config.breakpoints[breakpoint as string]
                  )
                )
                if (highestAllowedWidth < width) {
                  return null
                }
              }
              query = `(min-width:${width}px)`
            } else if (breakpointProps.greaterThanOrEqual) {
              const width =
                config.breakpoints[breakpointProps.greaterThanOrEqual as string]
              if (onlyRenderAt) {
                const highestAllowedWidth = Math.max(
                  ...onlyRenderAt.map(
                    breakpoint => config.breakpoints[breakpoint as string]
                  )
                )
                if (highestAllowedWidth < width) {
                  return null
                }
              }
              query = `(min-width:${width}px)`
            } else if (breakpointProps.between) {
              // TODO: This is the only useful breakpoint to negate, but we’ll
              //       we’ll see when/if we need it. We could then also decide
              //       to add `oustide`.
              const fromWidth =
                config.breakpoints[breakpointProps.between[0] as string]
              const toWidth =
                config.breakpoints[breakpointProps.between[1] as string]
              if (onlyRenderAt) {
                const allowedWidths = onlyRenderAt.map(
                  breakpoint => config.breakpoints[breakpoint as string]
                )
                if (
                  Math.max(...allowedWidths) < fromWidth ||
                  Math.min(...allowedWidths) >= toWidth
                ) {
                  return null
                }
              }
              query = `(min-width:${fromWidth}px) and (max-width:${toWidth -
                1}px)`
            }
          }

          const generatedStyle: RenderPropStyleGenerator = matchingStyle => css`
            display: none;
            @media ${query} {
              display: inherit;
              ${matchingStyle};
            }
          `

          if (typeof props.children === "function") {
            // FIXME: This typings shouldn’t be necessary, because the actual type is
            //        ReactNode and is legal. However, for some reason it breaks the
            //        SFC typing of this component.
            return (props.children as any)(
              generatedStyle
            ) as React.ReactElement<any>
          }

          const MediaContainer = styled.div`
            ${generatedStyle()};
          `
          return <MediaContainer>{props.children}</MediaContainer>
        }}
      </MediaContext.Consumer>
    )
  }

  return { Media, MediaContextProvider }
}

function validateProps(props) {
  const selectedProps = Object.keys(props).filter(prop =>
    MutuallyExclusiveProps.includes(prop)
  )
  if (selectedProps.length < 1) {
    throw new Error(`1 of ${MutuallyExclusiveProps.join(", ")} is required.`)
  } else if (selectedProps.length > 1) {
    throw new Error(
      `Only 1 of ${selectedProps.join(", ")} is allowed at a time.`
    )
  }
  if (props.hasOwnProperty("not") && !props.interaction) {
    throw new Error(
      "The `not` prop is only allowed in combination with the `interaction` prop."
    )
  }
}

function createSortedBreakpoints(breakpoints: { [key: string]: number }) {
  return Object.keys(breakpoints)
    .map(breakpoint => [breakpoint, breakpoints[breakpoint]])
    .sort((a, b) => (a[1] < b[1] ? -1 : 1))
    .map(breakpointAndValue => breakpointAndValue[0] as string)
}

function createAtRanges(sortedBreakpoints: string[]) {
  const atRanges = {}
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < sortedBreakpoints.length; i++) {
    const from = sortedBreakpoints[i]
    const to = sortedBreakpoints[i + 1]
    if (to) {
      atRanges[from] = { between: [from, to] }
    } else {
      atRanges[from] = { greaterThanOrEqual: from }
    }
  }
  return atRanges
}
