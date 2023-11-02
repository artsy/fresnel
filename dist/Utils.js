"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propKey = propKey;
exports.intersection = intersection;
exports.createRuleSet = createRuleSet;
exports.createClassName = createClassName;
exports.castBreakpointsToIntegers = castBreakpointsToIntegers;
exports.memoize = memoize;
exports.useIsFirstRender = useIsFirstRender;

var _react = require("react");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Extracts the single breakpoint prop from the props object.
 */
function propKey(breakpointProps) {
  return Object.keys(breakpointProps)[0];
}
/**
 * Returns the intersection of two arrays.
 */


function intersection(a1, a2) {
  return a2 ? a1.filter(function (element) {
    return a2.indexOf(element) >= 0;
  }) : _toConsumableArray(a1);
}
/**
 * Generate a style rule for a given class name that will hide the element
 * when the given query matches.
 */


function createRuleSet(className, query) {
  return "@media ".concat(query, "{.").concat(className, "{display:none!important;}}");
}
/**
 * Given a list of strings, or string tuples, generates a class name.
 */


function createClassName() {
  for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
    components[_key] = arguments[_key];
  }

  return ["fresnel"].concat(_toConsumableArray(components.reduce(function (acc, breakpoint) {
    return Array.isArray(breakpoint) ? _toConsumableArray(acc).concat(_toConsumableArray(breakpoint)) : _toConsumableArray(acc).concat([breakpoint]);
  }, []))).join("-");
}
/**
 * Returns an object with every values casted to integers.
 */


function castBreakpointsToIntegers(breakpoints) {
  var keys = Object.keys(breakpoints);
  return keys.reduce(function (previous, current, currentIndex) {
    return _objectSpread({}, previous, _defineProperty({}, keys[currentIndex], Math.round(Number(breakpoints[current]))));
  }, {});
}
/**
 * Use this function to memoize any function
 */


function memoize(func) {
  var results = {};
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var argsKey = JSON.stringify(args);

    if (!results[argsKey]) {
      results[argsKey] = func.apply(void 0, args);
    }

    return results[argsKey];
  };
}
/**
 * Hook to determine if the current render is the first render.
 */


function useIsFirstRender() {
  var isFirst = (0, _react.useRef)(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  } else {
    return false;
  }
}
//# sourceMappingURL=Utils.js.map