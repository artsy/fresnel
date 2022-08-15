import { getAPI } from "../utils/api"

const api = getAPI()

export const Artists = () => {
  const { data } = api.fetchArtists.read()

  return (
    <div>
      <h2>Trending Artists</h2>
      <ul>
        {data.artists.map((artist) => {
          return <li key={artist.name}>{artist.name}</li>
        })}
      </ul>
    </div>
  )
}
