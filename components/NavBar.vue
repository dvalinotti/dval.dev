<template>
  <nav>
    <vs-navbar v-model="activeTab" square fixed>
      <vs-navbar-item
        id="home"
        :active="activeTab === 'index'"
        @click="goToRoute('/')"
      >
        <nuxt-link to="/"> Home </nuxt-link>
      </vs-navbar-item>
      <vs-navbar-item
        id="blog"
        :active="activeTab.includes('blog')"
        @click="goToRoute('/blog')"
      >
        <nuxt-link to="/blog"> Blog </nuxt-link>
      </vs-navbar-item>
    </vs-navbar>
  </nav>
</template>

<script>
export default {
  data: () => ({
    activeTab: ''
  }),
  watch: {
    $route() {
      this.activeTab = this.$route.name
    }
  },
  mounted() {
    this.activeTab = this.$route.name
  },
  methods: {
    goToRoute(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style>
nav > div {
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.075);
}
.vs-navbar__line {
  background: #0087d6;
}
.vs-navbar .nuxt-link-exact-active {
  color: #0087d6;
}
</style>
