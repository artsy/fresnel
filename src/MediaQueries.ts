import { Breakpoints } from "./Breakpoints"
import { Interactions } from "./Interactions"
import { intersection } from "./Utils"
import { MediaBreakpointProps } from "./Media"

/**
 * Encapsulates all interaction data (and breakpoint data in the superclass)
 * needed by the Media component. The data is generated on initialization so no
 * further runtime work is necessary.
 */
export class MediaQueries {
  static validKeys() {
    return [...Breakpoints.validKeys(), ...Interactions.validKeys()]
  }

  private _breakpoints: Breakpoints
  private _interactions: Interactions

  constructor(
    breakpoints: { [key: string]: number },
    interactions: { [name: string]: string }
  ) {
    this._breakpoints = new Breakpoints(breakpoints)
    this._interactions = new Interactions(interactions)
  }

  public getLargestBreakpoint() {
    return this._breakpoints.getLargestBreakpoint()
  }

  public toStyle() {
    return [
      // Don’t add any size to the layout
      ".rrm-container{margin:0;padding:0;}",
      ...this._breakpoints.toRuleSets(),
      ...this._interactions.toRuleSets(),
    ].join("\n")
  }

  public getMediaQueryTypes() {
    return [
      ...this._breakpoints.getMediaQueryTypes(),
      ...this._interactions.getMediaQueryTypes(),
    ]
  }

  public getDynamicResponsiveMediaQueries() {
    return {
      ...this._breakpoints.getDynamicResponsiveMediaQueries(),
      ...this._interactions.getDynamicResponsiveMediaQueries(),
    }
  }

  public shouldRenderMediaQuery(
    mediaQueryProps: { interaction?: string } & MediaBreakpointProps,
    onlyMatch: string[]
  ): boolean {
    const { interaction, ...breakpointProps } = mediaQueryProps
    if (interaction) {
      return this._interactions.shouldRenderMediaQuery(interaction, onlyMatch)
    }
    // Remove any interaction possibilities from the list.
    const onlyMatchBreakpoints = intersection(
      onlyMatch,
      this._breakpoints.getMediaQueryTypes()
    )
    return this._breakpoints.shouldRenderMediaQuery(
      breakpointProps,
      onlyMatchBreakpoints
    )
  }
}
