<template>
  <div class="error-page container mx-auto px-4 md:px-8">
    <div class="dark:text-white">
      <p v-if="notFound" class="error-code">{{ code }}</p>
      <h1 class="h-underline text-4xl font-bold">
        {{ notFound ? 'Page not found.' : 'Uh oh!' }}
      </h1>
      <p class="py-4 max-w-sm">
        {{
          notFound
            ? "Looks like the page you're looking for doesn't exist."
            : 'Something went wrong.'
        }}
        <nuxt-link to="/" class="link" aria-label="Back to homepage"
          >Click here</nuxt-link
        >
        to go back to the homepage, or if you'd like to report the problem,
        visit the
        <nuxt-link to="/contact" class="link">contact page</nuxt-link>
        to reach out to me.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  head() {
    return {
      title: this.notFound ? 'Not found' : 'Error',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.notFound
            ? "The page you were looking for doesn't exist"
            : 'An error has occurred.'
        }
      ]
    }
  },
  computed: {
    code() {
      return this.error.statusCode || 500
    },
    notFound() {
      return this.error.statusCode === 404
    },
    message() {
      return this.error.message || 'Something went wrong.'
    }
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  height: 100%;
  min-height: 100ch;
}
.error-code {
  font-size: 6rem;
  font-weight: bold;
  line-height: 1.25;
}
</style>
