<template>
  <button
    class="p-4 dark:text-white"
    aria-label="Toggle theme"
    @click="toggleTheme"
  >
    <fa :icon="['fal', isDark ? 'sun' : 'moon-stars']" class="theme-icon" />
  </button>
</template>

<script>
export default {
  data: () => ({
    isDark: false
  }),
  mounted() {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      this.isDark = true
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  methods: {
    toggleTheme() {
      const next = document.documentElement.classList.contains('dark')
        ? 'light'
        : 'dark'
      const current = next === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.remove(current)
      document.documentElement.classList.add(next)
      localStorage.theme = next
      this.isDark = next === 'dark'
    }
  }
}
</script>

<style>
svg.theme-icon {
  font-size: 2em;
}
@media screen and (min-width: 500px) {
  svg.theme-icon {
    font-size: 1.5em;
  }
}
</style>
