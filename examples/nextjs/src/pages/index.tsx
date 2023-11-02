import { Media, MediaContextProvider } from "../media"

export default function HomePage() {
  return (
    <MediaContextProvider>
      <Media at="xs">Hello mobile!</Media>
      <Media greaterThan="xs">Hello desktop!</Media>
    </MediaContextProvider>
  )
}
