<template>
  <button
    class="py-2 px-3 mr-2 text-white rounded-lg"
    :class="`btn-theme-${color}`"
    @click="emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  color?: 'red' | 'blue' | 'green'
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<style lang="scss" scoped>
@use 'sass:color';

$colors: (
  theme-blue: $theme-blue,
  theme-red: $theme-red,
  theme-green: $theme-green
);

@each $color, $value in $colors {
  .btn-#{$color} {
    background-color: $value;
    &:hover {
      background-color: color.adjust($value, $lightness: 5%);
    }
  }
}
button {
  transition: background-color 200ms ease-in-out;
}
</style>
