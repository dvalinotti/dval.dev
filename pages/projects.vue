<template>
  <main class="container mx-auto px-4 max-w-4xl">
    <div>
      <h1 class="h-underline dark:text-white">Projects</h1>
      <section id="professional">
        <h2 class="text-2xl font-bold mb-3 dark:text-white">Professional</h2>
        <ul class="flex flex-col items-start justify-start w-full">
          <li
            v-for="(project, index) in filterProjects('professional')"
            :key="index"
            class="pb-6 w-full"
          >
            <project-card :project="project" />
          </li>
        </ul>
      </section>
      <section id="personal">
        <h2 class="text-2xl font-bold mb-3 dark:text-white">Personal</h2>
        <ul class="flex flex-col items-start justify-start w-full">
          <li
            v-for="(project, index) in filterProjects('personal')"
            :key="index"
            class="pb-6 w-full"
          >
            <project-card :project="project" />
          </li>
        </ul>
      </section>
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
      title: 'Projects',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Latest professional and personal projects from Dan Valinotti'
        }
      ]
    }
  },
  methods: {
    filterProjects(tag) {
      return this.projects.filter((project) => project.tag === tag)
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
