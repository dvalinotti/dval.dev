<template>
  <card img-size="sqr">
    <template #img>
      <nuxt-picture
        :src="`/img/${project.image}`"
        format="webp"
        :alt="project.imageAlt"
        loading="lazy"
        :imgAttrs="{ class: 'rounded-md' }"
      />
    </template>
    <template #text>
      <div class="flex items-center mb-1">
        <h2 class="text-xl font-bold leading-5 mb-0 dark:text-white">
          {{ project.title }}
        </h2>
        <span
          v-if="project.isBeta"
          class="bg-red-600 rounded-md text-white text-xs py-1 px-2 ml-2 font-bold"
        >
          BETA
        </span>
      </div>
      <p class="italic dark:text-white mb-3">{{ project.company }}</p>
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
          v-if="hasLiveUrl || hasReadMoreUrl"
          :href="urlButtonHref"
          target="_blank"
          :aria-label="`${project.title} ${urlButtonLabel}`"
          rel="noopener"
        >
          <button-simple color="green">
            {{ urlButtonLabel }}
          </button-simple>
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
  },
  computed: {
    hasLiveUrl() {
      return this.project.liveUrl
    },
    hasReadMoreUrl() {
      return this.project.readMoreUrl && !this.project.liveUrl
    },
    urlButtonLabel() {
      return this.hasLiveUrl ? 'Live Site' : 'Read More'
    },
    urlButtonHref() {
      return this.hasLiveUrl ? this.project.liveUrl : this.project.readMoreUrl
    }
  }
}
</script>
