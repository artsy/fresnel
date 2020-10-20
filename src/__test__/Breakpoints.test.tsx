import { Breakpoints } from "../Breakpoints"

const config = {
  "extra-small": 0,
  small: 768,
  medium: 1024,
  large: 1120,
}

const breakpoint = new Breakpoints(config)

describe("Breakpoints", () => {
  describe.only("toVisibleAtBreakpointSet", () => {
    it("returns correct values for greaterThan", () => {
      const breakpoints = breakpoint.toVisibleAtBreakpointSet({
        greaterThan: "small",
      })
      expect(breakpoints).toEqual(["medium", "large"])
    })
    it("returns correct values for greaterThanOrEqual", () => {
      const breakpoints = breakpoint.toVisibleAtBreakpointSet({
        greaterThanOrEqual: "small",
      })
      expect(breakpoints).toEqual(["small", "medium", "large"])
    })
    it("returns correct values for lessThan", () => {
      const breakpoints = breakpoint.toVisibleAtBreakpointSet({
        lessThan: "small",
      })
      expect(breakpoints).toEqual(["extra-small"])
    })
    it("returns correct values for at", () => {
      const breakpoints = breakpoint.toVisibleAtBreakpointSet({ at: "small" })
      expect(breakpoints).toEqual(["small"])
    })
    it("returns correct values for between", () => {
      const breakpoints = breakpoint.toVisibleAtBreakpointSet({
        between: ["extra-small", "medium"],
      })
      expect(breakpoints).toEqual(["extra-small", "small"])
    })
  })
})
