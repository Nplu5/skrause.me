import {Link, useLoaderData} from "remix"
import invariant from "tiny-invariant"
import {getTil} from "~/utils/til"

import type {LoaderFunction} from "remix"
import type {CompleteTil} from "~/utils/til"

export const loader: LoaderFunction = async ({params}) => {
  invariant(params.slug, "Expected params.slug")
  return await getTil(params.slug)
}

export default function TilPost() {
  const til = useLoaderData<CompleteTil>()
  return (
    <div>
      <Link to="/til">Back to Tils</Link>
      <h1>Til: {til.title}</h1>
      <h3>From: {til.slug.split("-").join(" ")}</h3>
      <div dangerouslySetInnerHTML={{__html: til.html}} />
    </div>
  )
}
