import React, { CSSProperties } from "react"
import { Media } from "./setup"

const Box: CSSProperties = {
  width: "200px",
  height: "200px",
  textAlign: "center",
  verticalAlign: "middle",
}

const BreakpointStyle: CSSProperties = {
  ...Box,
  fontSize: "92px",
  lineHeight: "200px",
}

const ExtraSmallStyle: CSSProperties = {
  ...BreakpointStyle,
  backgroundColor: "green",
}

const SmallStyle: CSSProperties = {
  ...BreakpointStyle,
  backgroundColor: "yellow",
}

const MediumStyle: CSSProperties = {
  ...BreakpointStyle,
  backgroundColor: "orange",
}

const LargeStyle: CSSProperties = {
  ...BreakpointStyle,
  backgroundColor: "red",
}

export const App: React.SFC = () => (
  <div style={{ width: "400px" }}>
    <div>
      <h1>
        Default <code>&lt;div&gt;</code> container
      </h1>
      <Media at="xs">
        <div style={ExtraSmallStyle}>xs</div>
      </Media>
      <Media at="sm">
        <div style={SmallStyle}>sm</div>
      </Media>
      <Media at="md">
        <div style={MediumStyle}>md</div>
      </Media>
      <Media greaterThan="md">
        <div style={LargeStyle}>lg</div>
      </Media>
    </div>
    <div>
      <h1>
        Custom <code>&lt;li&gt;</code> container by utilizing render prop
      </h1>
      <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
        {/* prettier-ignore
          *
          * These line-items can’t be wrapped by a div, so use a render prop to
          * receive the class name and a hint as to wether children should be
          * rendered.
          */}
        <Media lessThan="sm">
          {className => (
            <li className={className} style={ExtraSmallStyle}>
              xs
            </li>
          )}
        </Media>
        <Media between={["sm", "lg"]}>
          {(className, renderChildren) =>
            renderChildren && (
              <>
                <li
                  className={className}
                  style={{
                    ...SmallStyle,
                    height: "100px",
                    lineHeight: "100px",
                  }}
                >
                  sm
                </li>
                <li
                  className={className}
                  style={{
                    ...MediumStyle,
                    height: "100px",
                    lineHeight: "100px",
                  }}
                >
                  md
                </li>
              </>
            )
          }
        </Media>
        <Media greaterThanOrEqual="lg">
          {className => (
            <li className={className} style={LargeStyle}>
              lg
            </li>
          )}
        </Media>
      </ul>
    </div>
    <div>
      <h1>Interaction</h1>
      <Media interaction="hover">
        <div
          style={{
            ...Box,
            fontSize: "40px",
            lineHeight: "50px",
            backgroundColor: "purple",
          }}
        >
          I’m not visible on touch devices!
        </div>
      </Media>
      <Media interaction="notHover">
        <div
          style={{
            ...Box,
            fontSize: "40px",
            lineHeight: "50px",
            backgroundColor: "blue",
          }}
        >
          Oh well hello there, touch devices!
        </div>
      </Media>
    </div>
  </div>
)
