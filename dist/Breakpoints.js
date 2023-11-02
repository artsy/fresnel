"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Breakpoints = exports.BreakpointConstraint = void 0;

var _Utils = require("./Utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function breakpointKey(breakpoint) {
  return Array.isArray(breakpoint) ? breakpoint.join("-") : breakpoint;
}

var BreakpointConstraint;
/**
 * Encapsulates all breakpoint data needed by the Media component. The data is
 * generated on initialization so no further runtime work is necessary.
 */

exports.BreakpointConstraint = BreakpointConstraint;

(function (BreakpointConstraint) {
  BreakpointConstraint["at"] = "at";
  BreakpointConstraint["lessThan"] = "lessThan";
  BreakpointConstraint["greaterThan"] = "greaterThan";
  BreakpointConstraint["greaterThanOrEqual"] = "greaterThanOrEqual";
  BreakpointConstraint["between"] = "between";
})(BreakpointConstraint || (exports.BreakpointConstraint = BreakpointConstraint = {}));

var Breakpoints = /*#__PURE__*/function () {
  _createClass(Breakpoints, null, [{
    key: "validKeys",
    value: function validKeys() {
      return [BreakpointConstraint.at, BreakpointConstraint.lessThan, BreakpointConstraint.greaterThan, BreakpointConstraint.greaterThanOrEqual, BreakpointConstraint.between];
    }
  }]);

  function Breakpoints(_breakpoints) {
    var _this = this,
        _this$_mediaQueries;

    _classCallCheck(this, Breakpoints);

    _defineProperty(this, "_sortedBreakpoints", void 0);

    _defineProperty(this, "_breakpoints", void 0);

    _defineProperty(this, "_mediaQueries", void 0);

    _defineProperty(this, "findBreakpointsForWidths", function (fromWidth, throughWidth) {
      var fromBreakpoint = _this.findBreakpointAtWidth(fromWidth);

      if (!fromBreakpoint) {
        return undefined;
      }

      var throughBreakpoint = _this.findBreakpointAtWidth(throughWidth);

      if (!throughBreakpoint || fromBreakpoint === throughBreakpoint) {
        return [fromBreakpoint];
      } else {
        return _this._sortedBreakpoints.slice(_this._sortedBreakpoints.indexOf(fromBreakpoint), _this._sortedBreakpoints.indexOf(throughBreakpoint) + 1);
      }
    });

    _defineProperty(this, "findBreakpointAtWidth", function (width) {
      return _this._sortedBreakpoints.find(function (breakpoint, i) {
        var nextBreakpoint = _this._sortedBreakpoints[i + 1];

        if (nextBreakpoint) {
          return width >= _this._breakpoints[breakpoint] && width < _this._breakpoints[nextBreakpoint];
        } else {
          return width >= _this._breakpoints[breakpoint];
        }
      });
    });

    _defineProperty(this, "valuesWithBreakpointProps", function (values) {
      var max = values.length;
      var valueBreakpoints = [];
      var lastTuple;

      _this._sortedBreakpoints.forEach(function (breakpoint, i) {
        var value = values[i];

        if (i < max && (!lastTuple || lastTuple[0] !== value)) {
          lastTuple = [value, [breakpoint]];
          valueBreakpoints.push(lastTuple);
        } else {
          lastTuple[1].push(breakpoint);
        }
      });

      return valueBreakpoints.map(function (_ref, i) {
        var _ref2 = _slicedToArray(_ref, 2),
            value = _ref2[0],
            breakpoints = _ref2[1];

        var props = {};

        if (i === valueBreakpoints.length - 1) {
          props.greaterThanOrEqual = breakpoints[0];
        } else if (breakpoints.length === 1) {
          props.at = breakpoints[0];
        } else {
          // TODO: This is less than ideal, would be good to have a `through`
          //       prop, which unlike `between` is inclusive.
          props.between = [breakpoints[0], valueBreakpoints[i + 1][1][0]];
        }

        return [value, props];
      });
    });

    this._breakpoints = _breakpoints;
    this._sortedBreakpoints = Object.keys(_breakpoints).map(function (breakpoint) {
      return [breakpoint, _breakpoints[breakpoint]];
    }).sort(function (a, b) {
      return a[1] < b[1] ? -1 : 1;
    }).map(function (breakpointAndValue) {
      return breakpointAndValue[0];
    }); // List of all possible and valid `between` combinations

    var betweenCombinations = this._sortedBreakpoints.slice(0, -1).reduce(function (acc, b1, i) {
      return _toConsumableArray(acc).concat(_toConsumableArray(_this._sortedBreakpoints.slice(i + 1).map(function (b2) {
        return [b1, b2];
      })));
    }, []);

    this._mediaQueries = (_this$_mediaQueries = {}, _defineProperty(_this$_mediaQueries, BreakpointConstraint.at, this._createBreakpointQueries(BreakpointConstraint.at, this._sortedBreakpoints)), _defineProperty(_this$_mediaQueries, BreakpointConstraint.lessThan, this._createBreakpointQueries(BreakpointConstraint.lessThan, this._sortedBreakpoints.slice(1))), _defineProperty(_this$_mediaQueries, BreakpointConstraint.greaterThan, this._createBreakpointQueries(BreakpointConstraint.greaterThan, this._sortedBreakpoints.slice(0, -1))), _defineProperty(_this$_mediaQueries, BreakpointConstraint.greaterThanOrEqual, this._createBreakpointQueries(BreakpointConstraint.greaterThanOrEqual, this._sortedBreakpoints)), _defineProperty(_this$_mediaQueries, BreakpointConstraint.between, this._createBreakpointQueries(BreakpointConstraint.between, betweenCombinations)), _this$_mediaQueries);
  }

  _createClass(Breakpoints, [{
    key: "toVisibleAtBreakpointSet",
    value: function toVisibleAtBreakpointSet(breakpointProps) {
      breakpointProps = this._normalizeProps(breakpointProps);

      if (breakpointProps.lessThan) {
        var breakpointIndex = this.sortedBreakpoints.findIndex(function (bp) {
          return bp === breakpointProps.lessThan;
        });
        return this.sortedBreakpoints.slice(0, breakpointIndex);
      } else if (breakpointProps.greaterThan) {
        var _breakpointIndex = this.sortedBreakpoints.findIndex(function (bp) {
          return bp === breakpointProps.greaterThan;
        });

        return this.sortedBreakpoints.slice(_breakpointIndex + 1);
      } else if (breakpointProps.greaterThanOrEqual) {
        var _breakpointIndex2 = this.sortedBreakpoints.findIndex(function (bp) {
          return bp === breakpointProps.greaterThanOrEqual;
        });

        return this.sortedBreakpoints.slice(_breakpointIndex2);
      } else if (breakpointProps.between) {
        var between = breakpointProps.between;
        var fromBreakpointIndex = this.sortedBreakpoints.findIndex(function (bp) {
          return bp === between[0];
        });
        var toBreakpointIndex = this.sortedBreakpoints.findIndex(function (bp) {
          return bp === between[1];
        });
        return this.sortedBreakpoints.slice(fromBreakpointIndex, toBreakpointIndex);
      }

      return [];
    }
  }, {
    key: "toRuleSets",
    value: function toRuleSets() {
      var _this2 = this;

      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Breakpoints.validKeys();
      var selectedMediaQueries = keys.reduce(function (mediaQueries, query) {
        mediaQueries[query] = _this2._mediaQueries[query];
        return mediaQueries;
      }, {});
      return Object.entries(selectedMediaQueries).reduce(function (acc, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            type = _ref4[0],
            queries = _ref4[1];

        queries.forEach(function (query, breakpoint) {
          // We need to invert the query, such that it matches when we want the
          // element to be hidden.
          acc.push((0, _Utils.createRuleSet)((0, _Utils.createClassName)(type, breakpoint), "not all and ".concat(query)));
        });
        return acc;
      }, []);
    }
  }, {
    key: "shouldRenderMediaQuery",
    value: function shouldRenderMediaQuery(breakpointProps, onlyRenderAt) {
      var _this3 = this;

      breakpointProps = this._normalizeProps(breakpointProps);

      if (breakpointProps.lessThan) {
        var width = this._breakpoints[breakpointProps.lessThan];
        var lowestAllowedWidth = Math.min.apply(Math, _toConsumableArray(onlyRenderAt.map(function (breakpoint) {
          return _this3._breakpoints[breakpoint];
        })));
        return lowestAllowedWidth < width;
      } else if (breakpointProps.greaterThan) {
        var _width = this._breakpoints[this._findNextBreakpoint(breakpointProps.greaterThan)];

        var highestAllowedWidth = Math.max.apply(Math, _toConsumableArray(onlyRenderAt.map(function (breakpoint) {
          return _this3._breakpoints[breakpoint];
        })));
        return highestAllowedWidth >= _width;
      } else if (breakpointProps.greaterThanOrEqual) {
        var _width2 = this._breakpoints[breakpointProps.greaterThanOrEqual];

        var _highestAllowedWidth = Math.max.apply(Math, _toConsumableArray(onlyRenderAt.map(function (breakpoint) {
          return _this3._breakpoints[breakpoint];
        })));

        return _highestAllowedWidth >= _width2;
      } else if (breakpointProps.between) {
        // TODO: This is the only useful breakpoint to negate, but we’ll
        //       we’ll see when/if we need it. We could then also decide
        //       to add `oustide`.
        var fromWidth = this._breakpoints[breakpointProps.between[0]];
        var toWidth = this._breakpoints[breakpointProps.between[1]];
        var allowedWidths = onlyRenderAt.map(function (breakpoint) {
          return _this3._breakpoints[breakpoint];
        });
        return !(Math.max.apply(Math, _toConsumableArray(allowedWidths)) < fromWidth || Math.min.apply(Math, _toConsumableArray(allowedWidths)) >= toWidth);
      }

      return false;
    }
  }, {
    key: "_normalizeProps",
    value: function _normalizeProps(breakpointProps) {
      if (breakpointProps.at) {
        var fromIndex = this._sortedBreakpoints.indexOf(breakpointProps.at);

        var to = this._sortedBreakpoints[fromIndex + 1];
        return to ? {
          between: [breakpointProps.at, to]
        } : {
          greaterThanOrEqual: breakpointProps.at
        };
      }

      return breakpointProps;
    }
  }, {
    key: "_createBreakpointQuery",
    value: function _createBreakpointQuery(breakpointProps) {
      breakpointProps = this._normalizeProps(breakpointProps);

      if (breakpointProps.lessThan) {
        var width = this._breakpoints[breakpointProps.lessThan];
        return "(max-width:".concat(width - 0.02, "px)");
      } else if (breakpointProps.greaterThan) {
        var _width3 = this._breakpoints[this._findNextBreakpoint(breakpointProps.greaterThan)];

        return "(min-width:".concat(_width3, "px)");
      } else if (breakpointProps.greaterThanOrEqual) {
        var _width4 = this._breakpoints[breakpointProps.greaterThanOrEqual];
        return "(min-width:".concat(_width4, "px)");
      } else if (breakpointProps.between) {
        // TODO: This is the only useful breakpoint to negate, but we’ll
        //       we’ll see when/if we need it. We could then also decide
        //       to add `outside`.
        var fromWidth = this._breakpoints[breakpointProps.between[0]];
        var toWidth = this._breakpoints[breakpointProps.between[1]];
        return "(min-width:".concat(fromWidth, "px) and (max-width:").concat(toWidth - 0.02, "px)");
      }

      throw new Error("Unexpected breakpoint props: ".concat(JSON.stringify(breakpointProps)));
    }
  }, {
    key: "_createBreakpointQueries",
    value: function _createBreakpointQueries(key, forBreakpoints) {
      var _this4 = this;

      return forBreakpoints.reduce(function (map, breakpoint) {
        map.set(breakpointKey(breakpoint), _this4._createBreakpointQuery(_defineProperty({}, key, breakpoint)));
        return map;
      }, new Map());
    }
  }, {
    key: "_findNextBreakpoint",
    value: function _findNextBreakpoint(breakpoint) {
      var nextBreakpoint = this._sortedBreakpoints[this._sortedBreakpoints.indexOf(breakpoint) + 1];

      if (!nextBreakpoint) {
        throw new Error("There is no breakpoint larger than ".concat(breakpoint));
      }

      return nextBreakpoint;
    }
  }, {
    key: "sortedBreakpoints",
    get: function get() {
      return this._sortedBreakpoints;
    }
  }, {
    key: "dynamicResponsiveMediaQueries",
    get: function get() {
      return Array.from(this._mediaQueries[BreakpointConstraint.at].entries()).reduce(function (acc, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            k = _ref6[0],
            v = _ref6[1];

        return _objectSpread({}, acc, _defineProperty({}, k, v));
      }, {});
    }
  }, {
    key: "largestBreakpoint",
    get: function get() {
      return this._sortedBreakpoints[this._sortedBreakpoints.length - 1];
    }
  }]);

  return Breakpoints;
}();

exports.Breakpoints = Breakpoints;
//# sourceMappingURL=Breakpoints.js.map