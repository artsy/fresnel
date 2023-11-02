"use strict";

var _Breakpoints = require("../Breakpoints");

var config = {
  "extra-small": 0,
  small: 768,
  medium: 1024,
  large: 1120
};
var breakpoint = new _Breakpoints.Breakpoints(config);
describe("Breakpoints", function () {
  describe("toVisibleAtBreakpointSet", function () {
    it("returns correct values for greaterThan", function () {
      var breakpoints = breakpoint.toVisibleAtBreakpointSet({
        greaterThan: "small"
      });
      expect(breakpoints).toEqual(["medium", "large"]);
    });
    it("returns correct values for greaterThanOrEqual", function () {
      var breakpoints = breakpoint.toVisibleAtBreakpointSet({
        greaterThanOrEqual: "small"
      });
      expect(breakpoints).toEqual(["small", "medium", "large"]);
    });
    it("returns correct values for lessThan", function () {
      var breakpoints = breakpoint.toVisibleAtBreakpointSet({
        lessThan: "small"
      });
      expect(breakpoints).toEqual(["extra-small"]);
    });
    it("returns correct values for at", function () {
      var breakpoints = breakpoint.toVisibleAtBreakpointSet({
        at: "small"
      });
      expect(breakpoints).toEqual(["small"]);
    });
    it("returns correct values for between", function () {
      var breakpoints = breakpoint.toVisibleAtBreakpointSet({
        between: ["extra-small", "medium"]
      });
      expect(breakpoints).toEqual(["extra-small", "small"]);
    });
  });
});
//# sourceMappingURL=Breakpoints.test.js.map