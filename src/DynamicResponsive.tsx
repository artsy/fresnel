import React, {
  FC,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react"

/**
 * TODO: This is the deprecated runtime media-query component from Reaction.
 *       It can probably be simplified somewhat if we’re not going to be using
 *       it directly any longer.
 */
/** TODO */
export type MediaQueries<M extends string = string> = { [K in M]: string }

/** TODO */
export interface MediaQueryMatchers {
  [key: string]: MediaQueryList
}

/** TODO */
export type MediaQueryMatches<M extends string = string> = { [K in M]: boolean }

/** TODO */
export interface ResponsiveProviderProps<M extends string> {
  mediaQueries: MediaQueries<M>
  initialMatchingMediaQueries?: M[]
  children: React.ReactNode
}

/** TODO */
export interface ResponsiveProviderState {
  mediaQueryMatchers?: MediaQueryMatchers
  mediaQueryMatches: MediaQueryMatches
}

export const shallowEqual = (a: MediaQueryMatches, b: MediaQueryMatches) => {
  for (const key in a) {
    if (a[key] !== b[key]) return false
  }
  return true
}
/**
 * Create an array of media matchers that can validate each media query
 */
const setupMatchers = (mediaQueries: MediaQueries): MediaQueryMatchers => {
  return Object.keys(mediaQueries).reduce(
    (matchers, key) => ({
      ...matchers,
      [key]: window.matchMedia(mediaQueries[key]),
    }),
    {}
  )
}

/**
 * Uses the matchers to build a map of the states of each media query
 */
const checkMatchers = (
  mediaQueryMatchers: MediaQueryMatchers
): MediaQueryMatches => {
  return Object.keys(mediaQueryMatchers).reduce(
    (matches, key) => ({
      ...matches,
      [key]: mediaQueryMatchers[key].matches,
    }),
    {}
  )
}

const isSupportedEnvironment = () => {
  return (
    typeof window !== "undefined" && typeof window.matchMedia !== "undefined"
  )
}

export function createResponsiveComponents<M extends string>() {
  const ResponsiveContext = React.createContext({})
  ResponsiveContext.displayName = "Media.DynamicContext"

  const ResponsiveConsumer: React.FunctionComponent<
    React.ConsumerProps<MediaQueryMatches<M>>
  > = ResponsiveContext.Consumer as React.FunctionComponent<
    React.ConsumerProps<any> & { children: any }
  >

  const ResponsiveProvider: FC<ResponsiveProviderProps<M>> = ({
    mediaQueries,
    initialMatchingMediaQueries,
    children,
  }) => {
    /**
     * TODO: The class component lifecycle shouldComponentUpdate
     * has to be migrated to a functional component.
     */

    // const shouldComponentUpdate = (
    //   nextProps: Readonly<ResponsiveProviderProps<M>>,
    //   nextState: Readonly<ResponsiveProviderState>
    // ) => {
    //   if (!this.state.mediaQueryMatchers) return false
    //   if (nextProps.children !== this.props.children) return true
    //   if (
    //     shallowEqual(
    //       this.state.mediaQueryMatches,
    //       nextState.mediaQueryMatches
    //     )
    //   ) {
    //     return false
    //   }
    //   return true
    // }

    const [isPending, startTransition] = useTransition()

    const [mediaQueryMatchers] = useState(() => {
      let mediaQueryMatchers: MediaQueryMatchers | undefined = undefined

      if (isSupportedEnvironment() && mediaQueries != null) {
        mediaQueryMatchers = setupMatchers(mediaQueries)
      }
      return mediaQueryMatchers
    })

    const [mediaQueryMatches, setMediaQueryMatches] = useState(() => {
      let mediaQueryMatches: MediaQueryMatches
      if (isSupportedEnvironment() && mediaQueryMatchers != null) {
        mediaQueryMatches = checkMatchers(mediaQueryMatchers)
      } else {
        mediaQueryMatches = Object.keys(mediaQueries).reduce(
          (matches, key) => ({
            ...matches,
            [key]:
              !!initialMatchingMediaQueries &&
              initialMatchingMediaQueries.includes(key as M),
          }),
          {}
        )
      }
      return mediaQueryMatches
    })

    /**
     * The function that will be called any time a media query status changes
     */
    const mediaQueryStatusChangedCallback = useCallback(() => {
      if (isSupportedEnvironment() && mediaQueryMatchers) {
        const mediaQueryMatches = checkMatchers(mediaQueryMatchers)
        startTransition(() => {
          setMediaQueryMatches(mediaQueryMatches)
        })
      }
    }, [mediaQueryMatchers])

    useEffect(() => {
      if (mediaQueryMatchers) {
        Object.values(mediaQueryMatchers).forEach((matcher) => {
          matcher.addEventListener("change", mediaQueryStatusChangedCallback)
        })
      }

      return () => {
        if (mediaQueryMatchers) {
          Object.values(mediaQueryMatchers).forEach((matcher) =>
            matcher.removeEventListener(
              "change",
              mediaQueryStatusChangedCallback
            )
          )
        }
      }
    }, [mediaQueryStatusChangedCallback])

    return (
      <ResponsiveContext.Provider
        value={{
          mediaQueryMatches,
          isPending,
        }}
      >
        {children}
      </ResponsiveContext.Provider>
    )
  }

  return {
    Consumer: ResponsiveConsumer,
    Provider: ResponsiveProvider,
  }
}
