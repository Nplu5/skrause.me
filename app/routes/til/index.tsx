import {useState} from "react"
import {Link, useLoaderData} from "remix"
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

// TODO: do filtering and searching on server side

export default function TilOverview() {
  const {tils} = useLoaderData<LoaderData>()
  const [currentYear, setCurrentYear] = useState<string>("All")

  const years = ["All", ...new Set(tils.map((til) => til.year).reverse())]

  const currentTils = filterTils(tils, currentYear)
  return (
    <>
      <h1>Today I Learned (TIL)</h1>
      <p>Kurze Erklärung zu Today I learned.</p>
      <div>Suche-Platzhalter</div>
      <div>
        {years.map((year) => {
          return (
            <button key={year} onClick={() => setCurrentYear(year.toString())}>
              {year}
            </button>
          )
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
