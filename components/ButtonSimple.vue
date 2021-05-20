<template>
  <button
    class="py-2 px-3 mr-2 text-white rounded-lg"
    :class="`btn-theme-${color}`"
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
      blue: [`btn-blue`, `dark:bg-blue-700`, `dark:hover:bg-blue-600`],
      red: [
        `bg-red-600`,
        `hover:bg-red-500`,
        `dark:bg-red-700`,
        `dark:hover:bg-red-600`
      ],
      green: [
        `bg-green-700`,
        `hover:bg-green-600`,
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

<style lang="scss" scoped>
$colors: (
  theme-blue: $theme-blue,
  theme-red: $theme-red,
  theme-green: $theme-green
);

@each $color, $value in $colors {
  .btn-#{$color} {
    background-color: $value;
    &:hover {
      background-color: lighten($value, 5%);
    }
  }
}
button {
  transition: background-color 200ms ease-in-out;
}
</style>
