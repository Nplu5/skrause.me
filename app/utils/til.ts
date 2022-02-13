import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant"
import {marked} from "marked"

const tilsPath = path.join(__dirname, "..", "content", "til")

export type Til = {
  slug: string
  title: string
  year: string
}

export type CompleteTil = Til & {
  html: string
}

export type TilMarkdownAttributes = {
  title: string
}

function isValidTilAttributes(attributes: any): attributes is TilMarkdownAttributes {
  return attributes?.title
}

export async function getTil(slug: string): Promise<CompleteTil> {
  const year = slug.slice(0, 4)
  const filePath = path.join(tilsPath, year, `${slug}.md`)
  const file = await fs.readFile(filePath)
  const {attributes, body} = parseFrontMatter(file.toString())
  invariant(isValidTilAttributes(attributes), `Til ${filePath} is missing attributes.`)
  const html = marked(body)
  return {
    slug,
    title: attributes.title,
    year,
    html,
  }
}

export async function getTils() {
  const directoryContent = await fs.readdir(tilsPath, {withFileTypes: true})

  return Promise.all(
    directoryContent
      .filter((dirent) => !dirent.isFile())
      .map(async (dirent) => {
        // iterate over years folders
        const year = dirent.name
        const yearPath = path.join(tilsPath, dirent.name)
        const yearContent = await fs.readdir(yearPath, {withFileTypes: true})

        return await Promise.all(
          yearContent
            .filter((yearent) => yearent.isFile())
            .map(async (yearent) => {
              // Iterate over years folder content
              const file = await fs.readFile(path.join(yearPath, yearent.name))
              const {attributes} = parseFrontMatter(file.toString())
              invariant(
                isValidTilAttributes(attributes),
                `${yearent.name} needs a 'title' attribute. `,
              )
              return {
                slug: yearent.name.replace(/\.md$/, ""),
                title: attributes.title,
                year,
              }
            }),
        )
      }),
  )
}
