import { castBreakpointsToIntegers } from "../Utils"

describe("utils functions", () => {
  describe("casting breakpoints gave as either string or integers into integers", () => {
    const breakpointsWithStrings = {
      "extra-small": "0",
      small: "768",
      medium: "1024",
      large: "1120",
    }

    const breakpointsWithIntegers = {
      "extra-small": 0,
      small: 768,
      medium: 1024,
      large: 1120,
    }

    const breakpointsWithMixedValues = {
      "extra-small": 0,
      small: 768,
      medium: 1024,
      large: 1120,
    }

    it("should return value as integers if given as strings", () => {
      const results = castBreakpointsToIntegers(breakpointsWithStrings)

      expect(results).toEqual(breakpointsWithIntegers)
    })

    it("should not touch the value if they are already numbers", () => {
      const results = castBreakpointsToIntegers(breakpointsWithIntegers)

      expect(results).toEqual(breakpointsWithIntegers)
    })

    it("should work the same with a mix of values", () => {
      const results = castBreakpointsToIntegers(breakpointsWithMixedValues)

      expect(results).toEqual(breakpointsWithIntegers)
    })
  })
})
