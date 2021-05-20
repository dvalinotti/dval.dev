<template>
  <button @click.prevent="$router.push(`/blog/tags/${text}`)">
    <div
      class="tag bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white"
    >
      {{ text }}
    </div>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.tag {
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  transition: all 200ms ease-in-out;
}
</style>
