import {useState} from "react"
import {useLoaderData} from "remix"
import {getTils, Til} from "~/utils/til"

type TilGrouped = {
  [x: string]: Til[]
}

type LoaderData = {
  tils: Til[]
}

export async function loader() {
  const tils = await getTils()
  return {
    tils: tils.flat(1),
  }
}

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
        {}
        {years.map((year) => {
          return (
            <button key={year} onClick={() => setCurrentYear(year)}>
              {year}
            </button>
          )
        })}
      </div>
      <ul>
        {currentTils.map((til) => (
          <li key={til.slug}>{til.title}</li>
        ))}
      </ul>
    </>
  )
}

function filterTils(tils: Til[], currentYear: string) {
  if (currentYear === "All") {
    return tils
  }
  return tils.filter((til) => til.year === currentYear)
}
