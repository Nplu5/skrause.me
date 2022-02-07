import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant"

const tilPath = path.join(__dirname, "..", "content", "til")

export type Til = {
  slug: string
  title: string
}

export type TilMarkdownAttributes = {
  title: string
}

function isValidTilAttributes(attributes: any): attributes is TilMarkdownAttributes {
  return attributes?.title
}

export async function getTils() {
  const directoryContent = await fs.readdir(tilPath, {withFileTypes: true})

  // TODO: Clean up for better readability
  return Promise.all(
    directoryContent
      .filter((dirent) => !dirent.isFile())
      .map(async (dirent) => {
        // iterate over years
        const year = dirent.name
        const yearPath = path.join(tilPath, dirent.name)
        const yearContent = await fs.readdir(yearPath, {withFileTypes: true})

        return await Promise.all(
          yearContent
            .filter((yearent) => yearent.isFile())
            .map(async (yearent) => {
              // Iterate over years content
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
