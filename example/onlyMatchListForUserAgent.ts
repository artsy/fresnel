/**
 * Notes:
 * - Apple devices do not include model details in their user-agent other than
 *   `iPhone` or `iPad`, so we need to always render for the largest option.
 */

import { findBreakpointsForWidth, SortedBreakpoints } from "./setup"

const devices: Array<
  [
    RegExp,
    {
      type: string
      width: number
      height: number
      touch: boolean
    }
  ]
> = [
  // iPhone XS Max
  [
    /iPhone/,
    {
      type: "iPhone",
      width: 414,
      height: 896,
      touch: true,
    },
  ],
  // iPad Pro (12.9-inch)
  [
    /iPad/,
    {
      type: "iPad",
      width: 1024,
      height: 1336,
      touch: true,
    },
  ],
]

// TODO: Simplify this hideous typing.
export function onlyMatchListForUserAgent(
  userAgent: string
): Array<"hover" | "notHover" | (typeof SortedBreakpoints)[0]> {
  const match = devices.find(([regexp]) => regexp.test(userAgent))
  if (match) {
    const device = match[1]
    // We support rotation, so take longest dimension
    const max = Math.max(device.width, device.height)
    return [
      device.touch ? "notHover" : "hover",
      ...findBreakpointsForWidth(max),
    ]
  }
  return null
}
