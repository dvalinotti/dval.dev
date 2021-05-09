<template>
  <div class="card dark:bg-gray-900">
    <div class="w-full h-full sm:w-1/3">
      <div class="card-img">
        <slot name="img"></slot>
      </div>
    </div>
    <div class="w-full h-full sm:w-2/3 sm:pl-2">
      <div class="card-text">
        <slot name="text"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  padding: 1rem;
  background: rgb(243, 244, 246);
  transition: background 0.25s ease-in-out;

  &:hover {
    cursor: pointer;
    background: #e5e5e5;

    .card-img img {
      transform: scale(1.1);
    }
  }
  .card-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 66%;
    overflow: hidden;

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.25s ease-in-out;
    }
  }
  .card-text {
    padding: 1rem 0.5rem 0.5rem;
    line-height: 1.125;
    @media screen and (min-width: 625px) {
      padding: 0.5rem;
    }
  }
  @media screen and (min-width: 625px) {
    display: flex;
  }
}
</style>
