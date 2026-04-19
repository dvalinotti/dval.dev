<template>
  <NuxtLink :to="albumPath" class="group block">
    <div
      class="aspect-[4/3] overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
      <NuxtPicture
        :src="album.coverImage"
        :alt="`${album.title} album cover`"
        sizes="sm:100vw md:50vw lg:33vw"
        :img-attrs="{
          class:
            'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
        }" />
    </div>
    <div class="mt-2 px-1">
      <div class="font-semibold text-gray-900 dark:text-white">
        {{ album.title }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ formatDate(album.date) }} · {{ album.photos.length }}
        {{ album.photos.length === 1 ? 'photo' : 'photos' }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface AlbumLike {
  title: string
  coverImage: string
  date: string
  photos: Array<unknown>
  path: string
}

const props = defineProps<{ album: AlbumLike }>()

const albumPath = computed(() => props.album.path)

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

function formatDate(date: string): string {
  const parts = date.split('-')
  const year = parts[0]
  const month = MONTHS[parseInt(parts[1], 10) - 1]
  if (parts.length === 3) {
    return `${month} ${parseInt(parts[2], 10)}, ${year}`
  }
  return `${month} ${year}`
}
</script>
