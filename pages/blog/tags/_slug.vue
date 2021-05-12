<template>
  <main class="container mx-auto px-4 max-w-4xl">
    <h1 class="h-underline dark:text-white capitalize">{{ tag }}</h1>
    <ul class="flex flex-col items-start justify-start w-full">
      <li v-for="(post, index) in posts" :key="index" class="pb-6 w-full">
        <nuxt-link :to="`/blog/${post.slug}`">
          <blog-post-card :post="post" />
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    try {
      const tag = params.slug
      const posts = await $content('blog')
        .where({ tags: { $contains: tag } })
        .fetch()
        .catch(() => {
          error({
            statusCode: 404,
            message: 'No posts found.'
          })
        })

      return {
        tag,
        posts
      }
    } catch (err) {
      error(err)
    }
  },
  data: () => ({
    posts: [],
    tag: ''
  }),
  head() {
    return {
      title: 'Blog - "' + this.tag + '"',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Latest blog posts from Dan Valinotti tagged "' + this.tag + '"'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}
</style>
