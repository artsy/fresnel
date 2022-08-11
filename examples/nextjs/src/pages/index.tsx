import { SuspenseWrapper } from "../../../../dist/suspense/SuspenseWrapper"
import { Desktop } from "../components/Desktop"
import { Mobile } from "../components/Mobile"
import { Media, MediaContextProvider } from "../media"

export default function HomePage() {
  return (
    <MediaContextProvider>
      <Media at="xs">
        {(className, renderChildren, isPending) => {
          return (
            <SuspenseWrapper
              media={{
                active: renderChildren,
                isPending,
              }}
            >
              <div className={className}>
                <Mobile />
              </div>
            </SuspenseWrapper>
          )
        }}
      </Media>
      <Media greaterThan="xs">
        {(className, renderChildren, isPending) => {
          return (
            <SuspenseWrapper
              media={{
                active: renderChildren,
                isPending,
              }}
            >
              <div className={className}>
                <Desktop />
              </div>
            </SuspenseWrapper>
          )
        }}
      </Media>
      {/* <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media> */}
    </MediaContextProvider>
  )
}
