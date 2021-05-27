<template>
  <transition name="slide">
    <nav
      v-show="show"
      class="nav-menu bg-white dark:bg-gray-900"
      title="Mobile Navigation Menu"
    >
      <div class="flex-col-start h-full">
        <button
          class="p-4 dark:text-white"
          aria-label="Close navigation menu"
          @click="onClickClose"
        >
          <fa :icon="['fal', 'times']" class="fa-2x" />
        </button>
        <ul class="flex-col-start px-4">
          <li
            v-for="(item, index) in items"
            :key="index"
            class="my-2"
            @click="onClickClose"
          >
            <nav-link :to="item.path" class="text-4xl" :aria-label="item.label">
              {{ item.label }}
            </nav-link>
          </li>
        </ul>
        <button
          class="mt-auto mx-auto mb-4 p-4 dark:text-white"
          aria-label="Close navigation menu"
          @click="onClickClose"
        >
          <span class="text-xl font-bold underline">Close</span>
        </button>
      </div>
    </nav>
  </transition>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  watch: {
    show(value) {
      document.body.style.overflowY = value ? 'hidden' : 'auto'
    }
  },
  methods: {
    onClickClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-menu {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
