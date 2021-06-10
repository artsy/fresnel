import "jest-styled-components"

import React from "react"
import renderer, { ReactTestRendererJSON } from "react-test-renderer"
import { injectGlobal } from "styled-components"
import { createMedia } from "../Media"
import { BreakpointConstraint } from "../Breakpoints"
import { MediaQueries } from "../MediaQueries"
import ReactDOMServer from "react-dom/server"
import ReactDOM from "react-dom"

const config = {
  breakpoints: {
    "extra-small": 0,
    small: 768,
    medium: 1024,
    large: 1120,
  },
  interactions: {
    hover: `not all and (hover:hover)`,
  },
}

const {
  Media,
  MediaContextProvider,
  createMediaStyle,
  SortedBreakpoints,
  findBreakpointAtWidth,
  findBreakpointsForWidths,
  valuesWithBreakpointProps,
} = createMedia(config)

const mediaQueries = new MediaQueries(config.breakpoints, config.interactions)

describe("utilities", () => {
  it("returns a list of breakpoints sorted from small to large", () => {
    expect(SortedBreakpoints).toEqual([
      "extra-small",
      "small",
      "medium",
      "large",
    ])
  })

  it("returns the breakpoint that supports the given width", () => {
    expect(findBreakpointAtWidth(-42)).toEqual(undefined)
    expect(findBreakpointAtWidth(42)).toEqual("extra-small")
    expect(findBreakpointAtWidth(767)).toEqual("extra-small")
    expect(findBreakpointAtWidth(768)).toEqual("small")
    expect(findBreakpointAtWidth(1042)).toEqual("medium")
    expect(findBreakpointAtWidth(9999)).toEqual("large")
  })

  it("returns the breakpoints from the first through the last given widths", () => {
    expect(findBreakpointsForWidths(-42, -21)).toEqual(undefined)
    expect(findBreakpointsForWidths(42, 767)).toEqual(["extra-small"])
    expect(findBreakpointsForWidths(42, 768)).toEqual(["extra-small", "small"])
    expect(findBreakpointsForWidths(42, 1042)).toEqual([
      "extra-small",
      "small",
      "medium",
    ])
    expect(findBreakpointsForWidths(768, 9999)).toEqual([
      "small",
      "medium",
      "large",
    ])
  })

  it("maps a list of responsive values to breakpoint props", () => {
    expect(valuesWithBreakpointProps([1])).toEqual([
      [1, { greaterThanOrEqual: "extra-small" }],
    ])
    expect(valuesWithBreakpointProps([1, 2])).toEqual([
      [1, { at: "extra-small" }],
      [2, { greaterThanOrEqual: "small" }],
    ])
    expect(valuesWithBreakpointProps([1, 2, 2, 3])).toEqual([
      [1, { at: "extra-small" }],
      [2, { between: ["small", "large"] }],
      [3, { greaterThanOrEqual: "large" }],
    ])
    expect(valuesWithBreakpointProps([2, 2, 2, 3])).toEqual([
      [2, { between: ["extra-small", "large"] }],
      [3, { greaterThanOrEqual: "large" }],
    ])
  })
})

