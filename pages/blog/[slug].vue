<template>
  <div class="container mx-auto px-4 md:px-8 max-w-4xl">
    <article v-if="doc" class="prose text-left dark:text-white">
      <h1>{{ doc.title }}</h1>
      <span class="text-gray-900 text-sm dark:text-white">
        by
        <strong>Dan Valinotti</strong>
      </span>
      |
      <span class="text-gray-700 text-sm dark:text-gray-200">
        {{ publishDate }} - {{ readingTimeText }}
      </span>
      <div class="banner-img">
        <NuxtPicture
          :src="`/img/${doc.featuredImage}`"
          format="webp"
          class="absolute top-0 left-0 w-full h-full object-cover object-center"
          :alt="doc.featuredImageAlt" />
      </div>
      <ContentRenderer :value="doc" />
    </article>
    <div v-if="doc" class="flex items-center mt-16 dark:text-white">
      <span class="italic font-bold mr-4">Tags:</span>
      <ul class="flex items-center">
        <li v-for="(tag, index) in doc.tags" :key="index">
          <NuxtLink
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg px-3 py-2 mr-2"
            :to="`/blog/tags/${tag}`">
            #{{ tag }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import dateFormat from 'dateformat'

const route = useRoute()
const slug = route.params.slug as string

const { data: doc } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first()
)

const readingTimeText = computed(() => {
  if (doc.value?.body) {
    const words = JSON.stringify(doc.value.body).split(/\s+/).length
    const minutes = Math.max(1, Math.round(words / 200))
    return `${minutes} min read`
  }
  return ''
})

if (!doc.value) {
  throw createError({ statusCode: 404, message: 'Page not found.' })
}

const publishDate = computed(() => {
  return doc.value?.date ? dateFormat(new Date(doc.value.date), 'fullDate') : ''
})

useHead({
  title: doc.value?.title || '',
  meta: [
    {
      name: 'description',
      content: doc.value?.subtitle || ''
    },
    {
      name: 'keywords',
      content: doc.value?.keywords || ''
    }
  ]
})

onMounted(() => {
  const preEls = document.querySelectorAll('pre.line-numbers')
  preEls.forEach((el) => {
    el.setAttribute('tabindex', '0')
  })
})
</script>

<style>
@import '~/assets/css/blog-dark.css';

.container .prose {
  max-width: 80ch;
}
.container .prose h1 {
  margin-bottom: 0.5rem;
}
.container .prose ul {
  list-style: circle;
}
.container .prose ul > li {
  padding-left: 0;
  margin-left: 1.5em;
  padding-left: 0.5em;
}
.container .prose ul > li::before,
.container .prose ul > li::after {
  content: none;
}
.container .prose p > code,
.container .prose li > code {
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
  background: rgba(235, 235, 235);
  color: black;
}
.container .prose pre code {
  font-size: initial;
  padding: 0;
  background: transparent;
}
.container .prose code::before,
.container .prose code::after {
  content: none;
}
.container .prose .nuxt-content-highlight {
  position: relative;
  margin-top: 3em;
  z-index: 0;
}
.container .prose .nuxt-content-highlight > pre {
  border-radius: 0 0 0.5em 0.5em;
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.125);
  position: relative;
  overflow-y: visible;
}
.container .prose .nuxt-content-highlight > span.filename {
  position: absolute;
  top: -2.5em;
  left: 0;
  z-index: -1;
  background: rgb(51, 61, 75);
  color: white;
  font-size: 0.875em;
  width: 100%;
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: 0.5em;
  padding-bottom: 1em;
  border-radius: 0.5em;
}
.container .prose img {
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.125);
  border-radius: 4px;
}
.banner-img {
  width: 100%;
  height: 0;
  padding-top: 60%;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
}
.container .banner-img img {
  margin-top: 0;
  margin-bottom: 0;
  box-shadow: none;
  border-radius: 0;
}
</style>
