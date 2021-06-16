<template>
  <main class="bg-white dark:bg-gray-900 overflow-y-hidden">
    <NavMenu :show="showMenu" :items="navItems" @close="toggleShowMenu" />
    <NavBar :items="navItems" @show-menu="toggleShowMenu" />
    <div class="page">
      <Nuxt />
    </div>
    <Footer :items="navItems" />
    <Modal :show="showModal" @close="toggleShowModal">
      <div class="flex flex-col justify-center items-center">
        <door-button />
        <p class="poppins text-2xl font-bold mt-4 dark:text-white">
          The door beckons.
        </p>
      </div>
    </Modal>
  </main>
</template>

<script>
import * as koco from 'ko-co'

export default {
  data: () => ({
    navItems: [
      {
        label: 'Home',
        path: '/'
      },
      {
        label: 'Blog',
        path: '/blog'
      },
      {
        label: 'Projects',
        path: '/projects'
      },
      {
        label: 'Experience',
        path: '/experience'
      },
      {
        label: 'Contact',
        path: '/contact'
      }
    ],
    showMenu: false,
    showModal: false
  }),
  mounted() {
    koco.addSupportForTheKonamiCode()
    window.addEventListener('konamicode', this.toggleShowModal)
  },
  beforeDestroy() {
    window.removeEventListener('konamicode', this.toggleShowModal)
  },
  methods: {
    toggleShowMenu() {
      this.showMenu = !this.showMenu
    },
    toggleShowModal() {
      this.showModal = !this.showModal
    }
  }
}
</script>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.page {
  padding-top: 90px;
}
</style>
