import invariant from "tiny-invariant"
import {Link, useLoaderData} from "remix"
import {getPost} from "~/utils/post"

import type {CompletePost} from "~/utils/post"
import type {LoaderFunction} from "remix"

export const loader: LoaderFunction = async ({params}) => {
  invariant(params.slug, "Expected params.slug")
  return await getPost(params.slug)
}

export default function PostRoute() {
  const post = useLoaderData<CompletePost>()
  return (
    <div>
      <Link to="/blog">Back to Blog</Link>
      <div dangerouslySetInnerHTML={{__html: post.html}} />
    </div>
  )
}
