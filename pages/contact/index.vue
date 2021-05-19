<template>
  <main class="container mx-auto px-4 max-w-4xl">
    <div class="contact-page">
      <h1 class="h-underline page-header dark:text-white">Contact Me</h1>
      <p class="mt-8 mb-4 max-w-lg dark:text-white">
        If you'd like to get in touch with me, you can fill out this form with
        your information and I will get back to you as soon as I can!
      </p>
      <contact-form />
      <p class="mt-8 mb-4 max-w-md dark:text-white">
        Alternatively, you can contact me through any of the following links:
      </p>
      <ul class="mt-4">
        <li
          v-for="(link, index) in links"
          :key="index"
          class="dark:text-white flex items-center justify-start my-2"
        >
          <fa :icon="[link.iconPrefix, link.icon]" class="fa-2x" />
          <a
            :href="link.value"
            target="_blank"
            class="ml-4 my-2"
            rel="noopener"
          >
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
  }),
  head() {
    return {
      title: 'Contact Me',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'How to get in contact with me - Dan Valinotti'
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
