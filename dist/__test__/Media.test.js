"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("jest-styled-components");

var _react = _interopRequireDefault(require("react"));

var _reactTestRenderer = _interopRequireWildcard(require("react-test-renderer"));

var _styledComponents = require("styled-components");

var _Media = require("../Media");

var _Breakpoints = require("../Breakpoints");

var _MediaQueries = require("../MediaQueries");

var _server = _interopRequireDefault(require("react-dom/server"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      ", "\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var config = {
  breakpoints: {
    "extra-small": 0,
    small: 768,
    medium: 1024,
    large: 1120
  },
  interactions: {
    hover: "not all and (hover:hover)"
  }
};

var _createMedia = (0, _Media.createMedia)(config),
    Media = _createMedia.Media,
    MediaContextProvider = _createMedia.MediaContextProvider,
    createMediaStyle = _createMedia.createMediaStyle,
    SortedBreakpoints = _createMedia.SortedBreakpoints,
    findBreakpointAtWidth = _createMedia.findBreakpointAtWidth,
    findBreakpointsForWidths = _createMedia.findBreakpointsForWidths,
    valuesWithBreakpointProps = _createMedia.valuesWithBreakpointProps;

var mediaQueries = new _MediaQueries.MediaQueries(config.breakpoints, config.interactions);
describe("utilities", function () {
  it("returns a list of breakpoints sorted from small to large", function () {
    expect(SortedBreakpoints).toEqual(["extra-small", "small", "medium", "large"]);
  });
  it("returns the breakpoint that supports the given width", function () {
    expect(findBreakpointAtWidth(-42)).toEqual(undefined);
    expect(findBreakpointAtWidth(42)).toEqual("extra-small");
    expect(findBreakpointAtWidth(767)).toEqual("extra-small");
    expect(findBreakpointAtWidth(768)).toEqual("small");
    expect(findBreakpointAtWidth(1042)).toEqual("medium");
    expect(findBreakpointAtWidth(9999)).toEqual("large");
  });
  it("returns the breakpoints from the first through the last given widths", function () {
    expect(findBreakpointsForWidths(-42, -21)).toEqual(undefined);
    expect(findBreakpointsForWidths(42, 767)).toEqual(["extra-small"]);
    expect(findBreakpointsForWidths(42, 768)).toEqual(["extra-small", "small"]);
    expect(findBreakpointsForWidths(42, 1042)).toEqual(["extra-small", "small", "medium"]);
    expect(findBreakpointsForWidths(768, 9999)).toEqual(["small", "medium", "large"]);
  });
  it("maps a list of responsive values to breakpoint props", function () {
    expect(valuesWithBreakpointProps([1])).toEqual([[1, {
      greaterThanOrEqual: "extra-small"
    }]]);
    expect(valuesWithBreakpointProps([1, 2])).toEqual([[1, {
      at: "extra-small"
    }], [2, {
      greaterThanOrEqual: "small"
    }]]);
    expect(valuesWithBreakpointProps([1, 2, 2, 3])).toEqual([[1, {
      at: "extra-small"
    }], [2, {
      between: ["small", "large"]
    }], [3, {
      greaterThanOrEqual: "large"
    }]]);
    expect(valuesWithBreakpointProps([2, 2, 2, 3])).toEqual([[2, {
      between: ["extra-small", "large"]
    }], [3, {
      greaterThanOrEqual: "large"
    }]]);
  });
});
describe("Media", function () {
  beforeEach(function () {
    (0, _styledComponents.injectGlobal)(_templateObject(), createMediaStyle());
  });
  afterEach(function () {
    // @ts-ignore
    window.matchMedia = undefined;
  });
  describe("concerning errors and warnings", function () {
    var errorLogger = global.console.error;
    var warnLogger = global.console.warn;
    afterEach(function () {
      global.console.error = errorLogger;
      global.console.warn = warnLogger;
    });
    it("throws when trying to use mutually exclusive props", function () {
      global.console.error = jest.fn();
      expect(function () {
        _reactTestRenderer.default.create(_react.default.createElement(Media, {
          lessThan: "small",
          at: "extra-small"
        }, "ohai"));
      }).toThrow();
    });
    it("warns when using `at` in conjunction with the largest breakpoint", function () {
      global.console.warn = jest.fn();

      _reactTestRenderer.default.create(_react.default.createElement(Media, {
        at: "large"
      }, "ohai")).toJSON();

      expect(global.console.warn).toHaveBeenCalled();
    });
  });
  describe("concerning styling", function () {
    it("doesn’t add any size to the layout", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        lessThan: "small"
      }, "ohai")).toJSON();

      expect(query.type).toEqual("div");
      expect(query).toHaveStyleRule("margin", "0");
      expect(query).toHaveStyleRule("padding", "0");
    });
    it("applies additional classNames passed as props", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        lessThan: "small",
        className: "foo"
      }, "ohai")).toJSON();

      expect(query.props.className).toContain("foo");
    });
    it("includes only style rules for specified breakpoint keys", function () {
      var defaultMediaStyles = createMediaStyle();
      expect(defaultMediaStyles).toContain(".fresnel-between-small-large");
      var subsetMediaStyles = createMediaStyle([_Breakpoints.BreakpointConstraint.at, _Breakpoints.BreakpointConstraint.greaterThan]);
      expect(subsetMediaStyles).not.toContain(".fresnel-between-small-large");
      expect(subsetMediaStyles).toContain(".fresnel-at-extra-small");
    });
  });
  describe("concerning breakpoints", function () {
    it("creates a container that will only display when the page size is less than the specified breakpoint", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        lessThan: "small"
      }, "ohai")).toJSON();

      expect(query.type).toEqual("div");
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (max-width:767.98px)"
      });
    });
    it("creates a container that will only display when the page size is greater than or equal to the next breakpoint of the specified breakpoint", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        greaterThan: "medium"
      }, "ohai")).toJSON();

      expect(query.type).toEqual("div");
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (min-width:1120px)"
      });
    });
    it("creates a container that will only display when the page size is greater than or equal to the specified breakpoint", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        greaterThanOrEqual: "medium"
      }, "ohai")).toJSON();

      expect(query.type).toEqual("div");
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (min-width:1024px)"
      });
    });
    it("creates a container that will only display when the page size is between the specified breakpoints", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        between: ["small", "large"]
      }, "ohai")).toJSON();

      expect(query.type).toEqual("div");
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (min-width:768px) and (max-width:1119.98px)"
      });
    });
    describe("concerning shortcuts", function () {
      // FIXME: styled-components reconciliation issues. Output is right yet the
      // generated classNames don't match
      xit("creates a container that will only display when the page size is between the specified breakpoint and the next one", function () {
        expect(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          at: "extra-small"
        }, "ohai")).toJSON()).toEqual(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          between: ["extra-small", "small"]
        }, "ohai")).toJSON());
        expect(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          at: "small"
        }, "ohai")).toJSON()).toEqual(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          between: ["small", "medium"]
        }, "ohai")).toJSON());
        expect(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          at: "medium"
        }, "ohai")).toJSON()).toEqual(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          between: ["medium", "large"]
        }, "ohai")).toJSON());
        expect(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          at: "large"
        }, "ohai")).toJSON()).toEqual(_reactTestRenderer.default.create(_react.default.createElement(Media, {
          greaterThanOrEqual: "large"
        }, "ohai")).toJSON());
      });
    });
  });
  describe("concerning interactions", function () {
    it("creates a container that will only display when the interaction media query matches", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        interaction: "hover"
      }, "ohai")).toJSON();

      expect(query.type).toEqual("div");
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (hover:hover)"
      });
    });
  });
  describe("with a render prop", function () {
    it("yields the class name so it can be applied to another element", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(Media, {
        lessThan: "small"
      }, function (className) {
        return _react.default.createElement("span", {
          className: className
        }, "ohai");
      })).toJSON();

      expect(query.type).toEqual("span");
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (max-width:767.98px)"
      });
    });
    it("yields wether or not the element’s children should be rendered", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
        onlyMatch: ["extra-small", "small"]
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, function (_, renderChildren) {
        return _react.default.createElement("span", null, renderChildren && "extra-small");
      }), _react.default.createElement(Media, {
        at: "small"
      }, function (_, renderChildren) {
        return _react.default.createElement("span", null, renderChildren && "small");
      }), _react.default.createElement(Media, {
        at: "medium"
      }, function (_, renderChildren) {
        return _react.default.createElement("span", null, renderChildren && "medium");
      })));

      expect(query.root.findAllByType("span").map(function (div) {
        return div.props.children;
      }).filter(Boolean)).toEqual(["extra-small", "small"]);
    });
  });
  describe("with a context", function () {
    it("renders only matching `at` breakpoints", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
        onlyMatch: ["extra-small", "small"]
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, "extra-small"), _react.default.createElement(Media, {
        at: "small"
      }, "small"), _react.default.createElement(Media, {
        at: "medium"
      }, "medium")));

      expect(query.root.findAllByType("div").map(function (div) {
        return div.props.children;
      }).filter(Boolean)).toEqual(["extra-small", "small"]);
    });
    it("renders only matching `lessThan` breakpoints", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
        onlyMatch: ["small", "medium"]
      }, _react.default.createElement(Media, {
        lessThan: "small"
      }, "extra-small"), _react.default.createElement(Media, {
        lessThan: "medium"
      }, "small"), _react.default.createElement(Media, {
        lessThan: "large"
      }, "medium")));

      expect(query.root.findAllByType("div").map(function (div) {
        return div.props.children;
      }).filter(Boolean)).toEqual(["small", "medium"]);
    });
    it("renders only matching `greaterThan` breakpoints", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
        onlyMatch: ["small", "medium"]
      }, _react.default.createElement(Media, {
        greaterThan: "extra-small"
      }, "small"), _react.default.createElement(Media, {
        greaterThan: "small"
      }, "medium"), _react.default.createElement(Media, {
        greaterThan: "medium"
      }, "large")));

      expect(query.root.findAllByType("div").map(function (div) {
        return div.props.children;
      }).filter(Boolean)).toEqual(["small", "medium"]);
    });
    it("renders only matching `greaterThanOrEqual` breakpoints", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
        onlyMatch: ["small", "medium"]
      }, _react.default.createElement(Media, {
        greaterThanOrEqual: "small"
      }, "small"), _react.default.createElement(Media, {
        greaterThanOrEqual: "medium"
      }, "medium"), _react.default.createElement(Media, {
        greaterThanOrEqual: "large"
      }, "large")));

      expect(query.root.findAllByType("div").map(function (div) {
        return div.props.children;
      }).filter(Boolean)).toEqual(["small", "medium"]);
    });
    it("renders only matching `between` breakpoints", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
        onlyMatch: ["medium", "large"]
      }, _react.default.createElement(Media, {
        between: ["extra-small", "medium"]
      }, "extra-small - medium"), _react.default.createElement(Media, {
        between: ["small", "large"]
      }, "small - large")));

      expect(query.root.findAllByType("div").map(function (div) {
        return div.props.children;
      }).filter(Boolean)).toEqual(["small - large"]);
    });
    it("renders only matching interactions", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
        onlyMatch: ["hover"]
      }, _react.default.createElement(Media, {
        interaction: "hover"
      }, "hover"), _react.default.createElement(Media, {
        between: ["small", "large"]
      }, "small - large")));

      expect(query.root.findAllByType("div").map(function (div) {
        return div.props.children;
      }).filter(Boolean)).toEqual(["hover"]);
    });
    describe("client-side with dynamic media query API available", function () {
      Object.entries({
        breakpoint: "medium",
        interaction: "hover"
      }).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            type = _ref2[0],
            mediaQuery = _ref2[1];

        it("only renders the current ".concat(type, " media query"), function () {
          mockCurrentDynamicBreakpoint(mediaQuery);

          var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
            onlyMatch: ["small", mediaQuery]
          }, _react.default.createElement(Media, {
            at: "extra-small"
          }, _react.default.createElement("span", {
            className: "extra-small"
          })), _react.default.createElement(Media, {
            at: "medium"
          }, _react.default.createElement("span", {
            className: "medium"
          })), _react.default.createElement(Media, {
            at: "large"
          }, _react.default.createElement("span", {
            className: "large"
          })), _react.default.createElement(Media, {
            interaction: "hover"
          }, _react.default.createElement("span", {
            className: "hover"
          }))));

          expect(query.root.findAllByType("span").length).toEqual(1);
          expect(query.root.findByProps({
            className: mediaQuery
          })).not.toBeNull();
        });
      });
      it("disables usage of dynamic API to further narrow down", function () {
        mockCurrentDynamicBreakpoint("medium");

        var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
          onlyMatch: ["extra-small", "medium", "large"],
          disableDynamicMediaQueries: true
        }, _react.default.createElement(Media, {
          at: "extra-small"
        }, _react.default.createElement("span", {
          className: "extra-small"
        })), _react.default.createElement(Media, {
          at: "medium"
        }, _react.default.createElement("span", {
          className: "medium"
        })), _react.default.createElement(Media, {
          at: "large"
        }, _react.default.createElement("span", {
          className: "large"
        }))));

        expect(query.root.findAllByType("span").length).toEqual(3);
      });
      it("does not render anything if the current breakpoint isn’t in the already narrowed down set", function () {
        mockCurrentDynamicBreakpoint("large");

        var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, {
          onlyMatch: ["small", "medium"]
        }, _react.default.createElement(Media, {
          at: "extra-small"
        }, _react.default.createElement("span", {
          className: "extra-small"
        })), _react.default.createElement(Media, {
          at: "medium"
        }, _react.default.createElement("span", {
          className: "medium"
        })), _react.default.createElement(Media, {
          at: "large"
        }, _react.default.createElement("span", {
          className: "large"
        }))));

        expect(query.root.findAllByType("span").length).toEqual(0);
      });
    });
  });
  describe("during hydration", function () {
    // FIXME: Unable to reproduce this here, so we'll do a more synthetic test.
    xit("does not warn about Media components that do not match and are empty", function (done) {
      var spy = jest.spyOn(console, "error");

      var App = function App() {
        return _react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
          at: "extra-small"
        }, _react.default.createElement("div", {
          className: "extra-small"
        })), _react.default.createElement(Media, {
          at: "medium"
        }, _react.default.createElement("div", {
          className: "medium"
        })), _react.default.createElement(Media, {
          greaterThanOrEqual: "large"
        }, _react.default.createElement("div", {
          className: "large"
        })));
      };

      var container = document.createElement("div");
      document.body.appendChild(container);
      mockCurrentDynamicBreakpoint("medium");
      container.innerHTML = _server.default.renderToString(_react.default.createElement(App, null));

      _reactDom.default.hydrate(_react.default.createElement(App, null), container, function () {
        expect(spy).not.toHaveBeenCalled();
        done();
      });
    }); // This is the best we can do until we figure out a way to reproduce a
    // warning, as per above.

    it("does not warn about Media components that do not match and are empty", function () {
      mockCurrentDynamicBreakpoint("medium");

      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", {
        className: "extra-small"
      })), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", {
        className: "medium"
      })), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", {
        className: "large"
      })))).toJSON();

      expect(query.find(function (e) {
        return e.props.className.includes("extra-small");
      }).props.suppressHydrationWarning).toEqual(true);
      expect(query.find(function (e) {
        return e.props.className.includes("medium");
      }).props.suppressHydrationWarning).toEqual(false);
      expect(query.find(function (e) {
        return e.props.className.includes("large");
      }).props.suppressHydrationWarning).toEqual(true);
    });
  });
  describe("prevent nested unnecessary renders", function () {
    it("only renders one element when Media is nested within Media", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", {
        className: "extra-small"
      })), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", {
        className: "medium"
      })), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", {
        className: "large"
      })))));

      expect(query.root.findAllByProps({
        className: "extra-small"
      }, {
        deep: true
      }).length).toBe(0);
      expect(query.root.findAllByProps({
        className: "large"
      }, {
        deep: true
      }).length).toBe(0);
      expect(query.root.findAllByProps({
        className: "medium"
      }, {
        deep: true
      }).length).toBe(1);
    });
    it("renders no spans with deep nesting where parent has no intersection with children", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", {
        className: "extra-small"
      })), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", {
        className: "medium"
      })), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", {
        className: "large"
      }))), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", {
        className: "large"
      })))));

      expect(query.root.findAllByType("span", {
        deep: true
      }).length).toBe(0);
    });
    it("renders multiple spans in path, without rendering spans that don't intersect", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", null), _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", null), _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", null))), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", null)))));

      expect(query.root.findAllByType("span", {
        deep: true
      }).length).toBe(3);
    });
    it("renders correct Media when using greaterThan prop", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        greaterThan: "small"
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", null)))));

      expect(query.root.findAllByType("span", {
        deep: true
      }).length).toBe(2);
    });
    it("renders correct Media when using greaterThanOrEqual prop", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        greaterThanOrEqual: "small"
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", null)))));

      expect(query.root.findAllByType("span", {
        deep: true
      }).length).toBe(3);
    });
    it("renders correct Media when using lessThan prop", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        lessThan: "small"
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", null)))));

      expect(query.root.findAllByType("span", {
        deep: true
      }).length).toBe(1);
    });
    it("renders correct Media when using between prop", function () {
      var query = _reactTestRenderer.default.create(_react.default.createElement(MediaContextProvider, null, _react.default.createElement(Media, {
        between: ["small", "large"]
      }, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "small"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", null)), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", null)))));

      expect(query.root.findAllByType("span", {
        deep: true
      }).length).toBe(2);
    });
  }); // TODO: This actually doesn’t make sense, I think, because if the user
  //       decides to not use a provider they are opting for rendering all
  //       variants. We just need to make sure to document this well.

  xdescribe("without a context provider", function () {
    it("only renders the current breakpoint", function () {
      mockCurrentDynamicBreakpoint("medium");

      var query = _reactTestRenderer.default.create(_react.default.createElement(_react.default.Fragment, null, _react.default.createElement(Media, {
        at: "extra-small"
      }, _react.default.createElement("span", {
        className: "extra-small"
      })), _react.default.createElement(Media, {
        at: "medium"
      }, _react.default.createElement("span", {
        className: "medium"
      })), _react.default.createElement(Media, {
        at: "large"
      }, _react.default.createElement("span", {
        className: "large"
      }))));

      expect(query.root.findAllByType("span").length).toEqual(1);
      expect(query.root.findByProps({
        className: "medium"
      })).not.toBeNull();
    });
  });
});

function mockCurrentDynamicBreakpoint(at) {
  window.matchMedia = jest.fn(function (mediaQuery) {
    var key = Object.entries(mediaQueries.dynamicResponsiveMediaQueries).find(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          _ = _ref4[0],
          query = _ref4[1];

      return mediaQuery === query;
    })[0]; // Return mock object that only matches the mocked breakpoint

    return {
      matches: key === at,
      addListener: jest.fn(),
      removeListener: jest.fn()
    };
  });
}
//# sourceMappingURL=Media.test.js.map