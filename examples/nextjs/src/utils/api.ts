import { suspensePromise } from "../utils/suspensePromise"

// Create a simple suspense-friendly API
export const getAPI = () => {
  return {
    fetchArtists: suspensePromise(() => {
      return fetch(
        "https://deelay.me/2000/https://metaphysics-staging.artsy.net/v2?query={ artists(sort: TRENDING_DESC) { name } }"
      )
        .then((response) => response.json())
        .catch((error) => {
          // tslint:disable-next-line:no-console
          console.error(error)
        })
    }),
    fetchArticles: suspensePromise(() => {
      return fetch(
        "https://deelay.me/2000/https://metaphysics-staging.artsy.net/v2?query={ articles(featured: true) { title } }"
      )
        .then((response) => response.json())
        .catch((error) => {
          // tslint:disable-next-line:no-console
          console.error(error)
        })
    }),
  }
}
