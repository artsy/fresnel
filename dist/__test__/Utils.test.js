"use strict";

var _Utils = require("../Utils");

describe("utils functions", function () {
  describe("casting breakpoints gave as either string or integers into integers", function () {
    var breakpointsWithStrings = {
      "extra-small": "0",
      small: "768",
      medium: "1024",
      large: "1120"
    };
    var breakpointsWithIntegers = {
      "extra-small": 0,
      small: 768,
      medium: 1024,
      large: 1120
    };
    var breakpointsWithMixedValues = {
      "extra-small": 0,
      small: 768,
      medium: 1024,
      large: 1120
    };
    it("should return value as integers if given as strings", function () {
      var results = (0, _Utils.castBreakpointsToIntegers)(breakpointsWithStrings);
      expect(results).toEqual(breakpointsWithIntegers);
    });
    it("should not touch the value if they are already numbers", function () {
      var results = (0, _Utils.castBreakpointsToIntegers)(breakpointsWithIntegers);
      expect(results).toEqual(breakpointsWithIntegers);
    });
    it("should work the same with a mix of values", function () {
      var results = (0, _Utils.castBreakpointsToIntegers)(breakpointsWithMixedValues);
      expect(results).toEqual(breakpointsWithIntegers);
    });
  });
});
//# sourceMappingURL=Utils.test.js.map