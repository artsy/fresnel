// tslint:disable:jsdoc-format

import React, { CSSProperties } from "react"
import { createResponsiveComponents } from "./DynamicResponsive"
import { MediaQueries } from "./MediaQueries"
import {
  intersection,
  propKey,
  createClassName,
  castBreakpointsToIntegers,
  memoize,
  useIsFirstRender,
} from "./Utils"
import { BreakpointConstraint } from "./Breakpoints"

/**
 * A render prop that can be used to render a different container element than
 * the default `div`.
 *
 * @see {@link MediaProps.children}.
 */
export type RenderProp = (className: string, renderChildren: boolean) => any

// TODO: All of these props should be mutually exclusive. Using a union should
//       probably be made possible by https://github.com/Microsoft/TypeScript/pull/27408.
export interface MediaBreakpointProps<BreakpointKey = string> {
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
  at?: BreakpointKey

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
  lessThan?: BreakpointKey

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
  greaterThan?: BreakpointKey

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
  greaterThanOrEqual?: BreakpointKey

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
  between?: [BreakpointKey, BreakpointKey]
}

export interface MediaProps<BreakpointKey, Interaction>
  extends MediaBreakpointProps<BreakpointKey> {
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
  interaction?: Interaction

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
  children:
    | React.ReactNode
    | ((className: string, renderChildren: boolean) => React.ReactNode)

  /**
   * Additional classNames to passed down and applied to Media container
   */
  className?: string

  /**
   * Additional styles to passed down and applied to Media container
   */
  style?: CSSProperties
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

export interface CreateMediaConfig {
  /**
   * The breakpoint definitions for your application. Width definitions should
   * start at 0.
   *
   * @see {@link createMedia}
   */
  breakpoints: { [key: string]: number | string }

  /**
   * The interaction definitions for your application.
   */
  interactions?: { [key: string]: string }
}

export interface CreateMediaResults<BreakpointKey, Interactions> {
  /**
   * The React component that you use throughout your application.
   *
   * @see {@link MediaBreakpointProps}
   */
  Media: React.ComponentType<MediaProps<BreakpointKey, Interactions>>

  /**
   * The React Context provider component that you use to constrain rendering of
   * breakpoints to a set list and to enable client-side dynamic constraining.
   *
   * @see {@link MediaContextProviderProps}
   */
  MediaContextProvider: React.ComponentType<
    MediaContextProviderProps<BreakpointKey | Interactions> & {
      children: any
    }
  >

  /**
   * Generates a set of CSS rules that you should include in your application’s
   * styling to enable the hiding behaviour of your `Media` component uses.
   */
  createMediaStyle(breakpointKeys?: BreakpointConstraint[]): string

  /**
   * A list of your application’s breakpoints sorted from small to large.
   */
  SortedBreakpoints: BreakpointKey[]

  /**
   * Creates a list of your application’s breakpoints that support the given
   * widths and everything in between.
   */
  findBreakpointsForWidths(
    fromWidth: number,
    throughWidth: number
  ): BreakpointKey[] | undefined

  /**
   * Finds the breakpoint that matches the given width.
   */
  findBreakpointAtWidth(width: number): BreakpointKey | undefined

  /**
   * Maps a list of values for various breakpoints to props that can be used
   * with the `Media` component.
   *
   * The values map to corresponding indices in the sorted breakpoints array. If
   * less values are specified than the number of breakpoints your application
   * has, the last value will be applied to all subsequent breakpoints.
   */
  valuesWithBreakpointProps<SizeValue>(
    values: SizeValue[]
  ): [SizeValue, MediaBreakpointProps<BreakpointKey>][]
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
   export const createMediaStyle = MyAppMedia.createMediaStyle
   ```
 *
 */
export function createMedia<
  MediaConfig extends CreateMediaConfig,
  BreakpointKey extends keyof MediaConfig["breakpoints"],
  Interaction extends keyof MediaConfig["interactions"]
>(config: MediaConfig): CreateMediaResults<BreakpointKey, Interaction> {
  const breakpoints = castBreakpointsToIntegers(config.breakpoints)

  const mediaQueries = new MediaQueries<BreakpointKey>(
    breakpoints,
    config.interactions || {}
  )

  const DynamicResponsive = createResponsiveComponents()

  const MediaContext = React.createContext<
    MediaContextProviderProps<BreakpointKey | Interaction>
  >({})
  MediaContext.displayName = "Media.Context"

  type MediaParentContextValue = {
    hasParentMedia: boolean
    breakpointProps: MediaBreakpointProps<BreakpointKey>
  }

  const MediaParentContext = React.createContext<MediaParentContextValue>({
    hasParentMedia: false,
    breakpointProps: {},
  })
  MediaContext.displayName = "MediaParent.Context"

  const getMediaContextValue = memoize(onlyMatch => ({
    onlyMatch,
  }))

  const DynamicResponsiveProvider = (DynamicResponsive.Provider as unknown) as React.FC<
    React.PropsWithChildren<any>
  >

  const MediaContextProvider = ({
    disableDynamicMediaQueries,
    onlyMatch,
    children,
  }: MediaContextProviderProps<BreakpointKey | Interaction> & {
    children?: React.ReactNode
  }): any => {
    if (disableDynamicMediaQueries) {
      const MediaContextValue = getMediaContextValue(onlyMatch)

      return (
        <MediaContext.Provider value={MediaContextValue}>
          {children}
        </MediaContext.Provider>
      ) as React.ReactNode
    } else {
      return (
        <DynamicResponsiveProvider
          mediaQueries={mediaQueries.dynamicResponsiveMediaQueries}
          initialMatchingMediaQueries={intersection(
            mediaQueries.mediaQueryTypes,
            onlyMatch
          )}
        >
          <DynamicResponsive.Consumer>
            {matches => {
              const matchingMediaQueries = Object.keys(matches).filter(
                key => matches[key]
              )

              const MediaContextValue = getMediaContextValue(
                intersection(matchingMediaQueries, onlyMatch)
              )

              return (
                <MediaContext.Provider value={MediaContextValue}>
                  {children}
                </MediaContext.Provider>
              ) as React.ReactNode
            }}
          </DynamicResponsive.Consumer>
        </DynamicResponsiveProvider>
      ) as React.ReactNode
    }
  }

  const Media = (props: MediaProps<BreakpointKey, Interaction>): any => {
    validateProps(props)

    const {
      children,
      className: passedClassName,
      style,
      interaction,
      ...breakpointProps
    } = props

    const getMediaParentContextValue = React.useMemo(() => {
      return memoize(
        (newBreakpointProps: MediaBreakpointProps<BreakpointKey>) => ({
          hasParentMedia: true,
          breakpointProps: newBreakpointProps,
        })
      )
    }, [])

    const mediaParentContext = React.useContext(MediaParentContext)
    const childMediaParentContext = getMediaParentContextValue(breakpointProps)
    const { onlyMatch } = React.useContext(MediaContext)

    const id = React.useId()
    const isClient = typeof window !== "undefined"
    const isFirstRender = useIsFirstRender()

    let className: string | null
    if (props.interaction) {
      className = createClassName("interaction", props.interaction)
    } else {
      if (props.at) {
        const largestBreakpoint = mediaQueries.breakpoints.largestBreakpoint
        if (props.at === largestBreakpoint) {
          console.warn(
            "[@artsy/fresnel] " +
              "`at` is being used with the largest breakpoint. " +
              "Consider using `<Media greaterThanOrEqual=" +
              `"${largestBreakpoint}">\` to account for future ` +
              `breakpoint definitions outside of this range.`
          )
        }
      }

      const type = propKey(breakpointProps)
      const breakpoint = breakpointProps[type]!
      className = createClassName(type, breakpoint)
    }

    const doesMatchParent =
      !mediaParentContext.hasParentMedia ||
      intersection(
        mediaQueries.breakpoints.toVisibleAtBreakpointSet(
          mediaParentContext.breakpointProps
        ),
        mediaQueries.breakpoints.toVisibleAtBreakpointSet(breakpointProps)
      ).length > 0

    const renderChildren =
      doesMatchParent &&
      (onlyMatch === undefined ||
        mediaQueries.shouldRenderMediaQuery(
          { ...breakpointProps, interaction },
          onlyMatch
        ))

    // Append a unique id to the className (consistent on server and client)
    const uniqueComponentId = ` fresnel-${id}`
    className += uniqueComponentId

    /**
     * SPECIAL CASE:
     * If we're on the client, this is the first render, and we are not going
     * to render the children, we need to cleanup the the server-rendered HTML
     * to avoid a hydration mismatch on React 18+. We do this by grabbing the
     * already-existing element(s) directly from the DOM using the unique class
     * id and clearing its contents. This solution follows one of the
     * suggestions from Dan Abromov here:
     *
     * https://github.com/facebook/react/issues/23381#issuecomment-1096899474
     *
     * This will not have a negative impact on client-only rendering because
     * either 1) isFirstRender will be false OR 2) the element won't exist yet
     * so there will be nothing to clean up. It will only apply on SSR'd HTML
     * on initial hydration.
     */
    if (isClient && isFirstRender && !renderChildren) {
      const containerEls = document.getElementsByClassName(uniqueComponentId)
      Array.from(containerEls).forEach(el => (el.innerHTML = ""))
    }

    return (
      <MediaParentContext.Provider value={childMediaParentContext}>
        {(() => {
          if (props.children instanceof Function) {
            return props.children(className, renderChildren)
          } else {
            return (
              <div
                className={["fresnel-container", className, passedClassName]
                  .filter(Boolean)
                  .join(" ")}
                style={style}
                suppressHydrationWarning
              >
                {renderChildren ? props.children : null}
              </div>
            ) as React.ReactNode
          }
        })()}
      </MediaParentContext.Provider>
    ) as React.ReactNode
  }

  return {
    Media,
    MediaContextProvider,
    createMediaStyle: mediaQueries.toStyle,
    SortedBreakpoints: [...mediaQueries.breakpoints.sortedBreakpoints],
    findBreakpointAtWidth: mediaQueries.breakpoints.findBreakpointAtWidth,
    findBreakpointsForWidths: mediaQueries.breakpoints.findBreakpointsForWidths,
    valuesWithBreakpointProps:
      mediaQueries.breakpoints.valuesWithBreakpointProps,
  }
}

const MutuallyExclusiveProps: string[] = MediaQueries.validKeys()

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
