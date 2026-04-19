<template>
  <div class="columns-1 sm:columns-2 md:columns-3 gap-3">
    <figure
      v-for="(photo, index) in photos"
      :key="photo.publicId + '-' + index"
      class="mb-3 break-inside-avoid cursor-pointer"
      @click="$emit('photoClick', index)">
      <div class="overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
        <NuxtPicture
          :src="photo.publicId"
          :alt="photo.alt"
          :width="photo.width"
          :height="photo.height"
          sizes="sm:100vw md:50vw lg:33vw"
          loading="lazy"
          :img-attrs="{
            class: [
              'w-full transition-opacity duration-500',
              loaded[photo.publicId + '-' + index] ? 'opacity-100' : 'opacity-0'
            ]
          }"
          @load="loaded[photo.publicId + '-' + index] = true" />
      </div>
      <figcaption
        v-if="photo.caption"
        class="mt-1 px-1 text-xs text-gray-600 dark:text-gray-400">
        {{ photo.caption }}
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
export interface GridPhoto {
  publicId: string
  alt: string
  width: number
  height: number
  caption?: string
}

defineProps<{ photos: GridPhoto[] }>()
defineEmits<{ photoClick: [index: number] }>()

const loaded = reactive<Record<string, boolean>>({})
</script>
