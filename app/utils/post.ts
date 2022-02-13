import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant"
import {marked} from "marked"

const postsPath = path.join(__dirname, "..", "content", "blog")

export type Post = {
  slug: string
  title: string
}

export type CompletePost = Post & {
  html: string
}

export type PostMarkdownAttributes = {
  title: string
}

function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
  return attributes?.title
}

export async function getPost(slug: string): Promise<CompletePost> {
  const folderPath = path.join(postsPath, slug)
  let filePath = path.join(postsPath, `${slug}.md`)
  try {
    if ((await fs.stat(folderPath)).isDirectory()) {
      filePath = path.join(folderPath, "index.md")
    }
  } catch {}

  const file = await fs.readFile(filePath)
  const {attributes, body} = parseFrontMatter(file.toString())
  invariant(isValidPostAttributes(attributes), `Post ${filePath} is missing attributes.`)

  const html = marked(body)
  return {
    slug,
    title: attributes.title,
    html,
  }
}

export async function getPosts(): Promise<Post[]> {
  const directoryContent = await fs.readdir(postsPath, {withFileTypes: true})

  return Promise.all(
    directoryContent.map(async (dirent) => {
      let file = null
      if (dirent.isFile()) {
        file = await fs.readFile(path.join(postsPath, dirent.name))
      } else {
        file = await fs.readFile(path.join(postsPath, dirent.name, "index.md"))
      }
      const {attributes} = parseFrontMatter(file.toString())
      invariant(isValidPostAttributes(attributes), `${dirent.name} needs a 'title' attribute.`)
      return {
        slug: dirent.name.replace(/\.md$/, ""),
        title: attributes.title,
      }
    }),
  )
}
