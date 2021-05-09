<template>
  <button @click.prevent="$router.push(`/blog/tags/${text}`)">
    <div class="rounded-2xl px-3 py-1 bg-gray-200">
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
