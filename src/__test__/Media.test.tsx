import "jest-styled-components"

import React from "react"
import renderer from "react-test-renderer"
import { injectGlobal } from "styled-components"
import { createMedia } from "../Media"
import { Breakpoints } from "../Breakpoints"

const config = {
  breakpoints: {
    "extra-small": 0,
    small: 768,
    medium: 1024,
    large: 1120,
  },
  interactions: {
    hover: negated => `(hover:${negated ? "none" : "hover"})`,
  },
}

const { Media, MediaContextProvider, MediaStyle } = createMedia(config)

describe("Media", () => {
  beforeEach(() => {
    injectGlobal`
      ${MediaStyle}
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

  describe("concerning breakpoints", () => {
    it("creates a container that will only display when the page size is less than the specified breakpoint", () => {
      const query = renderer
        .create(<Media lessThan="small">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(max-width:767px)",
      })
    })

    it("creates a container that will only display when the page size is greater than or equal to the next breakpoint of the specified breakpoint", () => {
      const query = renderer
        .create(<Media greaterThan="medium">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(min-width:1120px)",
      })
    })

    it("creates a container that will only display when the page size is greater than or equal to the specified breakpoint", () => {
      const query = renderer
        .create(<Media greaterThanOrEqual="medium">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(min-width:1024px)",
      })
    })

    it("creates a container that will only display when the page size is between the specified breakpoints", () => {
      const query = renderer
        .create(<Media between={["small", "large"]}>ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(min-width:768px) and (max-width:1119px)",
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

  xdescribe("concerning interactions", () => {
    it("creates a container that will only display when the interaction is available", () => {
      const query = renderer
        .create(<Media interaction="hover">ohai</Media>)
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(hover:hover)",
      })
    })

    it("creates a container that will only display when the interaction is not available", () => {
      const query = renderer
        .create(
          <Media not interaction="hover">
            ohai
          </Media>
        )
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(hover:none)",
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
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(max-width:767px)",
      })
    })
  })

  describe("with a context", () => {
    it("renders only matching `at` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyRenderAt={["extra-small", "small"]}>
          <Media at="extra-small">extra-small</Media>
          <Media at="small">small</Media>
          <Media at="medium">medium</Media>
        </MediaContextProvider>
      )
      expect(
        query.root.findAllByType("div").map(div => div.props.children)
      ).toEqual(["extra-small", "small"])
    })

    it("renders only matching `lessThan` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyRenderAt={["small", "medium"]}>
          <Media lessThan="small">extra-small</Media>
          <Media lessThan="medium">small</Media>
          <Media lessThan="large">medium</Media>
        </MediaContextProvider>
      )
      expect(
        query.root.findAllByType("div").map(div => div.props.children)
      ).toEqual(["small", "medium"])
    })

    it("renders only matching `greaterThan` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyRenderAt={["small", "medium"]}>
          <Media greaterThan="extra-small">small</Media>
          <Media greaterThan="small">medium</Media>
          <Media greaterThan="medium">large</Media>
        </MediaContextProvider>
      )
      expect(
        query.root.findAllByType("div").map(div => div.props.children)
      ).toEqual(["small", "medium"])
    })

    it("renders only matching `greaterThanOrEqual` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyRenderAt={["small", "medium"]}>
          <Media greaterThanOrEqual="small">small</Media>
          <Media greaterThanOrEqual="medium">medium</Media>
          <Media greaterThanOrEqual="large">large</Media>
        </MediaContextProvider>
      )
      expect(
        query.root.findAllByType("div").map(div => div.props.children)
      ).toEqual(["small", "medium"])
    })

    it("renders only matching `between` breakpoints", () => {
      const query = renderer.create(
        <MediaContextProvider onlyRenderAt={["medium", "large"]}>
          <Media between={["extra-small", "medium"]}>
            extra-small - medium
          </Media>
          <Media between={["small", "large"]}>small - large</Media>
        </MediaContextProvider>
      )
      expect(
        query.root.findAllByType("div").map(div => div.props.children)
      ).toEqual(["small - large"])
    })

    xit("renders only matching interactions", () => {
      // TODO:
    })

    describe("client-side with dynamic media query API available", () => {
      it("only renders the current breakpoint", () => {
        mockCurrentDynamicBreakpoint("medium")

        const query = renderer.create(
          <MediaContextProvider onlyRenderAt={["small", "medium"]}>
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

        expect(query.root.findAllByType("span").length).toEqual(1)
        expect(query.root.findByProps({ className: "medium" })).not.toBeNull()
      })

      it("disables usage of dynamic API to further narrow down", () => {
        mockCurrentDynamicBreakpoint("medium")

        const query = renderer.create(
          <MediaContextProvider
            onlyRenderAt={["extra-small", "medium", "large"]}
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
          <MediaContextProvider onlyRenderAt={["small", "medium"]}>
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
  const breakpoints = new Breakpoints(config.breakpoints)

  window.matchMedia = jest.fn(mediaQuery => {
    const key = Object.entries(breakpoints.getAtMediaQueries()).find(
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
