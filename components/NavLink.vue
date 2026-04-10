<template>
  <NuxtLink
    :to="to"
    class="nav-link dark:text-white"
    :class="{ active: isActive }">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
}>()

const route = useRoute()

const isActive = computed(() => {
  const current = route.path
  return props.to === '/' ? current === '/' : current.startsWith(props.to)
})
</script>

<style lang="scss" scoped>
a.nav-link {
  font-family: 'Poppins';
  position: relative;
  &.active {
    font-weight: bold;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      height: 2px;
      width: 100%;
      background: $theme-blue;
    }
  }
}
</style>
