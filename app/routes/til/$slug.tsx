import {Link, useLoaderData} from "remix"
import invariant from "tiny-invariant"
import {db} from "~/utils/db.server"
import {getMDXComponent} from "mdx-bundler/client"
import type {LoaderFunction} from "remix"
import {useMemo} from "react"

type LoaderData = {
  title: string
  slug: string
  content: string
}

export const loader: LoaderFunction = async ({params}) => {
  invariant(params.slug, "Expected params.slug")
  return await db.til.findUnique({
    where: {slug: params.slug},
    select: {slug: true, title: true, content: true},
  })
}

export default function TilPost() {
  const til = useLoaderData<LoaderData>()
  const Component = useMemo(() => getMDXComponent(til.content), [til.content])

  return (
    <div>
      <Link to="/til">Back to Tils</Link>
      <h1>Til: {til.title}</h1>
      <h3>From: {til.slug.split("-").join(" ")}</h3>
      <Component />
    </div>
  )
}
