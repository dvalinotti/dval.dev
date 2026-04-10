<template>
  <div class="container mx-auto px-4 max-w-4xl">
    <h1 class="h-underline dark:text-white capitalize">{{ tag }}</h1>
    <ul class="flex-col-start w-full">
      <li v-for="(post, index) in posts" :key="index" class="pb-6 w-full">
        <NuxtLink :to="post.path">
          <BlogPostCard :post="post" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tag = route.params.slug as string

const { data: posts } = await useAsyncData(`blog-tag-${tag}`, () =>
  queryCollection('blog').where('tags', 'LIKE', `%${tag}%`).order('date', 'DESC').all()
)

useHead({
  title: `Blog - "${tag}"`,
  meta: [
    {
      name: 'description',
      content: `Latest blog posts from Dan Valinotti tagged "${tag}"`,
    },
  ],
})
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
