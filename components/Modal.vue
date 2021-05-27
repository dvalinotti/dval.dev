<template>
  <transition name="fade">
    <div v-show="show" class="modal">
      <div
        v-click-outside="onClickOutside"
        class="modal-window bg-white dark:bg-gray-800"
      >
        <button
          class="modal-close-btn hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close modal"
          @click="onClose"
        >
          <fa :icon="['fal', 'times']" class="fa-2x dark:text-white"></fa>
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import vClickOutside from 'v-click-outside'

export default {
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    show: {
      type: Boolean,
      default: true // false
    }
  },
  emits: ['close'],
  methods: {
    onClose() {
      this.$emit('close')
    },
    onClickOutside(e) {
      if (this.show) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-window {
    width: 100%;
    height: 100%;
    max-width: 500px;
    max-height: 500px;
    margin: 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .modal-close-btn {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.5rem 0.9rem;
      margin: 0.5rem;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background-color 200ms ease-in-out;
    }
  }
}
</style>
