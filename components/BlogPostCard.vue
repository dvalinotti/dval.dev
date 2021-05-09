<template>
  <card type="3" class="w-full relative">
    <template #img>
      <img
        :src="getThumbnail(post.featuredImage)"
        :alt="post.featuredImageAlt"
      />
    </template>
    <template #text>
      <h2 class="text-lg font-bold leading-5 mb-1 dark:text-white">
        {{ post.title }}
      </h2>
      <span class="text-sm text-gray-700 italic dark:text-gray-200">
        {{ fmtDate(post.date) }} - {{ post.readingTime.text }}
      </span>
      <p class="text-base text-gray-700 mt-2 dark:text-gray-200 mb-8 md:mb-4">
        {{ post.subtitle }}
      </p>
      <ul
        class="flex items-center justify-start absolute right-0 bottom-0 mx-2 my-3"
      >
        <li v-for="(tag, i) in post.tags" :key="i" class="ml-2">
          <tag :text="tag" />
        </li>
      </ul>
    </template>
  </card>
</template>

<script>
import dateFormat from 'dateformat'

export default {
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },
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
