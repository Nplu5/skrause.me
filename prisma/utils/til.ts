import path from "path"
import fs from "fs/promises"
import invariant from "tiny-invariant"
import {bundleMDX} from "mdx-bundler"

const tilsPath = path.join(__dirname, "..", "..", "content", "til")

export type CompleteTil = TilMarkdownAttributes & {
  content: string
  year: number
  slug: string
}

export type TilMarkdownAttributes = {
  title: string
  published: boolean
  author: string
  summary: string
}

function isValidTilAttributes(attributes: any): attributes is TilMarkdownAttributes {
  return attributes?.title && attributes?.published && attributes?.author && attributes?.summary
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
              const {code, frontmatter} = await bundleMDX({source: file.toString()})
              invariant(
                isValidTilAttributes(frontmatter),
                `${yearent.name} needs a 'title' attribute. `,
              )
              return {
                slug: yearent.name.replace(/\.md$/, ""),
                title: frontmatter.title,
                year: parseInt(year),
                content: code,
                summary: frontmatter.summary,
                author: frontmatter.author,
                published: frontmatter.published,
              }
            }),
        )
      }),
  )
}
