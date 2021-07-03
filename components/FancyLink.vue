<template>
  <a
    v-if="isExternal"
    :href="to"
    :target="newTab ? '_blank' : ''"
    class="dark:text-white"
    :class="{ 'fancy-underline': underline }"
  >
    <slot />
  </a>
  <nuxt-link
    v-else
    :to="to"
    class="dark:text-white"
    :class="{ 'fancy-underline': underline }"
  >
    <slot />
  </nuxt-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    newTab: {
      type: Boolean,
      default: false
    },
    underline: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isExternal() {
      return this.to.includes('http') || this.to.includes('//')
    }
  }
}
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
