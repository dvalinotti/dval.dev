<template>
  <nav class="bg-white dark:bg-gray-900 dark:text-white relative">
    <ul class="mx-auto flex items-center justify-center py-4">
      <li v-for="(item, index) in items" :key="index">
        <nuxt-link
          :to="item.path"
          class="mx-2"
          :class="{ active: isActivePath(item.path) }"
        >
          {{ item.label }}
        </nuxt-link>
      </li>
    </ul>
    <theme-toggle class="absolute right-0 top-0" />
  </nav>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    activeTab: ''
  }),
  watch: {
    $route() {
      this.activeTab = this.$route.name
    }
  },
  mounted() {
    this.activeTab = this.$route.name
  },
  methods: {
    isActivePath(path) {
      const current = this.$route.path
      return path === '/' ? current === '/' : current.startsWith(path)
    }
  }
}
</script>

<style>
nav {
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.05);
}
nav a {
  font-family: 'Poppins';
  position: relative;
}
nav a.active {
  font-weight: bold;
}
nav a.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: #0087d6;
}
</style>
