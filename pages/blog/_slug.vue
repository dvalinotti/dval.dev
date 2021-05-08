<template>
  <main class="container mx-auto px-4">
    <article class="prose text-left">
      <h1>{{ document.title }}</h1>
      <span class="text-gray-700 text-sm"
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
  computed: {
    publishDate() {
      return this.document && this.document.date
        ? dateFormat(new Date(this.document.date), 'fullDate')
        : ''
    }
  }
}
</script>

<style scoped>
.container .prose {
  max-width: 75ch;
}
.container .prose h1 {
  margin-bottom: 0.5rem;
}
</style>
