"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResponsiveComponents = createResponsiveComponents;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var shallowEqual = function shallowEqual(a, b) {
  for (var _key in a) {
    if (a[_key] !== b[_key]) return false;
  }

  return true;
};
/** TODO */


function createResponsiveComponents() {
  var ResponsiveContext = _react.default.createContext({});

  ResponsiveContext.displayName = "Media.DynamicContext";
  var ResponsiveConsumer = ResponsiveContext.Consumer;
  return {
    Consumer: ResponsiveConsumer,
    Provider: /*#__PURE__*/function (_React$Component) {
      _inherits(ResponsiveProvider, _React$Component);

      function ResponsiveProvider(props) {
        var _this;

        _classCallCheck(this, ResponsiveProvider);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(ResponsiveProvider).call(this, props));

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isSupportedEnvironment", function () {
          return typeof window !== "undefined" && typeof window.matchMedia !== "undefined";
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setupMatchers", function (mediaQueries) {
          return Object.keys(mediaQueries).reduce(function (matchers, key) {
            return _objectSpread({}, matchers, _defineProperty({}, key, window.matchMedia(mediaQueries[key])));
          }, {});
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "checkMatchers", function (mediaQueryMatchers) {
          return Object.keys(mediaQueryMatchers).reduce(function (matches, key) {
            return _objectSpread({}, matches, _defineProperty({}, key, mediaQueryMatchers[key].matches));
          }, {});
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "mediaQueryStatusChangedCallback", function () {
          var mediaQueryMatches = _this.checkMatchers(_this.state.mediaQueryMatchers);

          _this.setState({
            mediaQueryMatches: mediaQueryMatches
          });
        });

        var _mediaQueryMatchers = undefined;

        var _mediaQueryMatches;

        if (_this.isSupportedEnvironment()) {
          _mediaQueryMatchers = _this.setupMatchers(props.mediaQueries);
          _mediaQueryMatches = _this.checkMatchers(_mediaQueryMatchers);
        } else {
          _mediaQueryMatches = Object.keys(props.mediaQueries).reduce(function (matches, key) {
            return _objectSpread({}, matches, _defineProperty({}, key, !!props.initialMatchingMediaQueries && props.initialMatchingMediaQueries.includes(key)));
          }, {});
        }

        _this.state = {
          mediaQueryMatchers: _mediaQueryMatchers,
          mediaQueryMatches: _mediaQueryMatches
        };
        return _this;
      }

      _createClass(ResponsiveProvider, [{
        key: "componentDidMount",
        // Lifecycle methods
        value: function componentDidMount() {
          if (this.state.mediaQueryMatchers) {
            var mediaQueryStatusChangedCallback = this.mediaQueryStatusChangedCallback;
            Object.values(this.state.mediaQueryMatchers).forEach(function (matcher) {
              matcher.addListener(mediaQueryStatusChangedCallback);
            });
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          if (this.state.mediaQueryMatchers) {
            var mediaQueryStatusChangedCallback = this.mediaQueryStatusChangedCallback;
            Object.values(this.state.mediaQueryMatchers).forEach(function (matcher) {
              return matcher.removeListener(mediaQueryStatusChangedCallback);
            });
          }
        }
      }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          if (!this.state.mediaQueryMatchers) return false;
          if (nextProps.children !== this.props.children) return true;

          if (shallowEqual(this.state.mediaQueryMatches, nextState.mediaQueryMatches)) {
            return false;
          }

          return true;
        }
      }, {
        key: "render",
        value: function render() {
          return _react.default.createElement(ResponsiveContext.Provider, {
            value: this.state.mediaQueryMatches
          }, this.props.children);
        }
      }]);

      return ResponsiveProvider;
    }(_react.default.Component)
  };
}
//# sourceMappingURL=DynamicResponsive.js.map