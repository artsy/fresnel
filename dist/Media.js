"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMedia = createMedia;

var _react = _interopRequireDefault(require("react"));

var _DynamicResponsive = require("./DynamicResponsive");

var _MediaQueries = require("./MediaQueries");

var _Utils = require("./Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * This is used to generate a Media component, its context provider, and CSS
 * rules based on your application’s breakpoints and interactions.
 *
 * Note that the interaction queries are entirely up to you to define and they
 * should be written in such a way that they match when you want the element to
 * be hidden.
 *
 * @example
 *
   ```tsx
   const MyAppMedia = createMedia({
     breakpoints: {
       xs: 0,
       sm: 768,
       md: 900
       lg: 1024,
       xl: 1192,
     },
     interactions: {
       hover: `not all and (hover:hover)`
     },
   })

   export const Media = MyAppMedia.Media
   export const MediaContextProvider = MyAppMedia.MediaContextProvider
   export const createMediaStyle = MyAppMedia.createMediaStyle
   ```
 *
 */
function createMedia(config) {
  var breakpoints = (0, _Utils.castBreakpointsToIntegers)(config.breakpoints);
  var mediaQueries = new _MediaQueries.MediaQueries(breakpoints, config.interactions || {});
  var DynamicResponsive = (0, _DynamicResponsive.createResponsiveComponents)();

  var MediaContext = _react.default.createContext({});

  MediaContext.displayName = "Media.Context";

  var MediaParentContext = _react.default.createContext({
    hasParentMedia: false,
    breakpointProps: {}
  });

  MediaContext.displayName = "MediaParent.Context";
  var getMediaContextValue = (0, _Utils.memoize)(function (onlyMatch) {
    return {
      onlyMatch: onlyMatch
    };
  });

  var MediaContextProvider = function MediaContextProvider(_ref) {
    var disableDynamicMediaQueries = _ref.disableDynamicMediaQueries,
        onlyMatch = _ref.onlyMatch,
        children = _ref.children;

    if (disableDynamicMediaQueries) {
      var MediaContextValue = getMediaContextValue(onlyMatch);
      return _react.default.createElement(MediaContext.Provider, {
        value: MediaContextValue
      }, children);
    } else {
      return _react.default.createElement(DynamicResponsive.Provider, {
        mediaQueries: mediaQueries.dynamicResponsiveMediaQueries,
        initialMatchingMediaQueries: (0, _Utils.intersection)(mediaQueries.mediaQueryTypes, onlyMatch)
      }, _react.default.createElement(DynamicResponsive.Consumer, null, function (matches) {
        var matchingMediaQueries = Object.keys(matches).filter(function (key) {
          return matches[key];
        });
        var MediaContextValue = getMediaContextValue((0, _Utils.intersection)(matchingMediaQueries, onlyMatch));
        return _react.default.createElement(MediaContext.Provider, {
          value: MediaContextValue
        }, children);
      }));
    }
  };

  var Media = function Media(props) {
    validateProps(props);

    var children = props.children,
        passedClassName = props.className,
        style = props.style,
        interaction = props.interaction,
        breakpointProps = _objectWithoutProperties(props, ["children", "className", "style", "interaction"]);

    var getMediaParentContextValue = _react.default.useMemo(function () {
      return (0, _Utils.memoize)(function (newBreakpointProps) {
        return {
          hasParentMedia: true,
          breakpointProps: newBreakpointProps
        };
      });
    }, []);

    var mediaParentContext = _react.default.useContext(MediaParentContext);

    var childMediaParentContext = getMediaParentContextValue(breakpointProps);

    var _React$useContext = _react.default.useContext(MediaContext),
        onlyMatch = _React$useContext.onlyMatch;

    var id = _react.default.useId();

    var isClient = typeof window !== "undefined";
    var isFirstRender = (0, _Utils.useIsFirstRender)();
    var className;

    if (props.interaction) {
      className = (0, _Utils.createClassName)("interaction", props.interaction);
    } else {
      if (props.at) {
        var largestBreakpoint = mediaQueries.breakpoints.largestBreakpoint;

        if (props.at === largestBreakpoint) {
          console.warn("[@artsy/fresnel] " + "`at` is being used with the largest breakpoint. " + "Consider using `<Media greaterThanOrEqual=" + "\"".concat(largestBreakpoint, "\">` to account for future ") + "breakpoint definitions outside of this range.");
        }
      }

      var type = (0, _Utils.propKey)(breakpointProps);
      var breakpoint = breakpointProps[type];
      className = (0, _Utils.createClassName)(type, breakpoint);
    }

    var doesMatchParent = !mediaParentContext.hasParentMedia || (0, _Utils.intersection)(mediaQueries.breakpoints.toVisibleAtBreakpointSet(mediaParentContext.breakpointProps), mediaQueries.breakpoints.toVisibleAtBreakpointSet(breakpointProps)).length > 0;
    var renderChildren = doesMatchParent && (onlyMatch === undefined || mediaQueries.shouldRenderMediaQuery(_objectSpread({}, breakpointProps, {
      interaction: interaction
    }), onlyMatch)); // Append a unique id to the className (consistent on server and client)

    var uniqueComponentId = " fresnel-".concat(id);
    className += uniqueComponentId;
    /**
     * SPECIAL CASE:
     * If we're on the client, this is the first render, and we are not going
     * to render the children, we need to cleanup the the server-rendered HTML
     * to avoid a hydration mismatch on React 18+. We do this by grabbing the
     * already-existing element(s) directly from the DOM using the unique class
     * id and clearing its contents. This solution follows one of the
     * suggestions from Dan Abromov here:
     *
     * https://github.com/facebook/react/issues/23381#issuecomment-1096899474
     *
     * This will not have a negative impact on client-only rendering because
     * either 1) isFirstRender will be false OR 2) the element won't exist yet
     * so there will be nothing to clean up. It will only apply on SSR'd HTML
     * on initial hydration.
     */

    if (isClient && isFirstRender && !renderChildren) {
      var containerEls = document.getElementsByClassName(uniqueComponentId);
      Array.from(containerEls).forEach(function (el) {
        return el.innerHTML = "";
      });
    }

    return _react.default.createElement(MediaParentContext.Provider, {
      value: childMediaParentContext
    }, function () {
      if (props.children instanceof Function) {
        return props.children(className, renderChildren);
      } else {
        return _react.default.createElement("div", {
          className: ["fresnel-container", className, passedClassName].filter(Boolean).join(" "),
          style: style,
          suppressHydrationWarning: true
        }, renderChildren ? props.children : null);
      }
    }());
  };

  return {
    Media: Media,
    MediaContextProvider: MediaContextProvider,
    createMediaStyle: mediaQueries.toStyle,
    SortedBreakpoints: _toConsumableArray(mediaQueries.breakpoints.sortedBreakpoints),
    findBreakpointAtWidth: mediaQueries.breakpoints.findBreakpointAtWidth,
    findBreakpointsForWidths: mediaQueries.breakpoints.findBreakpointsForWidths,
    valuesWithBreakpointProps: mediaQueries.breakpoints.valuesWithBreakpointProps
  };
}

var MutuallyExclusiveProps = _MediaQueries.MediaQueries.validKeys();

function validateProps(props) {
  var selectedProps = Object.keys(props).filter(function (prop) {
    return MutuallyExclusiveProps.includes(prop);
  });

  if (selectedProps.length < 1) {
    throw new Error("1 of ".concat(MutuallyExclusiveProps.join(", "), " is required."));
  } else if (selectedProps.length > 1) {
    throw new Error("Only 1 of ".concat(selectedProps.join(", "), " is allowed at a time."));
  }
}
//# sourceMappingURL=Media.js.map