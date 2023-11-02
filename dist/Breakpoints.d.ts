import { MediaBreakpointProps } from "./Media";
/**
 * A union of possible breakpoint props.
 */
export type BreakpointConstraintKey = keyof MediaBreakpointProps;
type ValueBreakpointPropsTuple<SizeValue, BreakpointKey> = [
    SizeValue,
    MediaBreakpointProps<BreakpointKey>
];
export declare enum BreakpointConstraint {
    at = "at",
    lessThan = "lessThan",
    greaterThan = "greaterThan",
    greaterThanOrEqual = "greaterThanOrEqual",
    between = "between"
}
/**
 * Encapsulates all breakpoint data needed by the Media component. The data is
 * generated on initialization so no further runtime work is necessary.
 */
export declare class Breakpoints<BreakpointKey extends string> {
    static validKeys(): BreakpointConstraint[];
    private _sortedBreakpoints;
    private _breakpoints;
    private _mediaQueries;
    constructor(breakpoints: {
        [key: string]: number;
    });
    get sortedBreakpoints(): BreakpointKey[];
    get dynamicResponsiveMediaQueries(): {};
    get largestBreakpoint(): string;
    findBreakpointsForWidths: (fromWidth: number, throughWidth: number) => BreakpointKey[] | undefined;
    findBreakpointAtWidth: (width: number) => BreakpointKey | undefined;
    toVisibleAtBreakpointSet(breakpointProps: MediaBreakpointProps): BreakpointKey[];
    toRuleSets(keys?: BreakpointConstraint[]): string[];
    shouldRenderMediaQuery(breakpointProps: MediaBreakpointProps, onlyRenderAt: string[]): boolean;
    valuesWithBreakpointProps: <SizeValue>(values: SizeValue[]) => ValueBreakpointPropsTuple<SizeValue, BreakpointKey>[];
    private _normalizeProps;
    private _createBreakpointQuery;
    private _createBreakpointQueries;
    private _findNextBreakpoint;
}
export {};