describe("Media", () => {
  beforeEach(() => {
    injectGlobal`
      ${createMediaStyle()}
    `
  })

  afterEach(() => {
    window.matchMedia = undefined
  })

  describe("concerning errors and warnings", () => {
    const errorLogger = global.console.error
    const warnLogger = global.console.warn

    afterEach(() => {
      global.console.error = errorLogger
      global.console.warn = warnLogger
    })

    it("throws when trying to use mutually exclusive props", () => {
      global.console.error = jest.fn()
      expect(() => {
        renderer.create(
          <Media lessThan="small" at="extra-small">
            ohai
          </Media>
        )
      }).toThrow()
    })

    it("warns when using `at` in conjunction with the largest breakpoint", () => {
      global.console.warn = jest.fn()
      renderer.create(<Media at="large">ohai</Media>).toJSON()
      expect(global.console.warn).toHaveBeenCalled()
    })
  })

  describe("concerning styling", () => {
    it("doesn’t add any size to the layout", () => {
      const query = renderer
        .create(<Media lessThan="small">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("margin", "0")
      expect(query).toHaveStyleRule("padding", "0")
    })

    it("applies additional classNames passed as props", () => {
      const query = renderer
        .create(
          <Media lessThan="small" className="foo">
            ohai
          </Media>
        )
        .toJSON()
      expect(query.props.className).toContain("foo")
    })

    it("includes only style rules for specified breakpoint keys", () => {
      const defaultMediaStyles = createMediaStyle()
      expect(defaultMediaStyles).toContain(".fresnel-between-small-large")

      const subsetMediaStyles = createMediaStyle([
        BreakpointConstraint.at,
        BreakpointConstraint.greaterThan,
      ])
      expect(subsetMediaStyles).not.toContain(".fresnel-between-small-large")
      expect(subsetMediaStyles).toContain(".fresnel-at-extra-small")
    })
  })

  describe("concerning breakpoints", () => {
    it("creates a container that will only display when the page size is less than the specified breakpoint", () => {
      const query = renderer
        .create(<Media lessThan="small">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (max-width:767px)",
      })
    })

    it("creates a container that will only display when the page size is greater than or equal to the next breakpoint of the specified breakpoint", () => {
      const query = renderer
        .create(<Media greaterThan="medium">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (min-width:1120px)",
      })
    })

    it("creates a container that will only display when the page size is greater than or equal to the specified breakpoint", () => {
      const query = renderer
        .create(<Media greaterThanOrEqual="medium">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (min-width:1024px)",
      })
    })

    it("creates a container that will only display when the page size is between the specified breakpoints", () => {
      const query = renderer
        .create(<Media between={["small", "large"]}>ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (min-width:768px) and (max-width:1119px)",
      })
    })

    describe("concerning shortcuts", () => {
      // FIXME: styled-components reconciliation issues. Output is right yet the
      // generated classNames don't match
      xit("creates a container that will only display when the page size is between the specified breakpoint and the next one", () => {
        expect(
          renderer.create(<Media at="extra-small">ohai</Media>).toJSON()
        ).toEqual(
          renderer
            .create(<Media between={["extra-small", "small"]}>ohai</Media>)
            .toJSON()
        )
        expect(
          renderer.create(<Media at="small">ohai</Media>).toJSON()
        ).toEqual(
          renderer
            .create(<Media between={["small", "medium"]}>ohai</Media>)
            .toJSON()
        )
        expect(
          renderer.create(<Media at="medium">ohai</Media>).toJSON()
        ).toEqual(
          renderer
            .create(<Media between={["medium", "large"]}>ohai</Media>)
            .toJSON()
        )
        expect(
          renderer.create(<Media at="large">ohai</Media>).toJSON()
        ).toEqual(
          renderer
            .create(<Media greaterThanOrEqual="large">ohai</Media>)
            .toJSON()
        )
      })
    })
  })

  describe("concerning interactions", () => {
    it("creates a container that will only display when the interaction media query matches", () => {
      const query = renderer
        .create(<Media interaction="hover">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (hover:hover)",
      })
    })
  })

  describe("with a render prop", () => {
    it("yields the class name so it can be applied to another element", () => {
      const query = renderer
        .create(
          <Media lessThan="small">
            {className => <span className={className}>ohai</span>}
          </Media>
        )
        .toJSON()
      expect(query.type).toEqual("span")
      expect(query).toHaveStyleRule("display", "none!important", {
        media: "not all and (max-width:767px)",
      })
    })

    it("yields wether or not the element’s children should be rendered", () => {
      const query = renderer.create(
        <MediaContextProvider onlyMatch={["extra-small", "small"]}>
          <Media at="extra-small">
            {(_, renderChildren) => (
              <span>{renderChildren && "extra-small"}</span>
            )}
          </Media>
          <Media at="small">
            {(_, renderChildren) => <span>{renderChildren && "small"}</span>}
          </Media>
          <Media at="medium">
            {(_, renderChildren) => <span>{renderChildren && "medium"}</span>}
          </Media>
        </MediaContextProvider>
      )
      expect(
        query.root
          .findAllByType("span")
          .map(div => div.props.children)
          .filter(Boolean)
      ).toEqual(["extra-small", "small"])
    })
  })

  describe("with a context", () => {
    it("renders only matching `at` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyMatch={["extra-small", "small"]}>
          <Media at="extra-small">extra-small</Media>
          <Media at="small">small</Media>
          <Media at="medium">medium</Media>
        </MediaContextProvider>
      )
      expect(
        query.root
          .findAllByType("div")
          .map(div => div.props.children)
          .filter(Boolean)
      ).toEqual(["extra-small", "small"])
    })

    it("renders only matching `lessThan` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyMatch={["small", "medium"]}>
          <Media lessThan="small">extra-small</Media>
          <Media lessThan="medium">small</Media>
          <Media lessThan="large">medium</Media>
        </MediaContextProvider>
      )
      expect(
        query.root
          .findAllByType("div")
          .map(div => div.props.children)
          .filter(Boolean)
      ).toEqual(["small", "medium"])
    })

    it("renders only matching `greaterThan` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyMatch={["small", "medium"]}>
          <Media greaterThan="extra-small">small</Media>
          <Media greaterThan="small">medium</Media>
          <Media greaterThan="medium">large</Media>
        </MediaContextProvider>
      )
      expect(
        query.root
          .findAllByType("div")
          .map(div => div.props.children)
          .filter(Boolean)
      ).toEqual(["small", "medium"])
    })

    it("renders only matching `greaterThanOrEqual` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyMatch={["small", "medium"]}>
          <Media greaterThanOrEqual="small">small</Media>
          <Media greaterThanOrEqual="medium">medium</Media>
          <Media greaterThanOrEqual="large">large</Media>
        </MediaContextProvider>
      )
      expect(
        query.root
          .findAllByType("div")
          .map(div => div.props.children)
          .filter(Boolean)
      ).toEqual(["small", "medium"])
    })

    it("renders only matching `between` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyMatch={["medium", "large"]}>
          <Media between={["extra-small", "medium"]}>
            extra-small - medium
          </Media>
          <Media between={["small", "large"]}>small - large</Media>
        </MediaContextProvider>
      )
      expect(
        query.root
          .findAllByType("div")
          .map(div => div.props.children)
          .filter(Boolean)
      ).toEqual(["small - large"])
    })

    it("renders only matching interactions", () => {
      const query = renderer.create(
        <MediaContextProvider onlyMatch={["hover"]}>
          <Media interaction="hover">hover</Media>
          <Media between={["small", "large"]}>small - large</Media>
        </MediaContextProvider>
      )
      expect(
        query.root
          .findAllByType("div")
          .map(div => div.props.children)
          .filter(Boolean)
      ).toEqual(["hover"])
    })

    describe("client-side with dynamic media query API available", () => {
      Object.entries({
        breakpoint: "medium",
        interaction: "hover",
      }).forEach(([type, mediaQuery]) => {
        it(`only renders the current ${type} media query`, () => {
          mockCurrentDynamicBreakpoint(mediaQuery)

          const query = renderer.create(
            <MediaContextProvider onlyMatch={["small", mediaQuery as any]}>
              <Media at="extra-small">
                <span className="extra-small" />
              </Media>
              <Media at="medium">
                <span className="medium" />
              </Media>
              <Media at="large">
                <span className="large" />
              </Media>
              <Media interaction="hover">
                <span className="hover" />
              </Media>
            </MediaContextProvider>
          )

          expect(query.root.findAllByType("span").length).toEqual(1)
          expect(
            query.root.findByProps({ className: mediaQuery })
          ).not.toBeNull()
        })
      })

      it("disables usage of dynamic API to further narrow down", () => {
        mockCurrentDynamicBreakpoint("medium")

        const query = renderer.create(
          <MediaContextProvider
            onlyMatch={["extra-small", "medium", "large"]}
            disableDynamicMediaQueries
          >
            <Media at="extra-small">
              <span className="extra-small" />
            </Media>
            <Media at="medium">
              <span className="medium" />
            </Media>
            <Media at="large">
              <span className="large" />
            </Media>
          </MediaContextProvider>
        )

        expect(query.root.findAllByType("span").length).toEqual(3)
      })

      it("does not render anything if the current breakpoint isn’t in the already narrowed down set", () => {
        mockCurrentDynamicBreakpoint("large")

        const query = renderer.create(
          <MediaContextProvider onlyMatch={["small", "medium"]}>
            <Media at="extra-small">
              <span className="extra-small" />
            </Media>
            <Media at="medium">
              <span className="medium" />
            </Media>
            <Media at="large">
              <span className="large" />
            </Media>
          </MediaContextProvider>
        )

        expect(query.root.findAllByType("span").length).toEqual(0)
      })
    })
  })

  describe("during hydration", () => {
    // FIXME: Unable to reproduce this here, so we'll do a more synthetic test.
    it("does not warn about Media components that do not match and are empty", done => {
      const spy = jest.spyOn(console, "error")

      const App = () => (
        <MediaContextProvider>
          <Media at="extra-small">
            <div className="extra-small" />
          </Media>
          <Media at="medium">
            <div className="medium" />
          </Media>
          <Media greaterThanOrEqual="large">
            <div className="large" />
          </Media>
        </MediaContextProvider>
      )

      const container = document.createElement("div")
      document.body.appendChild(container)

      const html = ReactDOMServer.renderToString(<App />)
      expect(html).toMatchSnapshot()
      mockCurrentDynamicBreakpoint("medium");
      container.innerHTML = ReactDOMServer.renderToString(html)
      ReactDOM.hydrate(<App />, container, () => {
        expect(container).toMatchSnapshot()
        expect(spy).not.toHaveBeenCalled()
        done()
      })
    })

    // This is the best we can do until we figure out a way to reproduce a
    // warning, as per above.
    it("does not warn about Media components that do not match and are empty", () => {
      mockCurrentDynamicBreakpoint("medium")

      const query = (renderer
        .create(
          <MediaContextProvider>
            <Media at="extra-small">
              <span className="extra-small" />
            </Media>
            <Media at="medium">
              <span className="medium" />
            </Media>
            <Media at="large">
              <span className="large" />
            </Media>
          </MediaContextProvider>
        )
        .toJSON() as any) as ReactTestRendererJSON[]

      expect(
        query.find(e => e.props.className.includes("extra-small")).props
          .suppressHydrationWarning
      ).toEqual(true)
      expect(
        query.find(e => e.props.className.includes("medium")).props
          .suppressHydrationWarning
      ).toEqual(false)
      expect(
        query.find(e => e.props.className.includes("large")).props
          .suppressHydrationWarning
      ).toEqual(true)
    })
  })

  describe("prevent nested unnecessary renders", () => {
    it("only renders one element when Media is nested within Media", () => {
      const query = renderer.create(
        <MediaContextProvider>
          <Media at="medium">
            <Media at="extra-small">
              <span className="extra-small" />
            </Media>
            <Media at="medium">
              <span className="medium" />
            </Media>
            <Media at="large">
              <span className="large" />
            </Media>
          </Media>
        </MediaContextProvider>
      )

      expect(
        query.root.findAllByProps({ className: "extra-small" }, { deep: true })
          .length
      ).toBe(0)
      expect(
        query.root.findAllByProps({ className: "large" }, { deep: true }).length
      ).toBe(0)
      expect(
        query.root.findAllByProps({ className: "medium" }, { deep: true })
          .length
      ).toBe(1)
    })

    it("renders no spans with deep nesting where parent has no intersection with children", () => {
      const query = renderer.create(
        <MediaContextProvider>
          <Media at="extra-small">
            <Media at="medium">
              <Media at="extra-small">
                <span className="extra-small" />
              </Media>
              <Media at="medium">
                <span className="medium" />
              </Media>
              <Media at="large">
                <span className="large" />
              </Media>
            </Media>

            <Media at="large">
              <span className="large" />
            </Media>
          </Media>
        </MediaContextProvider>
      )

      expect(query.root.findAllByType("span", { deep: true }).length).toBe(0)
    })

    it("renders multiple spans in path, without rendering spans that don't intersect", () => {
      const query = renderer.create(
        <MediaContextProvider>
          <Media at="extra-small">
            {/* Should render */}
            <span />
            <Media at="extra-small">
              {/* Should render */}
              <span />
              <Media at="extra-small">
                {/* Should render */}
                <span />
              </Media>
              <Media at="medium">
                {/* Should NOT render */}
                <span />
              </Media>
            </Media>
            <Media at="medium">
              {/* Should NOT render */}
              <span />
            </Media>
          </Media>
        </MediaContextProvider>
      )

      expect(query.root.findAllByType("span", { deep: true }).length).toBe(3)
    })

    it("renders correct Media when using greaterThan prop", () => {
      const query = renderer.create(
        <MediaContextProvider>
          <Media greaterThan="small">
            <Media at="extra-small">
              {/* Should NOT render */}
              <span />
            </Media>
            <Media at="small">
              {/* Should NOT render */}
              <span />
            </Media>
            <Media at="medium">
              {/* Should render */}
              <span />
            </Media>
            <Media at="large">
              {/* Should render */}
              <span />
            </Media>
          </Media>
        </MediaContextProvider>
      )

      expect(query.root.findAllByType("span", { deep: true }).length).toBe(2)
    })

    it("renders correct Media when using greaterThanOrEqual prop", () => {
      const query = renderer.create(
        <MediaContextProvider>
          <Media greaterThanOrEqual="small">
            <Media at="extra-small">
              {/* Should NOT render */}
              <span />
            </Media>
            <Media at="small">
              {/* Should render */}
              <span />
            </Media>
            <Media at="medium">
              {/* Should render */}
              <span />
            </Media>
            <Media at="large">
              {/* Should render */}
              <span />
            </Media>
          </Media>
        </MediaContextProvider>
      )

      expect(query.root.findAllByType("span", { deep: true }).length).toBe(3)
    })

    it("renders correct Media when using lessThan prop", () => {
      const query = renderer.create(
        <MediaContextProvider>
          <Media lessThan="small">
            <Media at="extra-small">
              {/* Should render */}
              <span />
            </Media>
            <Media at="small">
              {/* Should NOT render */}
              <span />
            </Media>
            <Media at="medium">
              {/* Should NOT render */}
              <span />
            </Media>
            <Media at="large">
              {/* Should NOT render */}
              <span />
            </Media>
          </Media>
        </MediaContextProvider>
      )

      expect(query.root.findAllByType("span", { deep: true }).length).toBe(1)
    })

    it("renders correct Media when using between prop", () => {
      const query = renderer.create(
        <MediaContextProvider>
          <Media between={["small", "large"]}>
            <Media at="extra-small">
              {/* Should NOT render */}
              <span />
            </Media>
            <Media at="small">
              {/* Should render */}
              <span />
            </Media>
            <Media at="medium">
              {/* Should render */}
              <span />
            </Media>
            <Media at="large">
              {/* Should NOT render */}
              <span />
            </Media>
          </Media>
        </MediaContextProvider>
      )

      expect(query.root.findAllByType("span", { deep: true }).length).toBe(2)
    })
  })

  // TODO: This actually doesn’t make sense, I think, because if the user
  //       decides to not use a provider they are opting for rendering all
  //       variants. We just need to make sure to document this well.
  xdescribe("without a context provider", () => {
    it("only renders the current breakpoint", () => {
      mockCurrentDynamicBreakpoint("medium")

      const query = renderer.create(
        <>
          <Media at="extra-small">
            <span className="extra-small" />
          </Media>
          <Media at="medium">
            <span className="medium" />
          </Media>
          <Media at="large">
            <span className="large" />
          </Media>
        </>
      )

      expect(query.root.findAllByType("span").length).toEqual(1)
      expect(query.root.findByProps({ className: "medium" })).not.toBeNull()
    })
  })
})

function mockCurrentDynamicBreakpoint(at) {
  window.matchMedia = jest.fn(mediaQuery => {
    const key = Object.entries(mediaQueries.dynamicResponsiveMediaQueries).find(
      ([_, query]) => mediaQuery === query
    )[0]
    // Return mock object that only matches the mocked breakpoint
    return {
      matches: key === at,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }
  })
}
