<template>
  <main class="container mx-auto px-4 md:px-8">
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
.container .prose {
  max-width: 75ch;
}
.container .prose h1 {
  margin-bottom: 0.5rem;
}
html.dark .prose h1,
html.dark .prose h2,
html.dark .prose h3,
html.dark .prose h4,
html.dark .prose strong,
html.dark .prose code {
  color: white;
}
html.dark .prose pre,
html.dark .prose .operator {
  background: black;
}
html.dark .prose code .token {
  text-shadow: none;
}
html.dark .prose code .token.atrule,
html.dark .prose code .token.attr-value,
html.dark .prose code .token.keyword {
  color: #00b3ff;
}
html.dark .prose code .token.function,
html.dark .prose code .token.class-name {
  color: #ff4f73;
}

html.dark .prose code .token.selector,
html.dark .prose code .token.attr-name,
html.dark .prose code .token.string,
html.dark .prose code .token.char,
html.dark .prose code .token.builtin,
html.dark .prose code .token.inserted {
  color: #a6f900;
}
html.dark .prose code .token.operator,
html.dark .prose code .token.entity,
html.dark .prose code .token.url,
html.dark .prose code .language-css .token.string,
html.dark .prose code .style .token.string {
  color: #ff8a00;
}
</style>
