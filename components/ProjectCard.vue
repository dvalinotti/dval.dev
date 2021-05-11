<template>
  <card img-size="sqr">
    <template #img>
      <img :src="getThumbnail(project.image)" :alt="project.imageAlt" />
    </template>
    <template #text>
      <h2 class="text-xl font-bold leading-5 mb-3 dark:text-white">
        {{ project.title }}
      </h2>
      <nuxt-content :document="project" class="mb-4 dark:text-gray-200" />
      <div class="flex items-center justify-start mb-2">
        <a v-if="project.github" :href="project.github" target="_blank">
          <button-simple color="blue"> GitHub Repo </button-simple>
        </a>
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank">
          <button-simple color="green"> Live Site </button-simple>
        </a>
        <a v-if="project.npm" :href="project.npm" target="_blank">
          <button-simple color="red">NPM</button-simple>
        </a>
      </div>
    </template>
  </card>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      default: () => ({})
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
