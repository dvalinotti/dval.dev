<template>
  <button
    class="p-4 dark:text-white"
    aria-label="Toggle theme"
    @click="toggleTheme"
  >
    <Fa :icon="['fal', isDark ? 'sun' : 'moon-stars']" class="theme-icon" />
  </button>
</template>

<script setup lang="ts">
const isDark = ref(false)

function toggleTheme() {
  const next = document.documentElement.classList.contains('dark')
    ? 'light'
    : 'dark'
  const current = next === 'dark' ? 'light' : 'dark'
  document.documentElement.classList.remove(current)
  document.documentElement.classList.add(next)
  localStorage.theme = next
  isDark.value = next === 'dark'
}

onMounted(() => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
    isDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<style>
svg.theme-icon {
  font-size: 2em;
}
@media screen and (min-width: 600px) {
  svg.theme-icon {
    font-size: 1.5em;
  }
}
</style>
