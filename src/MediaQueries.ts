import { Breakpoints } from "./Breakpoints"
import { createClassName, createStyleRule, intersection } from "./Utils"
import { MediaBreakpointProps } from "./Media"

/**
 * Encapsulates all interaction data (and breakpoint data in the superclass)
 * needed by the Media component. The data is generated on initialization so no
 * further runtime work is necessary.
 */
export class MediaQueries extends Breakpoints {
  static validKeys() {
    return [...super.validKeys(), "interaction"]
  }

  private _interactions: { [key: string]: string }

  constructor(
    breakpoints: { [key: string]: number },
    interactions: { [name: string]: string }
  ) {
    super(breakpoints)
    this._interactions = interactions
  }

  public toStyle() {
    return [
      ...super.toStyle(),
      ...Object.entries(this._interactions).reduce((acc, [name, query]) => {
        return [
          ...acc,
          createStyleRule(createClassName("interaction", name), query),
        ]
      }, []),
    ]
  }

  public getMediaQueryTypes() {
    return [...super.getMediaQueryTypes(), ...Object.keys(this._interactions)]
  }

  public getDynamicResponsiveMediaQueries() {
    return Object.entries(this._interactions).reduce(
      (acc, [name, query]) => ({ ...acc, [name]: query }),
      super.getDynamicResponsiveMediaQueries()
    )
  }

  public shouldRenderMediaQuery(
    mediaQueryProps: { interaction?: string } & MediaBreakpointProps,
    onlyMatch: string[]
  ): boolean {
    const { interaction, ...breakpointProps } = mediaQueryProps
    if (interaction) {
      return !!(onlyMatch && onlyMatch.includes(interaction))
    }
    const onlyMatchBreakpoints = intersection(
      onlyMatch,
      super.getMediaQueryTypes()
    )
    return super.shouldRenderMediaQuery(breakpointProps, onlyMatchBreakpoints)
  }
}
