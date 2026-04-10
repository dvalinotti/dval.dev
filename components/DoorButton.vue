<template>
  <a
    href="https://youtu.be/dQw4w9WgXcQ"
    rel="noreferrer"
    target="_blank"
    class="modal-close-btn"
    aria-label="The Door"
    @mouseover="open = true"
    @mouseout="open = false"
  >
    <Fa :icon="['fad', open ? 'door-open' : 'door-closed']" class="door" />
  </a>
</template>

<script setup lang="ts">
const open = ref(false)
</script>

<style lang="scss" scoped>
.door {
  color: #9e5d3e;
  font-size: 10rem;
}
</style>
