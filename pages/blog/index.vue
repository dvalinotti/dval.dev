<template>
  <div class="container mx-auto px-4 max-w-4xl">
    <h1 class="h-underline page-header dark:text-white">Latest Posts</h1>
    <ul class="flex-col-start w-full">
      <li v-for="(post, index) in posts" :key="index" class="pb-6 w-full">
        <nuxt-link :to="`/blog/${post.slug}`">
          <blog-post-card :post="post"></blog-post-card>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
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
    posts: undefined
  }),
  head() {
    return {
      title: 'Blog',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Latest blog posts from Dan Valinotti'
        }
      ]
    }
  }
}
</script>
