import {Link, NavLink, useLoaderData, useSearchParams} from "remix"
import {db} from "~/utils/db.server"

import type {LoaderFunction} from "remix"

type Til = {
  slug: string
  title: string
  year: number
}

type LoaderData = {
  tils: Array<Til>
}

export const loader: LoaderFunction = async () => {
  const tils = await db.til.findMany({
    orderBy: {createdAt: "desc"},
    select: {slug: true, title: true, year: true},
  })
  return {tils}
}

const filterIdentifier = "filter"

export default function TilOverview() {
  const {tils} = useLoaderData<LoaderData>()
  const [searchParams] = useSearchParams()

  const filter = searchParams.get(filterIdentifier) ?? "All"

  const years = ["All", ...new Set(tils.map((til) => til.year).reverse())]

  const currentTils = filterTils(tils, filter)
  return (
    <>
      <h1>Today I Learned (TIL)</h1>
      <p>Kurze Erklärung zu Today I learned.</p>
      <div>Suche-Platzhalter</div>
      <div>
        {years.map((year) => {
          return <NavLink to={`?${filterIdentifier}=${year}`}>{year}</NavLink>
        })}
      </div>
      <ul>
        {currentTils.map((til) => (
          <li key={til.slug}>
            <Link to={til.slug}>{til.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

function filterTils(tils: Array<Til>, currentYear: string) {
  if (currentYear === "All") {
    return tils
  }
  return tils.filter((til) => til.year.toString() === currentYear)
}
