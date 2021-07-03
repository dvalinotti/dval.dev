<template>
  <footer class="w-full pt-8 pb-8 mt-16 dark:bg-gray-800 dark:text-white">
    <div class="flex flex-col items-center justify-center">
      <ul
        class="w-full max-w-md mx-auto flex flex-wrap items-center justify-center px-8"
      >
        <li v-for="(item, index) in items" :key="index" class="mx-2 mb-1">
          <fancy-link :to="item.path">
            {{ item.label }}
          </fancy-link>
        </li>
      </ul>
      <ul class="w-full max-w-md mx-auto mt-4 flex items-center justify-center">
        <li v-for="(link, index) in socialLinks" :key="index" class="mx-2">
          <fancy-link
            :to="link.path"
            :new-tab="true"
            :underline="false"
            :aria-label="link.label"
            rel="noopener"
          >
            <fa :icon="[link.iconPrefix, link.icon]" class="fa-lg" />
          </fancy-link>
        </li>
      </ul>
      <span class="text-xs text-gray-700 dark:text-gray-200 mt-4">
        © 2021 Dan Valinotti. All Rights Reserved.
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    socialLinks: [
      {
        icon: 'envelope',
        iconPrefix: 'far',
        path: 'mailto:dvalinotti@icloud.com',
        label: 'Email'
      },
      {
        icon: 'github',
        iconPrefix: 'fab',
        path: 'https://github.com/dvalinotti',
        label: 'Github'
      },
      {
        icon: 'twitter',
        iconPrefix: 'fab',
        path: 'https://twitter.com/dan_valinotti',
        label: 'Twitter'
      },
      {
        icon: 'linkedin',
        iconPrefix: 'fab',
        path: 'https://www.linkedin.com/in/daniel-valinotti/',
        label: 'LinkedIn'
      },
      {
        icon: 'hackerrank',
        iconPrefix: 'fab',
        path: 'https://www.hackerrank.com/dvalinotti',
        label: 'HackerRank'
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
footer {
  box-shadow: 0px -5px 5px 5px rgba(0, 0, 0, 0.05);
}
footer a.nuxt-link {
  position: relative;
  font-family: 'Poppins';
  transition: color 0.25s ease-in-out;
}
footer a.nuxt-link:hover {
  color: $theme-blue;
}
footer a.nuxt-link:hover::after {
  background: $theme-blue;
  bottom: -3px;
}
html.dark footer a.nuxt-link:hover::after {
  background: $theme-blue;
}
footer a.nuxt-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: black;
  transition: bottom 0.25s ease-in-out, background 0.25s ease-in-out;
}
html.dark footer a.nuxt-link::after {
  background: white;
}
</style>
