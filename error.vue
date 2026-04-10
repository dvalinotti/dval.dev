<template>
  <NuxtLayout>
    <div class="error-page container mx-auto px-4 md:px-8">
      <div class="dark:text-white">
        <p v-if="notFound" class="error-code">{{ error?.statusCode }}</p>
        <h1 class="h-underline text-4xl font-bold">
          {{ notFound ? 'Page not found.' : 'Uh oh!' }}
        </h1>
        <p class="py-4 max-w-sm">
          {{
            notFound
              ? "Looks like the page you're looking for doesn't exist."
              : 'Something went wrong.'
          }}
          <NuxtLink to="/" class="link" aria-label="Back to homepage"
            >Click here</NuxtLink
          >
          to go back to the homepage, or if you'd like to report the problem,
          visit the
          <NuxtLink to="/contact" class="link">contact page</NuxtLink>
          to reach out to me.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const notFound = computed(() => props.error?.statusCode === 404)

useHead({
  title: notFound.value ? 'Not found' : 'Error',
  meta: [
    {
      name: 'description',
      content: notFound.value
        ? "The page you were looking for doesn't exist"
        : 'An error has occurred.',
    },
  ],
})
</script>

<style lang="scss" scoped>
.error-page {
  height: 100%;
  min-height: 100ch;
}
.error-code {
  font-size: 6rem;
  font-weight: bold;
  line-height: 1.25;
}
</style>
