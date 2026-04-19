<template>
  <div class="container mx-auto px-4 max-w-5xl">
    <h1 class="h-underline page-header dark:text-white">Photos</h1>
    <div
      v-if="albums && albums.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <AlbumCard
        v-for="album in albums"
        :key="album.path"
        :album="album" />
    </div>
    <p v-else class="text-gray-500 dark:text-gray-400">
      No albums yet.
    </p>
  </div>
</template>

<script setup lang="ts">
const { data: albums } = await useAsyncData('photos-index', () =>
  queryCollection('photos').order('position', 'ASC').all()
)

useHead({
  title: 'Photos',
  meta: [
    {
      name: 'description',
      content: 'Amateur photography by Dan Valinotti.'
    }
  ]
})
</script>
