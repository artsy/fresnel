export declare enum InteractionKey {
    interaction = "interaction"
}
/**
 * Encapsulates all interaction data needed by the Media component. The data is
 * generated on initialization so no further runtime work is necessary.
 */
export declare class Interactions {
    static validKeys(): InteractionKey[];
    private _interactions;
    constructor(interactions: {
        [name: string]: string;
    });
    toRuleSets(): string[];
    get interactions(): string[];
    get dynamicResponsiveMediaQueries(): {};
    shouldRenderMediaQuery(interaction: string, onlyMatch: string[]): boolean;
}
