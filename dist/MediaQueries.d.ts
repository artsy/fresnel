import { Breakpoints, BreakpointConstraint } from "./Breakpoints";
import { MediaBreakpointProps } from "./Media";
/**
 * Encapsulates all interaction data (and breakpoint data in the superclass)
 * needed by the Media component. The data is generated on initialization so no
 * further runtime work is necessary.
 */
export declare class MediaQueries<B extends string> {
    static validKeys(): (import("./Interactions").InteractionKey | BreakpointConstraint)[];
    private _breakpoints;
    private _interactions;
    constructor(breakpoints: {
        [key: string]: number;
    }, interactions: {
        [name: string]: string;
    });
    get breakpoints(): Breakpoints<B>;
    toStyle: (breakpointKeys?: BreakpointConstraint[]) => string;
    get mediaQueryTypes(): string[];
    get dynamicResponsiveMediaQueries(): {};
    shouldRenderMediaQuery(mediaQueryProps: {
        interaction?: string;
    } & MediaBreakpointProps, onlyMatch: string[]): boolean;
}
