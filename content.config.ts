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
    }),
    photos: defineCollection({
      type: 'page',
      source: 'photos/**',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
        position: z.number(),
        coverImage: z.string(),
        photos: z.array(z.object({
          publicId: z.string(),
          alt: z.string(),
          width: z.number(),
          height: z.number(),
          caption: z.string().optional()
        }))
      })
    })
  }
})
