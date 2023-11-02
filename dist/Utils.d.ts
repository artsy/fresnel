import { MediaBreakpointProps } from "./Media";
/**
 * Extracts the single breakpoint prop from the props object.
 */
export declare function propKey(breakpointProps: MediaBreakpointProps): keyof MediaBreakpointProps<string>;
/**
 * Returns the intersection of two arrays.
 */
export declare function intersection(a1: ReadonlyArray<any>, a2?: ReadonlyArray<any>): any[];
/**
 * Generate a style rule for a given class name that will hide the element
 * when the given query matches.
 */
export declare function createRuleSet(className: string, query: string): string;
/**
 * Given a list of strings, or string tuples, generates a class name.
 */
export declare function createClassName(...components: Array<string | [string, string]>): string;
/**
 * Returns an object with every values casted to integers.
 */
export declare function castBreakpointsToIntegers(breakpoints: {
    [key: string]: number | string;
}): {
    [key: string]: number;
};
/**
 * Use this function to memoize any function
 */
export declare function memoize<F extends (...args: any[]) => void>(func: F): (...args: any[]) => any;
/**
 * Hook to determine if the current render is the first render.
 */
export declare function useIsFirstRender(): boolean;
