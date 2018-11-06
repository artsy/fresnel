import { MediaBreakpointProps } from "./Media"

export function createSortedBreakpoints(breakpoints: {
  [key: string]: number
}): string[] {
  return Object.keys(breakpoints)
    .map(breakpoint => [breakpoint, breakpoints[breakpoint]])
    .sort((a, b) => (a[1] < b[1] ? -1 : 1))
    .map(breakpointAndValue => breakpointAndValue[0] as string)
}

export function createAtRanges(
  sortedBreakpoints: string[]
): { [key: string]: MediaBreakpointProps<string> } {
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

function findNextBreakpoint(sortedBreakpoints: string[], breakpoint: string) {
  const nextBreakpoint =
    sortedBreakpoints[sortedBreakpoints.indexOf(breakpoint) + 1]
  if (!nextBreakpoint) {
    throw new Error(`There is no breakpoint larger than ${breakpoint}`)
  }
  return nextBreakpoint
}

export function createBreakpointQueries(
  breakpoints: {
    [key: string]: number
  },
  sortedBreakpoints: string[],
  atRanges: { [key: string]: MediaBreakpointProps<string> }
) {
  return Object.entries(atRanges).reduce(
    (queries, [k, v]) => ({
      ...queries,
      [k]: createBreakpointQuery(breakpoints, sortedBreakpoints, v),
    }),
    {}
  )
}

export function createBreakpointQuery(
  breakpoints: {
    [key: string]: number
  },
  sortedBreakpoints: string[],
  breakpointProps: MediaBreakpointProps<string>,
  onlyRenderAt?: string[]
): string | null {
  // lessThan
  if (breakpointProps.lessThan) {
    const width = breakpoints[breakpointProps.lessThan]

    if (onlyRenderAt) {
      const lowestAllowedWidth = Math.min(
        ...onlyRenderAt.map(breakpoint => breakpoints[breakpoint])
      )
      if (lowestAllowedWidth >= width) {
        return null
      }
    }
    return `(max-width:${width - 1}px)`

    // greaterThan
  } else if (breakpointProps.greaterThan) {
    const width =
      breakpoints[
        findNextBreakpoint(sortedBreakpoints, breakpointProps.greaterThan)
      ]

    if (onlyRenderAt) {
      const highestAllowedWidth = Math.max(
        ...onlyRenderAt.map(breakpoint => breakpoints[breakpoint])
      )
      if (highestAllowedWidth < width) {
        return null
      }
    }
    return `(min-width:${width}px)`

    //  greaterThanOrEqual
  } else if (breakpointProps.greaterThanOrEqual) {
    const width = breakpoints[breakpointProps.greaterThanOrEqual]

    if (onlyRenderAt) {
      const highestAllowedWidth = Math.max(
        ...onlyRenderAt.map(breakpoint => breakpoints[breakpoint])
      )
      if (highestAllowedWidth < width) {
        return null
      }
    }
    return `(min-width:${width}px)`

    // between
  } else if (breakpointProps.between) {
    // TODO: This is the only useful breakpoint to negate, but we’ll
    //       we’ll see when/if we need it. We could then also decide
    //       to add `oustide`.
    const fromWidth = breakpoints[breakpointProps.between[0]]
    const toWidth = breakpoints[breakpointProps.between[1]]

    if (onlyRenderAt) {
      const allowedWidths = onlyRenderAt.map(
        breakpoint => breakpoints[breakpoint]
      )
      if (
        Math.max(...allowedWidths) < fromWidth ||
        Math.min(...allowedWidths) >= toWidth
      ) {
        return null
      }
    }

    // prettier-ignore
    return `(min-width:${fromWidth}px) and (max-width:${toWidth - 1}px)`
  }
  throw new Error(
    `Unexpected breakpoint props: ${JSON.stringify(breakpointProps)}`
  )
}
