// tslint:disable:completed-docs

import { MediaBreakpointProps, MediaBreakpointKey } from "./Media"

export class Breakpoints {
  public sorted: string[]

  // TODO: This is really only for DynamicResponsive, maybe make it take a Map
  //       instead?
  public atMediaQueries: {
    [key: string]: string
  }

  private mediaQueries: {
    at: Map<string, string>
    lessThan: Map<string, string>
    greaterThan: Map<string, string>
    greaterThanOrEqual: Map<string, string>
    between: Map<[string, string], string>
  }
  private _breakpoints: { [key: string]: number }
  private _betweenCombinations: Array<[string, string]>

  constructor(breakpoints: { [key: string]: number }) {
    this._breakpoints = breakpoints

    this.sorted = Object.keys(breakpoints)
      .map(breakpoint => [breakpoint, breakpoints[breakpoint]])
      .sort((a, b) => (a[1] < b[1] ? -1 : 1))
      .map(breakpointAndValue => breakpointAndValue[0] as string)

    const atRanges = new Map<string, MediaBreakpointProps<any>>()
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.sorted.length; i++) {
      const from = this.sorted[i]
      const to = this.sorted[i + 1]
      if (to) {
        atRanges.set(from, { between: [from, to] })
      } else {
        atRanges.set(from, { greaterThanOrEqual: from })
      }
    }

    this._betweenCombinations = this.sorted
      .slice(0, -1)
      .reduce<Array<[string, string]>>(
        (acc, b1, i) => [
          ...acc,
          ...this.sorted.slice(i + 1).map<[string, string]>(b2 => [b1, b2]),
        ],
        []
      )

    this.atMediaQueries = Array.from(atRanges.entries()).reduce(
      (queries, [k, v]) => ({
        ...queries,
        [k]: this._createBreakpointQuery(v),
      }),
      {} as { [key: string]: string }
    )

    this.mediaQueries = {
      at: new Map(Object.entries(this.atMediaQueries)),
      lessThan: this._createBreakpointQueries("lessThan", this.sorted.slice(1)),
      greaterThan: this._createBreakpointQueries(
        "greaterThan",
        this.sorted.slice(0, -1)
      ),
      greaterThanOrEqual: this._createBreakpointQueries(
        "greaterThanOrEqual",
        this.sorted
      ),
      between: this._createBreakpointQueries(
        "between",
        this._betweenCombinations
      ),
    }
  }

  public getMediaQuery(
    breakpointKey: MediaBreakpointKey,
    breakpointValue: string | [string, string]
  ) {
    if (breakpointKey === "between") {
      return this.mediaQueries.between.get(
        this._betweenCombinations.find(
          c => c[0] === breakpointValue[0] && c[1] === breakpointValue[1]
        )
      )
    } else {
      return this.mediaQueries[breakpointKey].get(breakpointValue as string)
    }
  }

  public shouldRender(
    breakpointProps: MediaBreakpointProps<string>,
    onlyRenderAt: string[]
  ): boolean {
    if (breakpointProps.at) {
      const from = breakpointProps.at
      const fromIndex = this.sorted.indexOf(breakpointProps.at)
      const to = this.sorted[fromIndex + 1]
      if (to) {
        breakpointProps = { between: [from, to] }
      } else {
        breakpointProps = {
          greaterThanOrEqual: from,
        }
      }
    }
    if (breakpointProps.lessThan) {
      const width = this._breakpoints[breakpointProps.lessThan]
      const lowestAllowedWidth = Math.min(
        ...onlyRenderAt.map(breakpoint => this._breakpoints[breakpoint])
      )
      if (lowestAllowedWidth >= width) {
        return false
      }
    } else if (breakpointProps.greaterThan) {
      const width = this._breakpoints[
        this._findNextBreakpoint(breakpointProps.greaterThan)
      ]
      const highestAllowedWidth = Math.max(
        ...onlyRenderAt.map(breakpoint => this._breakpoints[breakpoint])
      )
      if (highestAllowedWidth < width) {
        return false
      }
    } else if (breakpointProps.greaterThanOrEqual) {
      const width = this._breakpoints[breakpointProps.greaterThanOrEqual]
      const highestAllowedWidth = Math.max(
        ...onlyRenderAt.map(breakpoint => this._breakpoints[breakpoint])
      )
      if (highestAllowedWidth < width) {
        return false
      }
    } else if (breakpointProps.between) {
      // TODO: This is the only useful breakpoint to negate, but we’ll
      //       we’ll see when/if we need it. We could then also decide
      //       to add `oustide`.
      const fromWidth = this._breakpoints[breakpointProps.between[0]]
      const toWidth = this._breakpoints[breakpointProps.between[1]]
      const allowedWidths = onlyRenderAt.map(
        breakpoint => this._breakpoints[breakpoint]
      )
      if (
        Math.max(...allowedWidths) < fromWidth ||
        Math.min(...allowedWidths) >= toWidth
      ) {
        return false
      }
    }
    return true
  }

  private _createBreakpointQuery(
    breakpointProps: MediaBreakpointProps<string>
  ): string {
    if (breakpointProps.lessThan) {
      const width = this._breakpoints[breakpointProps.lessThan]
      return `(max-width:${width - 1}px)`
    } else if (breakpointProps.greaterThan) {
      const width = this._breakpoints[
        this._findNextBreakpoint(breakpointProps.greaterThan)
      ]
      return `(min-width:${width}px)`
    } else if (breakpointProps.greaterThanOrEqual) {
      const width = this._breakpoints[breakpointProps.greaterThanOrEqual]
      return `(min-width:${width}px)`
    } else if (breakpointProps.between) {
      // TODO: This is the only useful breakpoint to negate, but we’ll
      //       we’ll see when/if we need it. We could then also decide
      //       to add `oustide`.
      const fromWidth = this._breakpoints[breakpointProps.between[0]]
      const toWidth = this._breakpoints[breakpointProps.between[1]]
      return `(min-width:${fromWidth}px) and (max-width:${toWidth - 1}px)`
    }
    throw new Error(
      `Unexpected breakpoint props: ${JSON.stringify(breakpointProps)}`
    )
  }

  private _createBreakpointQueries<T>(
    key: MediaBreakpointKey,
    forBreakpoints: T[]
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
