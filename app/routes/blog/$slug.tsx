import invariant from "tiny-invariant"
import {Link, useLoaderData} from "remix"

import type {LoaderFunction} from "remix"
import {db} from "~/utils/db.server"

type LoaderData = {
  slug: string
  content: string
}

export const loader: LoaderFunction = async ({params}) => {
  invariant(params.slug, "Expected params.slug")
  return await db.post.findUnique({
    where: {slug: params.slug},
    select: {slug: true, content: true},
  })
}

export default function PostRoute() {
  const post = useLoaderData<LoaderData>()
  return (
    <div>
      <Link to="/blog">Back to Blog</Link>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
    </div>
  )
}
