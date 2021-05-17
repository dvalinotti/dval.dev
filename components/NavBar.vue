<template>
  <nav
    class="navbar bg-white dark:bg-gray-800 dark:text-white"
    title="Navigation Bar"
    :class="{ show }"
  >
    <div class="w-full relative flex">
      <button
        class="menu-btn absolute left-0 top-0"
        aria-label="Open navigation menu"
        @click="onClickShowMenu"
      >
        <fa :icon="['fal', 'bars']" class="fa-2x" />
      </button>
      <div class="home-link">
        <nuxt-link to="/"> DVal </nuxt-link>
      </div>
      <ul class="nav-links mx-auto flex items-center justify-center py-4">
        <li v-for="(item, index) in items" :key="index">
          <nav-link :to="item.path" class="mx-2">
            {{ item.label }}
          </nav-link>
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
  emits: ['show-menu'],
  data: () => ({
    activeTab: '',
    scrollPosition: 0,
    lastCheckpoint: 0,
    direction: 'DOWN',
    show: true,
    showMenu: false
  }),
  watch: {
    // Update active tab link on route change
    $route() {
      this.activeTab = this.$route.name
    },
    // Update lastCheckpoint when user changes scroll direction
    direction() {
      this.lastCheckpoint = this.scrollPosition
    }
  },
  mounted() {
    this.activeTab = this.$route.name

    // Init scroll watching for hide/show navbar
    window.addEventListener('scroll', this.onScroll)
    this.scrollPosition = window.scrollY
    this.lastCheckpoint = window.scrollY
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    // Scroll event handler - control direction, scrollPosition, and show
    onScroll() {
      // Update direction and scroll position
      const currentPosition = window.scrollY
      this.direction = this.getScrollDirection(currentPosition)
      this.scrollPosition = currentPosition
      if (currentPosition === 0) {
        this.show = true
      } else {
        // If user scrolling up and has scrolled 50px
        if (
          this.direction === 'UP' &&
          this.lastCheckpoint - this.scrollPosition >= 50
        ) {
          this.show = true
        }
        // If user is scrolling down and has scrolled 50px
        if (
          this.direction === 'DOWN' &&
          this.scrollPosition - this.lastCheckpoint >= 50
        ) {
          this.show = false
        }
      }
    },
    getScrollDirection(current) {
      return current < this.scrollPosition ? 'UP' : 'DOWN'
    },
    onClickShowMenu() {
      this.$emit('show-menu')
    }
  }
}
</script>

<style lang="scss" scoped>
nav.navbar {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease-in-out;
  transform: translateY(-120%);

  &.show {
    transform: translateY(0);
  }
  .nav-links {
    display: none;
    @media screen and (min-width: 500px) {
      display: flex;
    }
  }
  .menu-btn {
    padding: 1em;
    @media screen and (min-width: 500px) {
      display: none;
    }
  }
  .home-link {
    padding: 1em;
    margin: 0 auto;
    a {
      font-weight: bold;
      font-size: 1em;
      font-style: italic;
      padding: 0 0.75em;
      font-family: 'RockSalt';
      background: #0087d6;
      color: white;
    }
    @media screen and (min-width: 500px) {
      position: absolute;
      left: 0;
      top: 0;
      a {
        font-size: 1.125em;
      }
    }
  }
}
</style>
