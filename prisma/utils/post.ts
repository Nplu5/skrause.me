import path from "path"
import fs from "fs/promises"
import invariant from "tiny-invariant"
import {bundleMDX} from "mdx-bundler"

const postsPath = path.join(__dirname, "..", "..", "content", "blog")

export type CompletePost = PostMarkdownAttributes & {
  content: string
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
        file = await fs.readFile(path.join(postsPath, dirent.name, "index.mdx"))
      }
      const {code, frontmatter} = await bundleMDX({source: file.toString()})
      invariant(isValidPostAttributes(frontmatter), `${dirent.name} needs a 'title' attribute.`)

      return {
        slug: dirent.name.replace(/\.md$/, ""),
        title: frontmatter.title,
        summary: frontmatter.summary,
        published: frontmatter.published,
        author: frontmatter.author,
        content: code,
      }
    }),
  )
}
