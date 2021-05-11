<template>
  <button
    class="py-2 px-3 mr-2 text-white rounded-lg"
    :class="[...colorClasses[color]]"
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
      default: 'blue',
      validator: (value) => {
        return ['red', 'blue', 'green'].includes(value)
      }
    }
  },
  emits: ['click'],
  data: () => ({
    colorClasses: {
      blue: [
        `bg-blue-600`,
        `hover:bg-blue-500`,
        `dark:bg-blue-700`,
        `dark:hover:bg-blue-600`
      ],
      red: [
        `bg-red-600`,
        `hover:bg-red-500`,
        `dark:bg-red-700`,
        `dark:hover:bg-red-600`
      ],
      green: [
        `bg-green-600`,
        `hover:bg-green-500`,
        `dark:bg-green-700`,
        `dark:hover:bg-green-600`
      ]
    }
  }),
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>
