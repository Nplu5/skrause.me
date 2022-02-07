import {useLoaderData} from "remix"
import {getTils} from "~/utils/til"

export function loader() {
  return getTils()
}

export default function Til() {
  const data = useLoaderData()
  console.log(data)
  return (
    <>
      <h1>Today I Learned (TIL)</h1>
      <p>Kurze Erklärung zu Today I learned.</p>
      <div>Suche-Platzhalter</div>
      <div>Tag-Pillen Auswahlmenü</div>
      <div>Auswahl nach Jahren/Monaten etc.</div>
      <div>Liste an Today I learned</div>
    </>
  )
}
