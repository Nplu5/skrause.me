import {PrismaClient} from "@prisma/client"
import {getPosts} from "prisma/utils/post"
import {getTils} from "prisma/utils/til"

const prisma = new PrismaClient()

async function seed() {
  await Promise.all([seedPosts(), seedTils()])
}

seed()

async function seedTils() {
  const tils = (await getTils()).flat(1)
  await Promise.all(
    tils.map((til) => {
      const data = {
        title: til.title,
        slug: til.slug,
        year: til.year,
        content: til.content,
        published: til.published,
        author: til.author,
        summary: til.summary,
      }
      return prisma.til.create({data})
    }),
  )
}

async function seedPosts() {
  const posts = await getPosts()
  await Promise.all(
    posts.map((post) => {
      const data = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        summary: post.summary,
        titlePictureUrl: post.titlePictureUrl ?? "",
        published: post.published,
        author: post.author,
      }
      return prisma.post.create({data})
    }),
  )
}
