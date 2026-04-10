import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
      schema: z.object({
        date: z.string(),
        featuredImage: z.string(),
        featuredImageAlt: z.string(),
        subtitle: z.string(),
        tags: z.array(z.string()),
        keywords: z.string().optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**',
      schema: z.object({
        image: z.string(),
        imageAlt: z.string(),
        position: z.number(),
        isBeta: z.boolean().optional(),
        tag: z.string(),
        company: z.string(),
        github: z.string().optional(),
        liveUrl: z.string().optional(),
        readMoreUrl: z.string().optional(),
        npm: z.string().optional()
      })
    })
  }
})
