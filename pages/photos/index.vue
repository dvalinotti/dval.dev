<template>
  <div class="container mx-auto px-4 max-w-5xl">
    <h1 class="h-underline page-header dark:text-white">Photos</h1>
    <ViewToggle />
    <div v-if="view === 'albums'">
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
    <PhotoGrid
      v-else
      :photos="allPhotoItems"
      @photo-click="open" />
  </div>
</template>

<script setup lang="ts">
const { data: albums } = await useAsyncData('photos-index', () =>
  queryCollection('photos').order('position', 'ASC').all()
)

const route = useRoute()
const view = computed(() =>
  route.query.view === 'all' ? 'all' : 'albums'
)

interface AllPhotoItem {
  publicId: string
  alt: string
  width: number
  height: number
  caption?: string
  albumTitle: string
}

const allPhotoItems = computed<AllPhotoItem[]>(() => {
  if (!albums.value) return []
  return [...albums.value]
    .sort((a, b) => b.date.localeCompare(a.date))
    .flatMap(album =>
      album.photos.map(p => ({
        publicId: p.publicId,
        alt: p.alt,
        width: p.width,
        height: p.height,
        caption: p.caption,
        albumTitle: album.title
      }))
    )
})

const lightboxPhotos = computed(() =>
  allPhotoItems.value.map((p) => {
    const dims = cloudinaryDeliveredDims(p.width, p.height)
    return {
      src: cloudinaryUrl(p.publicId),
      alt: p.alt,
      width: dims.width,
      height: dims.height,
      caption: p.caption
        ? `${p.albumTitle} · ${p.caption}`
        : p.albumTitle
    }
  })
)

const { open } = useLightbox(lightboxPhotos)

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
