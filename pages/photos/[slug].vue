<template>
  <div v-if="album" class="container mx-auto px-4 max-w-5xl">
    <NuxtLink
      to="/photos"
      class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
      ← Back to albums
    </NuxtLink>
    <h1 class="h-underline page-header dark:text-white mt-4">
      {{ album.title }}
    </h1>
    <p
      v-if="album.description"
      class="text-gray-600 dark:text-gray-400 mb-6">
      {{ album.description }}
    </p>
    <PhotoGrid :photos="album.photos" @photo-click="open" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: album } = await useAsyncData(`photo-${slug}`, () =>
  queryCollection('photos').path(`/photos/${slug}`).first()
)

if (!album.value) {
  throw createError({ statusCode: 404, message: 'Album not found.' })
}

const lightboxPhotos = computed(() => {
  if (!album.value) return []
  return album.value.photos.map((p) => {
    const dims = cloudinaryDeliveredDims(p.width, p.height)
    return {
      src: cloudinaryUrl(p.publicId),
      alt: p.alt,
      width: dims.width,
      height: dims.height,
      caption: p.caption
        ? `${album.value!.title} · ${p.caption}`
        : album.value!.title
    }
  })
})

const { open } = useLightbox(lightboxPhotos)

useHead(() => ({
  title: album.value?.title || 'Album',
  meta: [
    {
      name: 'description',
      content: album.value?.description || ''
    }
  ]
}))
</script>
