<template>
  <button class="p-4 dark:text-white" @click="toggleTheme">
    <fa :icon="['far', isDark ? 'sun' : 'moon']" />
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
