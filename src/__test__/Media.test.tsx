import "jest-styled-components"

import React from "react"
import renderer from "react-test-renderer"
import styled, { css } from "styled-components"
import { createMedia } from "../Media"

const { Media, MediaContextProvider } = createMedia({
  breakpoints: {
    "extra-small": 0,
    small: 768,
    medium: 1024,
    large: 1120,
  },
  interactions: {
    hover: negated => `(hover:${negated ? "none" : "hover"})`,
  },
})

describe("Media", () => {
  // FIXME: Once an error is thrown it breaks all other tests
  xit("throws when trying to use mutually exclusive props", () => {
    expect(() => {
      renderer.create(
        <Media query="(width:100px)" at="extra-small">
          ohai
        </Media>
      )
    }).toThrow()
  })

  it("creates a container that will only display when its query matches", () => {
    const query = renderer
      .create(<Media query="(width:100px)">ohai</Media>)
      .toJSON()
    expect(query.type).toEqual("div")
    expect(query).toHaveStyleRule("display", "none")
    expect(query).toHaveStyleRule("display", "contents", {
      media: "(width:100px)",
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

  describe("concerning interactions", () => {
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
    it("yields the generated style such that it can be applied to another element", () => {
      const query = renderer
        .create(
          <Media lessThan="small">
            {generatedStyle => {
              const Component = styled.span`
                ${generatedStyle()};
              `
              return <Component>ohai</Component>
            }}
          </Media>
        )
        .toJSON()
      expect(query.type).toEqual("span")
      expect(query).toHaveStyleRule("display", "none")
      expect(query).toHaveStyleRule("display", "contents", {
        media: "(max-width:767px)",
      })
    })

    it("yields the generated style and allows adding styles to the matching media selector", () => {
      const query = renderer
        .create(
          <Media lessThan="small">
            {generatedStyle => {
              const Component = styled.div`
                ${generatedStyle(css`
                  color: red;
                `)};
              `
              return <Component>ohai</Component>
            }}
          </Media>
        )
        .toJSON()
      expect(query.type).toEqual("div")
      expect(query).not.toHaveStyleRule("color", "red")
      expect(query).toHaveStyleRule("color", "red", {
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
  })
})
