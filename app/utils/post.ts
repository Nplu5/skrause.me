import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant"

const postsPath = path.join(__dirname, "..", "content", "blog")

export type Post = {
  slug: string
  title: string
}

export type PostMarkdownAttributes = {
  title: string
}

function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
  return attributes?.title
}

export async function getPosts() {
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
        slug: dirent.name.replace(/\.md)$/, ""),
        title: attributes.title,
      }
    }),
  )
}
