<template>
  <nuxt-link
    :to="to"
    class="nav-link dark:text-white"
    :class="{ active: isActive }"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive() {
      const current = this.$route.path
      return this.to === '/' ? current === '/' : current.startsWith(this.to)
    }
  }
}
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
      background: #0087d6;
    }
  }
}
</style>
