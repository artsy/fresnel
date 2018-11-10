import { MediaBreakpointProps } from "Media"
import { MediaBreakpointKey } from "./Breakpoints"

export function propKey(breakpointProps: MediaBreakpointProps) {
  return Object.keys(breakpointProps)[0] as MediaBreakpointKey
}

export function intersection(
  a1: ReadonlyArray<any>,
  a2?: ReadonlyArray<any>
): any[] {
  return a2 ? a1.filter(element => a2.indexOf(element) >= 0) : [...a1]
}
