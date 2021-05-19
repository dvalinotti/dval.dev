<template>
  <div class="container">
    <form
      ref="contactForm"
      name="contact"
      method="POST"
      data-netlify="true"
      class="contact-form"
      action="/contact/success"
      @submit.prevent="onSubmit"
    >
      <input type="hidden" name="form-name" value="contact" />
      <label class="dark:text-white" for="name">
        Name: <span class="text-red-500">*</span>
      </label>
      <input
        id="name"
        v-model="name"
        class="dark:bg-gray-700 dark:text-white"
        type="text"
        name="name"
        required
      />
      <label class="dark:text-white" for="email">
        Email: <span class="text-red-500">*</span>
      </label>
      <input
        id="email"
        v-model="email"
        class="dark:bg-gray-700 dark:text-white"
        type="email"
        name="email"
        required
      />
      <label class="dark:text-white" for="phone"> Phone Number: </label>
      <input
        id="phone"
        v-model="phone"
        class="dark:bg-gray-700 dark:text-white"
        type="text"
        name="phone"
      />
      <label class="dark:text-white" for="message">
        Message: <span class="text-red-500">*</span>
      </label>
      <textarea
        id="message"
        v-model="message"
        class="dark:bg-gray-700 dark:text-white"
        name="message"
        rows="6"
        required
      />
      <button-simple type="submit" color="blue" class="mt-4">
        <span v-if="!loading">
          Submit <fa :icon="['fad', 'chevron-double-right']" class="ml-2" />
        </span>
        <fa v-else :icon="['fad', 'spinner-third']" class="spinner fa-2x" />
      </button-simple>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    name: '',
    email: '',
    phone: '',
    message: '',
    loading: false
  }),
  methods: {
    onSubmit() {
      this.loading = !this.loading
      this.$refs.contactForm.submit()
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;

  label {
    font-size: 1.125rem;
    font-weight: bold;
    margin-top: 0.75rem;
    margin-left: 0.25rem;
  }
  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.075);
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.125);
    margin: 0.25rem 0;
  }
  .spinner {
    animation: example 750ms linear infinite;
  }
}

@keyframes example {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
