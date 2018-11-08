// tslint:disable:jsdoc-format

import React from "react"
import styled, { css, InterpolationValue } from "styled-components"
import { createResponsiveComponents } from "./DynamicResponsive"
import {
  createSortedBreakpoints,
  createAtRanges,
  createBreakpointQueries,
  createBreakpointQuery,
} from "./Utils"

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

export interface MediaBreakpointProps<B> {
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
}

export interface MediaProps<B, I> extends MediaBreakpointProps<B> {
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
   * Disables usage of browser MediaQuery API to only render at the current
   * breakpoint.
   *
   * Disabling this means React components for all breakpoints will mount and
   * shown/hidden only based on pure CSS media queries. Use this with caution.
   */
  disableDynamicMediaQueries?: boolean

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

  const sortedBreakpoints = createSortedBreakpoints(config.breakpoints)
  const atRanges = createAtRanges(sortedBreakpoints)

  const DynamicResponsive = createResponsiveComponents()

  const MediaContext = React.createContext<MediaContextProviderProps<B>>({})
  MediaContext.Consumer.displayName = "Media.Context"
  MediaContext.Provider.displayName = "Media.Context"

  // TODO: Make sure this doesn’t render unnecessarily!
  const MediaContextProvider: React.SFC<MediaContextProviderProps<B>> = ({
    disableDynamicMediaQueries,
    onlyRenderAt,
    children,
  }) => {
    if (disableDynamicMediaQueries) {
      return (
        <MediaContext.Provider
          value={{
            onlyRenderAt,
          }}
        >
          {children}
        </MediaContext.Provider>
      )
    } else {
      const mediaQueries = createBreakpointQueries(
        config.breakpoints,
        sortedBreakpoints,
        atRanges
      )
      return (
        <DynamicResponsive.Provider
          mediaQueries={mediaQueries}
          initialMatchingMediaQueries={intersection(
            sortedBreakpoints,
            onlyRenderAt
          )}
        >
          <DynamicResponsive.Consumer>
            {matches => {
              const matchingBreakpoints = Object.keys(matches).filter(
                key => matches[key]
              )
              return (
                <MediaContext.Provider
                  value={{
                    onlyRenderAt: intersection(
                      matchingBreakpoints,
                      onlyRenderAt
                    ),
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
  }

  // TODO: Ensure the component does not re-render if the instance’s query still
  //       matches a new `renderOnlyAt` value.
  const Media: React.SFC<MediaProps<B, I>> = props => {
    validateProps(props)

    return (
      <MediaContext.Consumer>
        {({ onlyRenderAt } = {}) => {
          let query: string | null
          if (props.interaction) {
            query = config.interactions[props.interaction as string](
              !!props.not
            )
          } else {
            let breakpointProps = props

            // at
            if (breakpointProps.at) {
              if (onlyRenderAt && !onlyRenderAt.includes(breakpointProps.at)) {
                return null
              }

              const lastBreakpoint =
                sortedBreakpoints[sortedBreakpoints.length - 1]

              if (breakpointProps.at === lastBreakpoint) {
                // TODO: We should look into making React’s __DEV__ available
                //       and have webpack completely compile these away.
                const ownerName = null
                // try {
                //   // FIXME: This (seems) to only be accessible in React.Component
                //   //        classes. Since this is an SFC value is inaccessible. However,
                //   //        when converting this component to a class TS throws an error
                //   //        about private class being exported. This relates to the
                //   //        --emitDeclaration TS setting.
                //   ownerName = (this as any)._reactInternalFiber._debugOwner.type
                //     .name
                // } catch (err) {
                //   // no-op
                // }

                console.warn(
                  "[@artsy/react-responsive-media] " +
                    "`at` is being used with the largest breakpoint. Consider " +
                    `using <Media greaterThanOrEqual="${lastBreakpoint}"> to ` +
                    `account for dimensions outside of this range.${
                      ownerName
                        ? ` It is being used in the ${ownerName} component.`
                        : ""
                    }`
                )
              }

              breakpointProps = atRanges[breakpointProps.at] as MediaProps<B, I>
            }

            query = createBreakpointQuery(
              config.breakpoints,
              sortedBreakpoints,
              breakpointProps,
              onlyRenderAt
            )
          }

          if (!query) {
            return null
          }

          const generatedStyle: RenderPropStyleGenerator = matchingStyle => css`
            display: none;
            @media ${query} {
              display: contents;
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

function intersection(a1: any[], a2?: any[]) {
  return a2 ? a1.filter(element => a2.indexOf(element) >= 0) : a1
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
