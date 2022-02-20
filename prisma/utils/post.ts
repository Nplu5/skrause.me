import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant"
import {marked} from "marked"

const postsPath = path.join(__dirname, "..", "..", "content", "blog")

export type CompletePost = PostMarkdownAttributes & {
  html: string
  slug: string
}

export type PostMarkdownAttributes = {
  title: string
  summary: string
  published: boolean
  author: string
  titlePictureUrl?: string
}

function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
  return attributes?.title && attributes?.summary && attributes?.published && attributes?.author
}

export async function getPosts(): Promise<CompletePost[]> {
  const directoryContent = await fs.readdir(postsPath, {withFileTypes: true})

  return Promise.all(
    directoryContent.map(async (dirent) => {
      let file = null
      if (dirent.isFile()) {
        file = await fs.readFile(path.join(postsPath, dirent.name))
      } else {
        file = await fs.readFile(path.join(postsPath, dirent.name, "index.md"))
      }
      const {attributes, body} = parseFrontMatter(file.toString())
      invariant(isValidPostAttributes(attributes), `${dirent.name} needs a 'title' attribute.`)

      const html = marked(body)
      return {
        slug: dirent.name.replace(/\.md$/, ""),
        title: attributes.title,
        summary: attributes.summary,
        published: attributes.published,
        author: attributes.author,
        html,
      }
    }),
  )
}
