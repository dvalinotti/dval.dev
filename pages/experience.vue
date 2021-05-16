<template>
  <div class="container mx-auto px-1 sm:px-4 max-w-4xl">
    <main class="dark:text-white">
      <h1 class="h-underline page-header mx-3 sm:mx-0">Experience</h1>
      <div v-for="(exp, index) in expItems" :key="index" class="tl">
        <div class="tl--time">
          <p v-if="exp.end" class="font-bold text-left pr-2 text-sm br-blue">
            {{ exp.end }}
          </p>
          <div class="divider br-blue"></div>
          <p class="font-bold text-right pr-2 pb-10 text-sm br-blue">
            {{ exp.start }}
          </p>
        </div>
        <div class="tl--exp">
          <div class="flex flex-col md:flex-row pl-2">
            <h2 class="font-bold text-lg mt-1 leading-4">
              {{ exp.title }}
            </h2>
            <span class="text-gray-700 italic md:pl-2">@ {{ exp.at }}</span>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="text-sm ml-4 pr-4 py-2" v-html="exp.description"></p>
          <ul class="flex flex-wrap ml-4 mt-2">
            <li v-for="(icon, i) in exp.icons" :key="i">
              <fa
                :icon="['fab', icon]"
                class="mr-3 fa-2x"
                :aria-label="icon"
                :title="icon"
              />
            </li>
          </ul>
          <div class="border-b-2 border-b-gray-700 my-4 mx-4"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data: () => ({
    expItems: [
      {
        start: '',
        end: 'Jan 2020 ↳ Present',
        title: 'Full Stack Developer',
        at: 'Colgate-Palmolive',
        icons: [
          'vuejs',
          'node',
          'js-square',
          'css3',
          'shopify',
          'google',
          'github'
        ],
        description: `E-commerce web app development in the DTC
            group, launching 2 new brands with headless frontend
            <strong>Shopify GraphQL</strong> sites built with
            <strong>Vue + Nuxt.</strong> Supported development of an
            existing <strong>Shopify Liquid</strong>. Developed <strong>Node.js
            modules and micro-backends </strong> to support extended site
            functionality. Deployed serverless applications with <strong>GCP</strong>.`
      },
      {
        end: 'May 2019 ↳ Dec 2019',
        start: '',
        title: 'Software Engineer',
        at: 'GalaxE Solutions',
        icons: ['java', 'react', 'js-square', 'css3', 'node', 'aws', 'github'],
        description: `Developed full-stack applications for clients in the healthcare
            industry. Built a market price tracking application for a financial team
            with <strong>Java + Spring</strong> in the backend and a <strong>React</strong>
            SPA on the frontend. Deployed scheduled and serverless functions with
            <strong>AWS and Python</strong>.`
      },
      {
        end: 'April 2019',
        start: 'Sept 2018',
        title: 'Web Development Intern',
        at: 'Aardvark Brigade',
        icons: [
          'wordpress-simple',
          'css3',
          'html5',
          'grunt',
          'gulp',
          'bitbucket'
        ],
        description: `Developed a range of <strong>WordPress</strong> websites for
            a web design agency. Learned the foundations of web development with
            <strong>CSS3</strong>, <strong>HTML5</strong>, and <strong>PHP</strong>.
            Configured local + production development with <strong>Gulp/Grunt and
            Vagrant.</strong>`
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
.tl {
  position: relative;
  display: grid;
  grid-template-columns: 75px auto;
  grid-auto-flow: row;
  max-width: 625px;
  @media screen and (min-width: 500px) {
    grid-template-columns: 95px auto;
  }

  &--time {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;

    .divider {
      height: 100%;
      width: 100%;
      margin-left: auto;
    }
    .br-blue {
      border-right: 2px solid #0087d6;
    }
    p.br-blue {
      position: relative;
      &::after {
        content: '•';
        position: absolute;
        right: -0.25em;
        top: 0;
        font-size: 1.75em;
      }
    }
  }
  &--exp {
    padding-left: 1em;
  }
}
</style>
