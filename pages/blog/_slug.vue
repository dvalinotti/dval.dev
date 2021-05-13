<template>
  <main class="container mx-auto px-4 md:px-8 max-w-4xl">
    <article class="prose text-left dark:text-white">
      <h1>{{ document.title }}</h1>
      <span class="text-gray-700 text-sm dark:text-gray-200"
        >{{ publishDate }} - {{ document.readingTime.text }}</span
      >
      <nuxt-content :document="document" />
    </article>
  </main>
</template>

<script>
import dateFormat from 'dateformat'

export default {
  name: 'BlogPost',
  async asyncData({ $content, params, error }) {
    try {
      const slug = params.slug
      const document = await $content('blog', slug)
        .fetch()
        .catch(() => {
          error({
            statusCode: 404,
            message: 'Page not found.'
          })
        })

      return {
        document
      }
    } catch (err) {
      error(err)
    }
  },
  data: () => ({
    document: undefined
  }),
  head() {
    return {
      title: this.document?.title || '',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.document?.subtitle || ''
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.document?.keywords || ''
        }
      ]
    }
  },
  computed: {
    publishDate() {
      return this.document && this.document.date
        ? dateFormat(new Date(this.document.date), 'fullDate')
        : ''
    }
  }
}
</script>

<style>
@import '~/assets/css/blog-dark.css';

.container .prose {
  max-width: 75ch;
}
.container .prose h1 {
  margin-bottom: 0.5rem;
}
</style>
