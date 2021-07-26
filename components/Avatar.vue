<template>
  <div class="relative">
    <div class="me-container">
      <nuxt-picture
        src="/img/me.jpg"
        format="webp"
        alt="A great picture of me!"
        class="me"
        width="265px"
      />
    </div>
    <svg
      class="me-blob"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#0078BF"
        d="M46.8,-60.7C60.8,-54.4,72.1,-40.7,77.2,-25.1C82.4,-9.4,81.4,8.4,76,24.6C70.6,40.9,60.9,55.7,47.5,66.9C34.1,78.1,17.1,85.7,2.5,82.3C-12.1,78.9,-24.2,64.4,-38.1,53.4C-51.9,42.3,-67.5,34.7,-76.4,21.5C-85.2,8.3,-87.2,-10.3,-78.1,-21.3C-68.9,-32.3,-48.6,-35.6,-33.7,-41.6C-18.8,-47.5,-9.4,-56.2,3.5,-61.1C16.5,-65.9,32.9,-67,46.8,-60.7Z"
        transform="translate(100 100)"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.me-container {
  width: 265px;
  height: 265px;
  margin: auto;
  border-radius: 100%;
  overflow: hidden;
  border: 8px solid white;
  position: relative;
  z-index: 1;
  transition: all 200ms ease-in-out;
  transition-delay: 550ms;
  animation-delay: 0ms;
  animation-duration: 750ms;

  &:hover {
    cursor: pointer;
    animation-name: example;
  }

  img.me {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
}

.me-blob {
  position: absolute;
  z-index: 0;
  inset: 0;
  transform: scale(2.3) translate(-10px, -10px);
  opacity: 0.5;
}

@keyframes example {
  0% {
    transform: rotate(0deg) scale(1);
    transition-delay: 0ms;
  }
  40% {
    transform: rotate(5deg) scale(1.025);
    box-shadow: 0px 3px 8px 2px rgba(0, 0, 0, 0.25);
  }
  55% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(0deg);
    transition-delay: 0ms;
  }
}
</style>
