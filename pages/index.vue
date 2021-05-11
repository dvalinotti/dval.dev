<template>
  <div class="container mx-auto px-4 md:px-8">
    <main class="dark:text-white">
      <span class="text-lg italic leading-3">Hi, my name is</span>
      <h1 class="font-bold dark:text-white">Dan Valinotti</h1>
      <p class="p-4 bg-gray-100 max-w-sm dark:bg-gray-700">
        I am a Full-Stack Software Engineer with a passion for building clean,
        performant, and accessible websites and applications. Adaptable, design
        oriented, and user-focused applications are my specialty, along with
        strong architecture and solutions skills.
      </p>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Home',
  head() {
    return {
      title: 'Home',
      description:
        "Welcome to Dan Valinotti's web development portfolio website!"
    }
  }
}
</script>

<style scoped>
h1 {
  font-family: 'Poppins';
  font-size: 3rem;
  line-height: 1;
  position: relative;
  width: max-content;
  margin-bottom: 2rem;
}
h1:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  width: 100%;
  height: 2px;
  background: #0087d6;
}

@media screen and (min-width: 625px) {
  h1 {
    font-size: 3.5rem;
  }
}
</style>
