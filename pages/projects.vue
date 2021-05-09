<template>
  <main class="container mx-auto px-4 max-w-4xl">
    <div>
      <h1 class="h-underline dark:text-white">Projects</h1>
      <ul class="flex flex-col items-start justify-start w-full">
        <li
          v-for="(project, index) in projects"
          :key="index"
          class="pb-6 w-full"
        >
          <card img-size="sqr">
            <template #img>
              <img :src="getThumbnail(project.image)" :alt="project.imageAlt" />
            </template>
            <template #text>
              <h2 class="text-xl font-bold leading-5 mb-3 dark:text-white">
                {{ project.title }}
              </h2>
              <nuxt-content
                :document="project"
                class="mb-4 dark:text-gray-200"
              />
              <div class="flex items-center justify-start mb-2">
                <a v-if="project.github" :href="project.github" target="_blank">
                  <button-simple color="blue"> GitHub Repo </button-simple>
                </a>
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                >
                  <button-simple color="green"> Live Site </button-simple>
                </a>
                <a v-if="project.npm" :href="project.npm" target="_blank">
                  <button-simple color="red">NPM</button-simple>
                </a>
              </div>
            </template>
          </card>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, error }) {
    try {
      const projects = await $content('projects')
        .sortBy('position', 'asc')
        .fetch()
        .catch(() => {
          error({
            statusCode: 404,
            message: 'No projects found.'
          })
        })
      return {
        projects
      }
    } catch (err) {
      error(err)
    }
  },
  data: () => ({
    projects: []
  }),
  head() {
    return {
      title: 'Projects'
    }
  },
  methods: {
    getThumbnail(img) {
      try {
        return require(`~/assets/img/${img}`)
      } catch (err) {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}
</style>
