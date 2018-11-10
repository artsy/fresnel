import { MediaBreakpointProps } from "./Media"
import { propKey } from "./Utils"

/**
 * A union of possible breakpoint props.
 */
export type MediaBreakpointKey = keyof MediaBreakpointProps

type Tuple = [string, string]

/**
 * Encapsulates all breakpoint data needed by the Media component. The data is
 * generated on initialization so no further runtime work is necessary.
 */
export class Breakpoints {
  public readonly sorted: ReadonlyArray<string>

  private _breakpoints: { [key: string]: number }
  private _mediaQueries: {
    at: Map<string, string>
    lessThan: Map<string, string>
    greaterThan: Map<string, string>
    greaterThanOrEqual: Map<string, string>
    between: Map<Tuple, string>
  }

  constructor(breakpoints: { [key: string]: number }) {
    this._breakpoints = breakpoints

    this.sorted = Object.keys(breakpoints)
      .map(breakpoint => [breakpoint, breakpoints[breakpoint]])
      .sort((a, b) => (a[1] < b[1] ? -1 : 1))
      .map(breakpointAndValue => breakpointAndValue[0] as string)

    // List of all possible and valid `between` combinations
    const betweenCombinations: Tuple[] = this.sorted
      .slice(0, -1)
      .reduce<Tuple[]>(
        (acc, b1, i) => [
          ...acc,
          ...this.sorted.slice(i + 1).map<Tuple>(b2 => [b1, b2]),
        ],
        []
      )

    this._mediaQueries = {
      at: this._createBreakpointQueries("at", this.sorted),
      lessThan: this._createBreakpointQueries("lessThan", this.sorted.slice(1)),
      greaterThan: this._createBreakpointQueries(
        "greaterThan",
        this.sorted.slice(0, -1)
      ),
      greaterThanOrEqual: this._createBreakpointQueries(
        "greaterThanOrEqual",
        this.sorted
      ),
      between: this._createBreakpointQueries("between", betweenCombinations),
    }
  }

  // TODO: This is really only for DynamicResponsive, maybe make it take a Map
  //       instead?
  public getAtMediaQueries() {
    return Array.from(this._mediaQueries.at.entries()).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v }),
      {}
    )
  }

  public getMediaQuery(
    breakpointType: MediaBreakpointKey,
    breakpoint: string | Tuple
  ) {
    if (breakpointType === "between") {
      for (const tuple of this._mediaQueries.between.entries()) {
        const [brk, query] = tuple
        if (brk[0] === breakpoint[0] && brk[1] === breakpoint[1]) {
          return query
        }
      }
    } else {
      return this._mediaQueries[breakpointType].get(breakpoint as string)
    }
  }

  public shouldRender(
    breakpointProps: MediaBreakpointProps,
    onlyRenderAt: string[]
  ): boolean {
    breakpointProps = this._normalizeProps(breakpointProps)
    switch (propKey(breakpointProps)) {
      case "lessThan": {
        const width = this._breakpoints[breakpointProps.lessThan]
        const lowestAllowedWidth = Math.min(
          ...onlyRenderAt.map(breakpoint => this._breakpoints[breakpoint])
        )
        return lowestAllowedWidth < width
      }
      case "greaterThan": {
        const width = this._breakpoints[
          this._findNextBreakpoint(breakpointProps.greaterThan)
        ]
        const highestAllowedWidth = Math.max(
          ...onlyRenderAt.map(breakpoint => this._breakpoints[breakpoint])
        )
        return highestAllowedWidth >= width
      }
      case "greaterThanOrEqual": {
        const width = this._breakpoints[breakpointProps.greaterThanOrEqual]
        const highestAllowedWidth = Math.max(
          ...onlyRenderAt.map(breakpoint => this._breakpoints[breakpoint])
        )
        return highestAllowedWidth >= width
      }
      case "between": {
        // TODO: This is the only useful breakpoint to negate, but we’ll
        //       we’ll see when/if we need it. We could then also decide
        //       to add `oustide`.
        const fromWidth = this._breakpoints[breakpointProps.between[0]]
        const toWidth = this._breakpoints[breakpointProps.between[1]]
        const allowedWidths = onlyRenderAt.map(
          breakpoint => this._breakpoints[breakpoint]
        )
        return !(
          Math.max(...allowedWidths) < fromWidth ||
          Math.min(...allowedWidths) >= toWidth
        )
      }
    }
  }

  private _normalizeProps(
    breakpointProps: MediaBreakpointProps
  ): MediaBreakpointProps {
    if (breakpointProps.at) {
      const fromIndex = this.sorted.indexOf(breakpointProps.at)
      const to = this.sorted[fromIndex + 1]
      return to
        ? { between: [breakpointProps.at, to] }
        : { greaterThanOrEqual: breakpointProps.at }
    }
    return breakpointProps
  }

  private _createBreakpointQuery(
    breakpointProps: MediaBreakpointProps
  ): string {
    breakpointProps = this._normalizeProps(breakpointProps)
    switch (propKey(breakpointProps)) {
      case "lessThan": {
        const width = this._breakpoints[breakpointProps.lessThan]
        return `(max-width:${width - 1}px)`
      }
      case "greaterThan": {
        const width = this._breakpoints[
          this._findNextBreakpoint(breakpointProps.greaterThan)
        ]
        return `(min-width:${width}px)`
      }
      case "greaterThanOrEqual": {
        const width = this._breakpoints[breakpointProps.greaterThanOrEqual]
        return `(min-width:${width}px)`
      }
      case "between": {
        // TODO: This is the only useful breakpoint to negate, but we’ll
        //       we’ll see when/if we need it. We could then also decide
        //       to add `oustide`.
        const fromWidth = this._breakpoints[breakpointProps.between[0]]
        const toWidth = this._breakpoints[breakpointProps.between[1]]
        return `(min-width:${fromWidth}px) and (max-width:${toWidth - 1}px)`
      }
    }
    throw new Error(
      `Unexpected breakpoint props: ${JSON.stringify(breakpointProps)}`
    )
  }

  private _createBreakpointQueries<T>(
    key: MediaBreakpointKey,
    forBreakpoints: ReadonlyArray<T>
  ) {
    return forBreakpoints.reduce<Map<T, string>>((map, breakpoint) => {
      map.set(
        breakpoint,
        this._createBreakpointQuery({
          [key]: breakpoint,
        })
      )
      return map
    }, new Map())
  }

  private _findNextBreakpoint(breakpoint: string) {
    const nextBreakpoint = this.sorted[this.sorted.indexOf(breakpoint) + 1]
    if (!nextBreakpoint) {
      throw new Error(`There is no breakpoint larger than ${breakpoint}`)
    }
    return nextBreakpoint
  }
}
