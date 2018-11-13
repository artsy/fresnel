// tslint:disable:jsdoc-format

import React from "react"
import { createResponsiveComponents } from "./DynamicResponsive"
import { MediaQueries } from "./MediaQueries"
import { intersection, propKey, createClassName } from "./Utils"

/**
 * A render prop that can be used to render a different container element than
 * the default `div`.
 *
 * @see {@link MediaProps.children}.
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
     { hover: "(hover: hover)" }

     // Matches an input device that is capable of hovering
     <Media interaction="hover">ohai</Media>
     ```
   */
  interaction?: I

  /**
   * The component(s) that should conditionally be shown, depending on the media
   * query matching.
   *
   * In case a different element is preferred, a render prop can be provided
   * that receives the class-name it should use to have the media query styling
   * applied.
   *
   * Additionally, the render prop receives a boolean that indicates wether or
   * not its children should be rendered, which will be `false` if the media
   * query is not included in the `onlyMatch` list. Use this flag if your
   * component’s children may be expensive to render and you want to avoid any
   * unnecessary work.
   * (@see {@link MediaContextProviderProps.onlyMatch} for details)
   *
   * @example
   *
     ```tsx
     const Component = () => (
       <Media greaterThan="xs">
         {(className, renderChildren) => (
           <span className={className}>
             {renderChildren && "ohai"}
           </span>
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
   * This list of breakpoints and interactions can be used to limit the rendered
   * output to these.
   *
   * For instance, when a server knows for some user-agents that certain
   * breakpoints will never apply, omitting them altogether will lower the
   * rendered byte size.
   */
  onlyMatch?: M[]

  /**
   * Disables usage of browser MediaQuery API to only render at the current
   * breakpoint.
   *
   * Use this with caution, as disabling this means React components for all
   * breakpoints will be mounted client-side and all associated life-cycle hooks
   * will be triggered, which could lead to unintended side-effects.
   */
  disableDynamicMediaQueries?: boolean
}

/**
 * This is used to generate a Media component, its context provider, and CSS
 * rules based on your application’s breakpoints and interactions.
 *
 * Note that the interaction queries are entirely up to you to define and they
 * should be written in such a way that they match when you want the element to
 * be hidden.
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
       hover: `not all and (hover:hover)`
     },
   })

   export const Media = MyAppMedia.Media
   export const MediaContextProvider = MyAppMedia.MediaContextProvider
   export const MediaStyle = MyAppMedia.MediaStyle
   ```
 *
 */
export function createMedia<
  C extends {
    breakpoints: { [key: string]: number }
    interactions: { [key: string]: string }
  },
  B extends keyof C["breakpoints"],
  I extends keyof C["interactions"]
>(
  config: C
): {
  Media: React.ComponentType<MediaProps<B, I>>
  MediaContextProvider: React.ComponentType<MediaContextProviderProps<B | I>>
  MediaStyle: () => string
} {
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
  //       matches a new `onlyMatch` value.
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
                const largestBreakpoint = mediaQueries.getLargestBreakpoint()
                if (props.at === largestBreakpoint) {
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
                      "`at` is being used with the largest breakpoint. " +
                      "Consider using `<Media greaterThanOrEqual=" +
                      `"${largestBreakpoint}">\` to account for future ` +
                      `breakpoint definitions outside of this range.${
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
                <div className={`rrm-container ${className}`}>
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
    MediaStyle: mediaQueries.toStyle.bind(mediaQueries),
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
}
