import { createClassName, createRuleSet } from "./Utils"

/**
 * Encapsulates all interaction data needed by the Media component. The data is
 * generated on initialization so no further runtime work is necessary.
 */
export class Interactions {
  static validKeys() {
    return ["interaction"]
  }

  private _interactions: { [key: string]: string }

  constructor(interactions: { [name: string]: string }) {
    this._interactions = interactions
  }

  public toRuleSets() {
    return Object.entries(this._interactions).reduce((acc, [name, query]) => {
      return [
        ...acc,
        createRuleSet(createClassName("interaction", name), query),
      ]
    }, [])
  }

  public getMediaQueryTypes() {
    return Object.keys(this._interactions)
  }

  public getDynamicResponsiveMediaQueries() {
    return Object.entries(this._interactions).reduce(
      (acc, [name, query]) => ({ ...acc, [name]: query }),
      {}
    )
  }

  public shouldRenderMediaQuery(
    interaction: string,
    onlyMatch: string[]
  ): boolean {
    return !!(onlyMatch && onlyMatch.includes(interaction))
  }
}
