<template>
  <NuxtLink :to="album.path" class="group block">
    <div
      class="aspect-[4/3] overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
      <NuxtImg
        :src="album.coverImage"
        :alt="`${album.title} album cover`"
        provider="cloudinary"
        sizes="sm:100vw md:50vw lg:33vw"
        placeholder
        placeholder-class="blur-md"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
    </div>
    <div class="mt-2 px-1">
      <div class="font-semibold text-gray-900 dark:text-white">
        {{ album.title }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ formatAlbumDate(album.date) }} · {{ album.photos.length }}
        {{ album.photos.length === 1 ? 'photo' : 'photos' }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import dateFormat from 'dateformat'

defineProps<{
  album: {
    title: string
    coverImage: string
    date: string
    photos: Array<unknown>
    path: string
  }
}>()

// Parse as local time to avoid UTC shifting YYYY-MM-DD into prior day.
function formatAlbumDate(date: string): string {
  if (date.length === 10) {
    return dateFormat(`${date}T00:00:00`, 'mediumDate')
  }
  return dateFormat(`${date}-01T00:00:00`, 'mmm yyyy')
}
</script>
