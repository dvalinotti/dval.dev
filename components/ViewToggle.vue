<template>
  <div
    class="inline-flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden mb-6">
    <button
      type="button"
      :class="buttonClass('albums')"
      @click="setView('albums')">
      Albums
    </button>
    <button
      type="button"
      :class="buttonClass('all')"
      @click="setView('all')">
      All photos
    </button>
  </div>
</template>

<script setup lang="ts">
type View = 'albums' | 'all'

const route = useRoute()
const router = useRouter()

const view = computed<View>(() =>
  route.query.view === 'all' ? 'all' : 'albums'
)

function setView(target: View) {
  router.replace({
    query: target === 'all' ? { view: 'all' } : {}
  })
}

function buttonClass(target: View) {
  const base = 'px-4 py-2 text-sm font-medium transition-colors'
  return view.value === target
    ? `${base} bg-blue-600 text-white`
    : `${base} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700`
}
</script>
