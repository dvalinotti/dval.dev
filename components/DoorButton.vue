<template>
  <a
    href="https://youtu.be/dQw4w9WgXcQ"
    rel="noreferrer"
    target="_blank"
    class="modal-close-btn"
    aria-label="The Door"
    @mouseover="openDoor"
    @mouseout="closeDoor"
  >
    <fa :icon="['fad', open ? 'door-open' : 'door-closed']" class="door"></fa>
  </a>
</template>

<script>
export default {
  data: () => ({ open: false }),
  methods: {
    openDoor() {
      this.open = true
    },
    closeDoor() {
      this.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
.door {
  color: #9e5d3e;
  font-size: 10rem;
}
</style>
