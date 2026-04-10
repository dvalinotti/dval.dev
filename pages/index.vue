<template>
  <div class="container mx-auto px-4 md:px-8">
    <div class="dark:text-white">
      <div
        class="w-full max-w-4xl mx-auto flex flex-col-reverse md:flex-row justify-center items-center">
        <div class="lg:pr-4 relative z-10">
          <span class="text-lg italic leading-3">Hi, my name is</span>
          <h1 class="h-underline font-bold">Dan Valinotti.</h1>
          <p class="p-4 bg-gray-100 max-w-sm dark:bg-gray-700 bg-opacity-80">
            I am a Full-Stack Software Engineer with a passion for building
            clean, performant, and accessible websites and applications.
            Adaptable, design oriented, and user-focused applications are my
            specialty, along with strong architecture and solutions skills.
          </p>
        </div>
        <div
          class="flex items-center justify-center p-6 md:p-0 md:pl-16 lg:pl-24">
          <Avatar />
        </div>
      </div>
      <div class="section">
        <span class="text-lg italic leading-3">My Guiding</span>
        <h2 class="text-6xl h-underline font-bold">Principles.</h2>
        <div class="w-full flex-col-start justify-start">
          <div class="flex items-start justify-start my-4">
            <Fa
              :icon="['fal', 'rabbit-fast']"
              class="fa-3x mr-4 md:mr-6"
              style="font-size: 2.75em" />
            <div class="inline">
              <h3 class="text-3xl font-bold mt-2 md:mt-0">Performance</h3>
              <p class="sidebar">
                Nothing is better than a beautiful site that doesn't make you
                wait. Performance is one of my top priorities when doing any
                kind of software development, and this website is a testament to
                that. The website is built with Nuxt.js, which allows me to
                write clean, maintainable source code that is
                <strong>statically-generated</strong>
                for optimal page load times.
              </p>
            </div>
          </div>
          <div class="flex items-start justify-start my-4">
            <Fa
              :icon="['fal', 'universal-access']"
              class="fa-3x mr-4 md:mr-6"
              style="font-size: 3.25em" />
            <div class="inline">
              <h3 class="text-3xl font-bold mt-2 md:mt-0">Accessibility</h3>
              <p class="sidebar">
                Everyone deserves the right to a great user experience on the
                web. I am committed to making sure that all of my work
                <strong>meets and exceeds web accessibility standards.</strong>
                I use several tools like Axe from Deque to test accessibility,
                as well as tab-navigating myself to make sure keyboard-only
                users can do everything they need. If you're having trouble on
                this site, please reach out to me on my
                <NuxtLink
                  to="/contact"
                  class="text-blue-700 dark:text-blue-500">
                  contact page
                </NuxtLink>
                .
              </p>
            </div>
          </div>
          <div class="flex items-start justify-start my-4">
            <Fa
              :icon="['fal', 'user-shield']"
              class="fa-3x mr-4 md:mr-6"
              style="font-size: 2.75em" />
            <div class="inline">
              <h3 class="text-3xl font-bold mt-2 md:mt-0">Privacy</h3>
              <p class="sidebar">
                All users have a right to privacy on the web. I believe that all
                websites and companies have a responsibility to their users to
                collect as little data as possible, and make it clear when they
                are doing so. I am using Plausible for analytics data
                collection, which is lightweight, and captures only small
                amounts of user interaction like page views and demographics.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <span class="text-lg italic leading-3">My latest</span>
        <h2 class="text-6xl h-underline font-bold dark:text-white">
          Blog Posts.
        </h2>
        <ul class="flex-col-start w-full">
          <li
            v-for="(post, index) in blogPosts"
            :key="index"
            class="w-full my-2">
            <NuxtLink :to="post.path">
              <BlogPostCard :post="post" />
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink to="/blog" aria-label="All blog posts">
          <ButtonSimple color="blue" class="mt-4">
            View all
            <Fa :icon="['fad', 'chevron-double-right']" class="ml-2" />
          </ButtonSimple>
        </NuxtLink>
      </div>
      <div class="section">
        <span class="text-lg italic leading-3">My recent</span>
        <h2 class="text-6xl h-underline font-bold dark:text-white">
          Projects.
        </h2>
        <ul class="flex-col-start w-full">
          <li
            v-for="(project, index) in projects"
            :key="index"
            class="w-full my-2">
            <ProjectCard :project="project" />
          </li>
        </ul>
        <NuxtLink to="/projects" aria-label="All projects">
          <ButtonSimple color="blue" class="mt-4">
            View all
            <Fa :icon="['fad', 'chevron-double-right']" class="ml-2" />
          </ButtonSimple>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: blogPosts } = await useAsyncData('home-blog', () =>
  queryCollection('blog').order('date', 'DESC').limit(3).all()
)

const { data: allProjects } = await useAsyncData('home-projects', () =>
  queryCollection('projects').all()
)

const projects = computed(() =>
  (allProjects.value || [])
    .filter((p) => p.tag === 'professional')
    .sort((a, b) => (a.position as number) - (b.position as number))
    .slice(0, 3)
)

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: "Welcome to Dan Valinotti's web development portfolio website!"
    }
  ],
  script: [
    { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
  ]
})
</script>

<style lang="scss" scoped>
h1,
h2 {
  font-family: 'Poppins';
  font-size: 3rem;
  line-height: 1;
  position: relative;
  width: max-content;
  margin-bottom: 2rem;
}
h3 {
  font-family: 'Poppins';
}

.sidebar {
  margin-top: 1rem;
  margin-left: -3.5rem;
  padding-left: 1rem;
  border-left: 2px solid $theme-blue;

  @media screen and (min-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}
.section {
  width: 100%;
  max-width: 48rem;
  margin: 4rem auto;
}

@media screen and (min-width: 625px) {
  h1 {
    font-size: 3.5rem;
  }
}
</style>
