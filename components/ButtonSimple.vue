<template>
  <button
    class="py-2 px-3 mr-2 text-white rounded-lg"
    :class="`bg-${color}-600 hover:bg-${color}-500 dark:bg-${color}-700 dark:hover:bg-${color}-600`"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'blue'
    }
  },
  emits: ['click'],
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>
