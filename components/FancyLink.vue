<template>
  <a
    v-if="isExternal"
    :href="to"
    :target="newTab ? '_blank' : undefined"
    class="dark:text-white"
    :class="{ 'fancy-underline': underline }"
  >
    <slot />
  </a>
  <NuxtLink
    v-else
    :to="to"
    class="dark:text-white"
    :class="{ 'fancy-underline': underline }"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  to: string
  newTab?: boolean
  underline?: boolean
}>(), {
  newTab: false,
  underline: true,
})

const isExternal = computed(() => {
  return props.to.includes('http') || props.to.includes('//')
})
</script>

<style lang="scss" scoped>
a {
  position: relative;
  font-family: 'Poppins';
  transition: color 0.25s ease-in-out;
}
a:hover {
  color: $theme-blue;
}
a.fancy-underline:hover::after {
  background: $theme-blue;
  bottom: -3px;
}
html.dark a.fancy-underline:hover::after {
  background: $theme-blue;
}
a.fancy-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: black;
  transition: bottom 0.25s ease-in-out, background 0.25s ease-in-out;
}
html.dark a.fancy-underline::after {
  background: white;
}
</style>
