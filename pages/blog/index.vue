<template>
  <main id="blog" class="container mx-auto px-4">
    <h1>Latest Posts</h1>
    <ul class="flex flex-col items-start justify-start w-full max-w-3xl">
      <li v-for="(post, index) in posts" :key="index" class="pb-6 w-full">
        <nuxt-link :to="`/blog/${post.slug}`">
          <card type="3" class="w-full">
            <template #img>
              <img
                :src="getThumbnail(post.featuredImage)"
                :alt="post.featuredImageAlt"
              />
            </template>
            <template #text>
              <h2 class="text-lg font-bold leading-5 mb-1">{{ post.title }}</h2>
              <span class="text-sm text-gray-700 italic">
                {{ fmtDate(post.date) }} - {{ post.readingTime.text }}
              </span>
              <p class="text-base text-gray-700 mt-2">{{ post.subtitle }}</p>
            </template>
          </card>
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script>
import dateFormat from 'dateformat'

export default {
  async asyncData({ $content, error }) {
    try {
      const posts = await $content('blog')
        .sortBy('date', 'desc')
        .fetch()
        .catch(() => {
          error({
            statusCode: 404,
            message: 'Page not found.'
          })
        })
      return {
        posts
      }
    } catch (err) {
      error(err)
    }
  },
  data: () => ({
    posts: []
  }),
  methods: {
    getThumbnail(img) {
      try {
        return require(`~/assets/img/${img}`)
      } catch (err) {
        return null
      }
    },
    fmtDate(date) {
      return dateFormat(date, 'fullDate')
    }
  }
}
</script>

<style>
h1 {
  color: #111827;
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}
#blog .vs-card {
  min-width: 100%;
}
#blog .vs-card .vs-card__img {
  width: 100%;
  min-height: 240px;
}
@media screen and (min-width: 768px) {
  #blog .vs-card .vs-card__img {
    min-height: 100%;
    min-width: 240px;
  }
}
</style>
