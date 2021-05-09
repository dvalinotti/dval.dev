<template>
  <footer class="w-full pt-4 pb-8 dark:bg-gray-900 dark:text-white">
    <ul class="w-full max-w-md mx-auto flex items-center justify-center">
      <li v-for="(item, index) in items" :key="index" class="mx-2">
        <nuxt-link :to="item.path"> {{ item.label }} </nuxt-link>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
footer a {
  position: relative;
  font-family: 'Poppins';
  transition: color 0.25s ease-in-out;
}
footer a:hover {
  color: #0087d6;
}
footer a:hover::after {
  background: #0087d6;
  bottom: -3px;
}
footer a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: black;
  transition: bottom 0.25s ease-in-out;
}
html.dark footer a::after {
  background: white;
}
</style>
