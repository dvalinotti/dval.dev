<template>
  <card img-size="sqr">
    <template #img>
      <nuxt-picture
        :src="`/img/${project.image}`"
        format="webp"
        :alt="project.imageAlt"
        loading="lazy"
      />
    </template>
    <template #text>
      <h2 class="text-xl font-bold leading-5 mb-3 dark:text-white">
        {{ project.title }}
      </h2>
      <nuxt-content :document="project" class="mb-4 dark:text-gray-200" />
      <div class="flex items-center justify-start mb-2">
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          :aria-label="`${project.title} Github Repo`"
          rel="noopener"
        >
          <button-simple color="blue"> GitHub Repo </button-simple>
        </a>
        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          :aria-label="`${project.title} Live Site`"
          rel="noopener"
        >
          <button-simple color="green"> Live Site </button-simple>
        </a>
        <a
          v-if="project.npm"
          :href="project.npm"
          target="_blank"
          :aria-label="`${project.title} NPM page`"
          rel="noopener"
        >
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
  }
}
</script>
