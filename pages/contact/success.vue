<template>
  <main class="container mx-auto px-4 max-w-4xl">
    <div class="contact-page">
      <h1 class="h-underline page-header dark:text-white">Success!</h1>
      <p class="max-w-xs mb-4">
        Thanks for reaching out! I'll get back to you as soon as possible. 😁
      </p>
      <nuxt-link to="/" class="text-blue-700 underline">
        Back to home
      </nuxt-link>
    </div>
  </main>
</template>

<script>
export default {
  head() {
    return {
      title: 'Success',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Success - Dan Valinotti'
        }
      ]
    }
  }
}
</script>

<style scoped>
.contact-page {
  height: 100%;
  min-height: 85ch;
}
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
