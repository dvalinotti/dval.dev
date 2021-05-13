<template>
  <div class="container mx-auto px-4 md:px-8">
    <main class="dark:text-white">
      <div class="w-full">
        <span class="text-lg italic leading-3">Hi, my name is</span>
        <h1 class="font-bold dark:text-white">Dan Valinotti</h1>
        <p class="p-4 bg-gray-100 max-w-sm dark:bg-gray-700">
          I am a Full-Stack Software Engineer with a passion for building clean,
          performant, and accessible websites and applications. Adaptable,
          design oriented, and user-focused applications are my specialty, along
          with strong architecture and solutions skills.
        </p>
      </div>
      <div class="w-full my-16 dark:text-white">
        <span class="text-lg italic leading-3">My Guiding</span>
        <h2 class="text-6xl h-underline font-bold dark:text-white">
          Principles.
        </h2>
        <div class="w-full max-w-2xl flex flex-col items-start justify-start">
          <div class="flex items-start justify-start my-4">
            <fa
              :icon="['fas', 'tachometer-alt']"
              class="fa-3x mr-4 md:mr-6"
              style="font-size: 2.75em"
            />
            <div class="inline">
              <h3 class="text-3xl font-bold mt-2 md:mt-0">Performance</h3>
              <p class="sidebar">
                Nothing is better than a beautiful site that doesn't make you
                wait. Performance is one of my top priorities when doing any
                kind of software development, and this website is a testament to
                that. The website is built with Nuxt.js, which allows me to
                write clean, maintainable source code that is
                <strong>statically-generated</strong> for optimal page load
                times.
              </p>
            </div>
          </div>
          <div class="flex items-start justify-start my-4">
            <fa
              :icon="['fas', 'universal-access']"
              class="fa-3x mr-4 md:mr-6"
              style="font-size: 3.25em"
            />
            <div class="inline">
              <h3 class="text-3xl font-bold mt-2 md:mt-0">Accessibility</h3>
              <p class="sidebar">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                porta diam in consequat vulputate. Mauris ex arcu, sagittis id
                ex ac, malesuada semper sapien. Pellentesque in dapibus turpis.
                Orci varius natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus.
              </p>
            </div>
          </div>
          <div class="flex items-start justify-start my-4">
            <fa
              :icon="['fas', 'user-lock']"
              class="fa-3x mr-4 md:mr-6"
              style="font-size: 2.75em"
            />
            <div class="inline">
              <h3 class="text-3xl font-bold mt-2 md:mt-0">Privacy</h3>
              <p class="sidebar">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                porta diam in consequat vulputate. Mauris ex arcu, sagittis id
                ex ac, malesuada semper sapien. Pellentesque in dapibus turpis.
                Orci varius natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Home',
  head() {
    return {
      title: 'Home',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            "Welcome to Dan Valinotti's web development portfolio website!"
        }
      ]
    }
  }
}
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
h1 {
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 100%;
    height: 2px;
    background: #0087d6;
  }
}

.sidebar {
  position: relative;
  margin-top: 1rem;
  margin-left: -3.5rem;
  padding-left: 1rem;
  z-index: 1;

  @media screen and (min-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 2px;
    background: #0087d6;
    z-index: -1;
  }
}

@media screen and (min-width: 625px) {
  h1 {
    font-size: 3.5rem;
  }
}
</style>
