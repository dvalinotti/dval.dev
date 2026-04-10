<template>
  <Card img-size="sqr">
    <template #img>
      <NuxtPicture
        :src="`/img/${project.image}`"
        format="webp"
        :alt="project.imageAlt"
        loading="lazy"
        :img-attrs="{ class: 'rounded-md' }"
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
      <ContentRenderer :value="project" class="mb-4 dark:text-gray-200" />
      <div class="flex items-center justify-start mb-2">
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          :aria-label="`${project.title} Github Repo`"
          rel="noopener"
        >
          <ButtonSimple color="blue"> GitHub Repo </ButtonSimple>
        </a>
        <a
          v-if="hasLiveUrl || hasReadMoreUrl"
          :href="urlButtonHref"
          target="_blank"
          :aria-label="`${project.title} ${urlButtonLabel}`"
          rel="noopener"
        >
          <ButtonSimple color="green">
            {{ urlButtonLabel }}
          </ButtonSimple>
        </a>
        <a
          v-if="project.npm"
          :href="project.npm"
          target="_blank"
          :aria-label="`${project.title} NPM page`"
          rel="noopener"
        >
          <ButtonSimple color="red">NPM</ButtonSimple>
        </a>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: Record<string, any>
}>()

const hasLiveUrl = computed(() => props.project.liveUrl)
const hasReadMoreUrl = computed(() => props.project.readMoreUrl && !props.project.liveUrl)
const urlButtonLabel = computed(() => hasLiveUrl.value ? 'Live Site' : 'Read More')
const urlButtonHref = computed(() => hasLiveUrl.value ? props.project.liveUrl : props.project.readMoreUrl)
</script>
