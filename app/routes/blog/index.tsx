import {Link, useLoaderData} from "remix"
import {getPosts} from "~/utils/post"

import type {LoaderFunction} from "remix"
import type {Post} from "~/utils/post"

type LoaderData = {
  posts: Omit<Post, "html">[]
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return {
    posts: await getPosts(),
  }
}

export default function Blog() {
  const data = useLoaderData<LoaderData>()
  console.log(data)
  return (
    <>
      <h1>Blog</h1>
      <div>Suche-Platzhalter</div>
      <div>Tag-Pillen Auswahlmenü</div>
      <ul>
        {data.posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
