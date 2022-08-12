import { getAPI } from "../utils/api"

const api = getAPI()

export const Articles = () => {
  const { data } = api.fetchArticles.read()

  return (
    <div>
      <h2>Featured Articles</h2>
      <ul>
        {data.articles.map((article) => {
          return <li key={article.title}>{article.title}</li>
        })}
      </ul>
    </div>
  )
}
