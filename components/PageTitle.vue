<template>
  <div class="relative inline-flex my-4">
    <h1 class="h-underline relative z-10 page-header dark:text-white">
      <slot></slot>
    </h1>
    <svg class="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#0078BF"
        d="M35.3,-63.6C40.8,-51.4,36.9,-33.2,37.3,-20.5C37.7,-7.8,42.3,-0.5,45,9.1C47.7,18.7,48.4,30.6,43.7,40.3C39.1,50,29.1,57.6,16.9,64.3C4.6,71,-9.8,76.9,-25.3,76.7C-40.8,76.5,-57.3,70.2,-63.8,57.9C-70.4,45.6,-67,27.4,-60,14.4C-53,1.3,-42.2,-6.5,-39.6,-20.5C-37,-34.4,-42.4,-54.4,-37.1,-66.8C-31.9,-79.2,-15.9,-84,-0.5,-83.2C14.9,-82.3,29.8,-75.9,35.3,-63.6Z"
        transform="translate(100 100)"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.blob {
  position: absolute;
  left: 0px;
  top: -85px;
  z-index: 0;
  transform: rotate(80deg) scaleX(1.35) scaleY(1.6) translateX(0);
  opacity: 0.5;
}
</style>
