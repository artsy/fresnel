import { MediaBreakpointProps } from "./Media"
import { MediaBreakpointKey } from "./Breakpoints"

/**
 * Extracts the single breakpoint prop from the props object.
 */
export function propKey(breakpointProps: MediaBreakpointProps) {
  return Object.keys(breakpointProps)[0] as MediaBreakpointKey
}

/**
 * Returns the intersection of two arrays.
 */
export function intersection(
  a1: ReadonlyArray<any>,
  a2?: ReadonlyArray<any>
): any[] {
  return a2 ? a1.filter(element => a2.indexOf(element) >= 0) : [...a1]
}

/**
 * Generate a style rule for a given class name that will hide the element
 * when the given query matches.
 */
export function createRuleSet(className: string, query: string) {
  return `@media ${query}{.${className}{display:none!important;}}`
}

/**
 * Given a list of strings, or string tuples, generates a class name.
 */
export function createClassName(
  ...components: Array<string | [string, string]>
) {
  return [
    "rrm",
    ...components.reduce(
      (acc: string[], breakpoint) =>
        Array.isArray(breakpoint)
          ? [...acc, ...breakpoint]
          : [...acc, breakpoint],
      []
    ),
  ].join("-")
}
