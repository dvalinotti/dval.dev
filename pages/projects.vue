<template>
  <div class="container mx-auto px-4 max-w-4xl">
    <div>
      <h1 class="h-underline page-header dark:text-white">Projects</h1>
      <section id="professional">
        <h2 class="text-2xl font-bold mb-3 dark:text-white">Professional</h2>
        <ul class="flex-col-start w-full">
          <li
            v-for="(project, index) in filterProjects('professional')"
            :key="index"
            class="pb-6 w-full"
          >
            <ProjectCard :project="project" />
          </li>
        </ul>
      </section>
      <section id="personal">
        <h2 class="text-2xl font-bold mb-3 dark:text-white">Personal</h2>
        <ul class="flex-col-start w-full">
          <li
            v-for="(project, index) in filterProjects('personal')"
            :key="index"
            class="pb-6 w-full"
          >
            <ProjectCard :project="project" />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').order('position', 'ASC').all()
)

function filterProjects(tag: string) {
  return (projects.value || []).filter((project: any) => project.tag === tag)
}

useHead({
  title: 'Projects',
  meta: [
    {
      name: 'description',
      content: 'Latest professional and personal projects from Dan Valinotti',
    },
  ],
})
</script>

<style lang="scss" scoped>
h1 {
}
</style>
