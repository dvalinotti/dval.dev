<template>
  <main class="container mx-auto px-4 md:px-8 max-w-4xl">
    <article class="prose text-left dark:text-white">
      <h1>{{ document.title }}</h1>
      <span class="text-gray-700 text-sm dark:text-gray-200"
        >{{ publishDate }} - {{ document.readingTime.text }}</span
      >
      <div class="banner-img">
        <img
          class="absolute top-0 left-0 w-full h-full object-cover object-center"
          :src="getThumbnail(document.featuredImage)"
          :alt="document.featuredImageAlt"
        />
      </div>
      <nuxt-content :document="document" />
    </article>
    <div class="flex items-center mt-16 dark:text-white">
      <span class="italic font-bold mr-4">Tags:</span>
      <ul class="flex items-center">
        <li v-for="(tag, index) in document.tags" :key="index">
          <nuxt-link
            class="bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 mr-2"
            :to="`/blog/tags/${tag}`"
          >
            #{{ tag }}
          </nuxt-link>
        </li>
      </ul>
    </div>
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
  },
  methods: {
    getThumbnail(img) {
      try {
        return require(`~/assets/img/${img}`)
      } catch (err) {
        return null
      }
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
.container .prose code {
  font-size: 1.125em;
}
.banner-img {
  width: 100%;
  height: 0;
  padding-top: 60%;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
}
.banner-img img {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
