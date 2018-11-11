// tslint:disable:jsdoc-format

import React from "react"
import { createResponsiveComponents } from "./DynamicResponsive"
import { MediaQueries } from "./MediaQueries"
import { intersection, propKey, createClassName } from "./Utils"

/**
 * A render prop that can be specified to retrieve the class name of the `Media`
 * component usage, so it can be used to apply to another element instead of the
 * default `div.
 */
export type RenderProp = ((
  className: string,
  renderChildren: boolean
) => React.ReactNode)

// TODO: All of these props should be mutually exclusive. Using a union should
//       probably be made possible by https://github.com/Microsoft/TypeScript/pull/27408.
export interface MediaBreakpointProps<B = string> {
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
   * Either typical React nodes, in which case they will be wrapped in a `div`
   * element that using styled-components has had the media query applied.
   *
   * In case a different element is preferred or styling for both the matching
   * and not matching states should be added, a render prop can be provided.
   *
   * However, when doing this be sure to not create the styled component inline!
   * Doing so will trigger re-renders of its children on each render pass.
   * Instead define it once outside of your component’s render implementation
   * and pass the styling in as a prop:
   *
   * @example
   *
     ```tsx
     const Container = styled.span<{ responsiveStyle: InterpolationValue[] }>`
       ${props => props.responsiveStyle};
       // Regular component styling
       // ...
     `

     const Component = () => (
       <Media greaterThan="xs">
         {generatedStyle => (
           <Container
             responsiveStyle={generatedStyle(css`
               // Optional styling that is applied to the matching state
               font-family: "Comic Sans MS";
             `)}
           >
             ohai
           </Container>
         )}
       </Media>
     )
     ```
   *
   */
  children: React.ReactNode | RenderProp
}

export interface MediaContextProviderProps<M> {
  /**
   * Disables usage of browser MediaQuery API to only render at the current
   * breakpoint.
   *
   * Disabling this means React components for all breakpoints will mount and
   * shown/hidden only based on pure CSS media queries. Use this with caution.
   */
  disableDynamicMediaQueries?: boolean

  /**
   * This list of breakpoints and interactions can be used to limit the rendered
   * output to these.
   *
   * For instance, when a server knows for some user-agents that certain
   * breakpoints will never apply, omitting them altogether will lower the
   * rendered byte size.
   */
  onlyMatch?: M[]
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
    interactions: { [key: string]: string }
  }
>(config: C) {
  type B = keyof C["breakpoints"]
  type I = keyof C["interactions"]

  const mediaQueries = new MediaQueries(config.breakpoints, config.interactions)

  const DynamicResponsive = createResponsiveComponents()

  const MediaContext = React.createContext<MediaContextProviderProps<B | I>>({})
  MediaContext.Consumer.displayName = "Media.Context"
  MediaContext.Provider.displayName = "Media.Context"

  const MediaContextProvider: React.SFC<MediaContextProviderProps<B | I>> = ({
    disableDynamicMediaQueries,
    onlyMatch,
    children,
  }) => {
    if (disableDynamicMediaQueries) {
      return (
        <MediaContext.Provider
          value={{
            onlyMatch,
          }}
        >
          {children}
        </MediaContext.Provider>
      )
    } else {
      return (
        <DynamicResponsive.Provider
          mediaQueries={mediaQueries.getDynamicResponsiveMediaQueries()}
          initialMatchingMediaQueries={intersection(
            mediaQueries.getMediaQueryTypes(),
            onlyMatch
          )}
        >
          <DynamicResponsive.Consumer>
            {matches => {
              const matchingMediaQueries = Object.keys(matches).filter(
                key => matches[key]
              )
              return (
                <MediaContext.Provider
                  value={{
                    onlyMatch: intersection(matchingMediaQueries, onlyMatch),
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
  const Media = class extends React.Component<MediaProps<B, I>> {
    constructor(props) {
      super(props)
      validateProps(props)
    }

    render() {
      const props = this.props
      return (
        <MediaContext.Consumer>
          {({ onlyMatch } = {}) => {
            let className: string | null
            const { children, interaction, ...breakpointProps } = props
            if (props.interaction) {
              className = createClassName("interaction", props.interaction)
            } else {
              if (props.at) {
                const lastBreakpoint = mediaQueries.getLastBreakpoint()
                if (props.at === lastBreakpoint) {
                  // TODO: We should look into making React’s __DEV__ available
                  //       and have webpack completely compile these away.
                  let ownerName = null
                  try {
                    const owner = (this as any)._reactInternalFiber._debugOwner
                      .type
                    ownerName = owner.displayName || owner.name
                  } catch (err) {
                    // no-op
                  }

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
              }

              const type = propKey(breakpointProps)
              const breakpoint = breakpointProps[type]
              className = createClassName(type, breakpoint)
            }

            const renderChildren =
              onlyMatch === undefined ||
              mediaQueries.shouldRenderMediaQuery(
                { ...breakpointProps, interaction },
                onlyMatch
              )

            if (props.children instanceof Function) {
              return props.children(className, renderChildren)
            } else {
              return (
                <div className={className}>
                  {renderChildren ? props.children : null}
                </div>
              )
            }
          }}
        </MediaContext.Consumer>
      )
    }
  }

  return {
    Media,
    MediaContextProvider,
    MediaStyle: mediaQueries.toStyle().join("\n"),
  }
}

const MutuallyExclusiveProps = MediaQueries.validKeys()

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
