<template>
  <nav class="bg-white dark:bg-gray-800 dark:text-white" :class="{ show }">
    <div class="w-full relative">
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
    </div>
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
    activeTab: '',
    scrollPosition: 0,
    show: true
  }),
  watch: {
    $route() {
      this.activeTab = this.$route.name
    }
  },
  mounted() {
    this.activeTab = this.$route.name
    window.addEventListener('scroll', this.onScroll)
    this.scrollPosition = window.scrollY
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    isActivePath(path) {
      const current = this.$route.path
      return path === '/' ? current === '/' : current.startsWith(path)
    },
    onScroll() {
      const position = window.scrollY
      if (position < this.scrollPosition && !this.show) {
        this.show = true
      } else if (position > this.scrollPosition && this.show) {
        this.show = false
      }
      this.scrollPosition = position
    }
  }
}
</script>

<style>
nav {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease-in-out;
  transform: translateY(-120%);
}
nav.show {
  transform: translateY(0);
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
