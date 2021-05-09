<template>
  <main class="container mx-auto px-4">
    <div>
      <h1 class="h-underline font-bold text-4xl dark:text-white">Contact Me</h1>
      <ul class="mt-4">
        <li
          v-for="(link, index) in links"
          :key="index"
          class="dark:text-white flex items-center justify-start my-4"
        >
          <fa :icon="[link.iconPrefix, link.icon]" class="fa-2x" />
          <a :href="link.value" target="_blank" class="ml-4">
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  data: () => ({
    links: [
      {
        icon: 'envelope',
        iconPrefix: 'far',
        value: 'mailto:dvalinotti@icloud.com',
        label: 'Email'
      },
      {
        icon: 'github',
        iconPrefix: 'fab',
        value: 'https://github.com/dvalinotti',
        label: 'Github'
      },
      {
        icon: 'linkedin',
        iconPrefix: 'fab',
        value: 'https://www.linkedin.com/in/daniel-valinotti/',
        label: 'LinkedIn'
      },
      {
        icon: 'hackerrank',
        iconPrefix: 'fab',
        value: 'https://www.hackerrank.com/dvalinotti',
        label: 'HackerRank'
      }
    ]
  })
}
</script>

<style scoped>
li a {
  position: relative;
}
li a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: black;
  transition: bottom 0.25s ease-in-out, background 0.25s ease-in-out;
}
html.dark li a::after {
  background: white;
}
</style>
