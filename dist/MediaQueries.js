"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaQueries = void 0;

var _Breakpoints = require("./Breakpoints");

var _Interactions = require("./Interactions");

var _Utils = require("./Utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Encapsulates all interaction data (and breakpoint data in the superclass)
 * needed by the Media component. The data is generated on initialization so no
 * further runtime work is necessary.
 */
var MediaQueries = /*#__PURE__*/function () {
  _createClass(MediaQueries, null, [{
    key: "validKeys",
    value: function validKeys() {
      return _toConsumableArray(_Breakpoints.Breakpoints.validKeys()).concat(_toConsumableArray(_Interactions.Interactions.validKeys()));
    }
  }]);

  function MediaQueries(breakpoints, interactions) {
    var _this = this;

    _classCallCheck(this, MediaQueries);

    _defineProperty(this, "_breakpoints", void 0);

    _defineProperty(this, "_interactions", void 0);

    _defineProperty(this, "toStyle", function (breakpointKeys) {
      return [// Don’t add any size to the layout
      ".fresnel-container{margin:0;padding:0;}"].concat(_toConsumableArray(_this._breakpoints.toRuleSets(breakpointKeys)), _toConsumableArray(_this._interactions.toRuleSets())).join("\n");
    });

    this._breakpoints = new _Breakpoints.Breakpoints(breakpoints);
    this._interactions = new _Interactions.Interactions(interactions || {});
  }

  _createClass(MediaQueries, [{
    key: "shouldRenderMediaQuery",
    value: function shouldRenderMediaQuery(mediaQueryProps, onlyMatch) {
      var interaction = mediaQueryProps.interaction,
          breakpointProps = _objectWithoutProperties(mediaQueryProps, ["interaction"]);

      if (interaction) {
        return this._interactions.shouldRenderMediaQuery(interaction, onlyMatch);
      } // Remove any interaction possibilities from the list.


      var onlyMatchBreakpoints = (0, _Utils.intersection)(onlyMatch, this._breakpoints.sortedBreakpoints);
      return this._breakpoints.shouldRenderMediaQuery(breakpointProps, onlyMatchBreakpoints);
    }
  }, {
    key: "breakpoints",
    get: function get() {
      return this._breakpoints;
    }
  }, {
    key: "mediaQueryTypes",
    get: function get() {
      return _toConsumableArray(this._breakpoints.sortedBreakpoints).concat(_toConsumableArray(this._interactions.interactions));
    }
  }, {
    key: "dynamicResponsiveMediaQueries",
    get: function get() {
      return _objectSpread({}, this._breakpoints.dynamicResponsiveMediaQueries, this._interactions.dynamicResponsiveMediaQueries);
    }
  }]);

  return MediaQueries;
}();

exports.MediaQueries = MediaQueries;
//# sourceMappingURL=MediaQueries.js.map