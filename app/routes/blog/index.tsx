import {Link, useLoaderData} from "remix"
import {db} from "~/utils/db.server"

import type {LoaderFunction} from "remix"

type Post = {
  slug: string
  title: string
}

type LoaderData = {
  posts: Array<Post>
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const posts = await db.post.findMany({
    orderBy: {createdAt: "desc"},
    select: {slug: true, title: true},
  })
  return {posts: posts}
}

export default function Blog() {
  const data = useLoaderData<LoaderData>()
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
