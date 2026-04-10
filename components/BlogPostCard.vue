<template>
  <Card type="3" class="w-full relative">
    <template #img>
      <NuxtPicture
        :src="`/img/${post.featuredImage}`"
        format="webp"
        :alt="post.featuredImageAlt"
        loading="lazy"
      />
    </template>
    <template #text>
      <h2 class="text-lg font-bold leading-5 mb-1 dark:text-white">
        {{ post.title }}
      </h2>
      <span class="text-sm text-gray-700 italic dark:text-gray-200">
        {{ fmtDate(post.date) }} - {{ readingTimeText }}
      </span>
      <p class="text-base text-gray-700 mt-2 dark:text-gray-200 mb-8 md:mb-4">
        {{ post.subtitle }}
      </p>
      <ul
        class="flex items-center justify-start absolute right-0 bottom-0 mx-2 my-3"
      >
        <li v-for="(tag, i) in post.tags" :key="i" class="ml-2">
          <Tag :text="tag" />
        </li>
      </ul>
    </template>
  </Card>
</template>

<script setup lang="ts">
import dateFormat from 'dateformat'

const props = defineProps<{
  post: Record<string, unknown>
}>()

function extractPlainText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(extractPlainText).filter(Boolean).join(' ')
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(extractPlainText)
      .filter(Boolean)
      .join(' ')
  }

  return ''
}

const readingTimeText = computed(() => {
  if (props.post?.body) {
    const plainText = extractPlainText(props.post.body).trim()

    if (plainText) {
      const words = plainText.split(/\s+/).length
      const minutes = Math.max(1, Math.round(words / 200))
      return `${minutes} min read`
    }
  }

  return ''
})

function fmtDate(date: string) {
  return dateFormat(date, 'fullDate')
}
</script>
