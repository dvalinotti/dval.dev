<template>
  <div class="new-card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.new-card {
  width: max-content;
  height: auto;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  transition: all 0.25s ease-in-out;

  &:hover {
    cursor: pointer;
    border-color: transparent;
    box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.125);
  }
}
</style>
