<template>
  <nav
    class="navbar bg-white dark:bg-gray-800 dark:text-white"
    title="Navigation Bar"
    :class="{ show }">
    <div class="w-full relative flex">
      <button
        class="menu-btn absolute left-0 top-0"
        aria-label="Open navigation menu"
        @click="emit('showMenu')">
        <Fa :icon="['fal', 'bars']" class="fa-2x" />
      </button>
      <div class="home-link">
        <NuxtLink to="/">DVal</NuxtLink>
      </div>
      <ul class="nav-links mx-auto flex items-center justify-center py-4">
        <li v-for="(item, index) in items" :key="index">
          <NavLink :to="item.path" class="mx-2">
            {{ item.label }}
          </NavLink>
        </li>
      </ul>
      <ThemeToggle class="absolute right-0 top-0" />
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavItem {
  label: string
  path: string
}

defineProps<{
  items: NavItem[]
}>()

const emit = defineEmits<{
  showMenu: []
}>()

const scrollPosition = ref(0)
const lastCheckpoint = ref(0)
const direction = ref<'UP' | 'DOWN'>('DOWN')
const show = ref(true)

function getScrollDirection(current: number) {
  return current < scrollPosition.value ? 'UP' : 'DOWN'
}

function onScroll() {
  const currentPosition = window.scrollY
  const newDirection = getScrollDirection(currentPosition)
  if (newDirection !== direction.value) {
    direction.value = newDirection
    lastCheckpoint.value = scrollPosition.value
  }
  scrollPosition.value = currentPosition

  if (currentPosition === 0) {
    show.value = true
  } else {
    if (
      direction.value === 'UP' &&
      lastCheckpoint.value - scrollPosition.value >= 50
    ) {
      show.value = true
    }
    if (
      direction.value === 'DOWN' &&
      scrollPosition.value - lastCheckpoint.value >= 50
    ) {
      show.value = false
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  scrollPosition.value = window.scrollY
  lastCheckpoint.value = window.scrollY
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
nav.navbar {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease-in-out;
  transform: translateY(-120%);

  &.show {
    transform: translateY(0);
  }
  .nav-links {
    display: none;
    @media screen and (min-width: 600px) {
      display: flex;
    }
  }
  .menu-btn {
    padding: 1em;
    @media screen and (min-width: 600px) {
      display: none;
    }
  }
  .home-link {
    padding: 1.25em;
    margin: 0 auto;
    a {
      font-weight: bold;
      font-size: 1em;
      font-style: italic;
      padding: 0 0.75em;
      font-family: 'RockSalt';
      background: $theme-blue;
      color: white;
    }
    @media screen and (min-width: 600px) {
      padding: 1em;
      position: absolute;
      left: 0;
      top: 0;
      a {
        font-size: 1.05em;
      }
    }
  }
}
</style>
