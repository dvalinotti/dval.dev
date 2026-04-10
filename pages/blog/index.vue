<template>
  <div class="container mx-auto px-4 max-w-4xl">
    <h1 class="h-underline page-header dark:text-white">Latest Posts</h1>
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
const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

useHead({
  title: 'Blog',
  meta: [
    {
      name: 'description',
      content: 'Latest blog posts from Dan Valinotti',
    },
  ],
})
</script>
