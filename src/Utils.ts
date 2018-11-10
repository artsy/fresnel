import { MediaBreakpointProps } from "Media"
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
