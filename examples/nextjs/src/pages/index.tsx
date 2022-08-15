import { Suspense } from "react"
import { Articles } from "../components/Articles"
import { Artists } from "../components/Artists"
import { Desktop } from "../components/Desktop"
import { Mobile } from "../components/Mobile"
import { Media, MediaContextProvider } from "../media"

export default function HomePage() {
  return (
    <>
      <MediaContextProvider>
        <Media at="xs">
          <Mobile />

          <Suspense fallback={<div>Loading articles...</div>}>
            <Articles />
          </Suspense>
        </Media>
        <Media greaterThan="xs">
          <Desktop />

          <Suspense fallback={<div>Loading artists...</div>}>
            <Artists />
          </Suspense>
        </Media>
      </MediaContextProvider>
    </>
  )
}
