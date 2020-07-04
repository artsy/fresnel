import { createClassName, createRuleSet } from "./Utils"

export enum InteractionKey {
  interaction = "interaction",
}

/**
 * Encapsulates all interaction data needed by the Media component. The data is
 * generated on initialization so no further runtime work is necessary.
 */
export class Interactions {
  static validKeys() {
    return [InteractionKey.interaction]
  }

  private _interactions: { [key: string]: string }

  constructor(interactions: { [name: string]: string }) {
    this._interactions = interactions
  }

  public toRuleSets() {
    return Object.entries(this._interactions).reduce(
      (acc: string[], [name, query]) => {
        return [
          ...acc,
          createRuleSet(
            createClassName(InteractionKey.interaction, name),
            query
          ),
        ]
      },
      []
    )
  }

  public get interactions() {
    return Object.keys(this._interactions)
  }

  public get dynamicResponsiveMediaQueries() {
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
