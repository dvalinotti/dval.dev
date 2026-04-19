# Photo Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a photo-library feature at `/photos` — album index + album detail pages, inline "all photos" view, and a PhotoSwipe lightbox with pinch-zoom and keyboard navigation. Images hosted on Cloudinary (cloud name `djrhjpihn`), albums managed as markdown via `@nuxt/content`.

**Architecture:** New `photos` collection in `@nuxt/content` backed by markdown files in `content/photos/*.md`. Two new routes (`/photos`, `/photos/[slug]`). Images rendered via `<NuxtPicture>` with Cloudinary as the `@nuxt/image` provider. Fullscreen viewer via PhotoSwipe v5 in a shared composable. All-photos view is an inline toggle on `/photos` with state in the URL query string.

**Tech Stack:** Nuxt 3, Vue 3, `<script setup lang="ts">`, TailwindCSS + SCSS, `@nuxt/content` v3, `@nuxt/image` (cloudinary provider), PhotoSwipe v5, Cloudinary (hosting + Admin API).

**Reference:** Design spec at `docs/superpowers/specs/2026-04-19-photo-library-design.md`.

**Verification approach:** The repo has no test suite; per the spec, we don't add one. Each task is verified via: `yarn lint`, running `yarn dev` and manually checking behavior in the browser, and `yarn generate` at the end. Commits happen after each task.

---

## File Structure

**New files:**
- `pages/photos/index.vue` — album index, hosts view toggle + optional all-photos grid
- `pages/photos/[slug].vue` — single album detail
- `components/AlbumCard.vue` — album tile (cover image, title, date, count)
- `components/PhotoGrid.vue` — CSS-columns masonry grid (reused by album detail + all-photos view)
- `components/ViewToggle.vue` — segmented control ("Albums" / "All photos"); reads/writes `?view=`
- `composables/useLightbox.ts` — PhotoSwipe wrapper; dataSource rebuilt per open, captions wired via `uiRegister`
- `utils/cloudinary.ts` — `cloudinaryUrl(publicId, transform?)` helper for full-size URLs
- `scripts/list-cloudinary-folder.ts` — dev script: hits Cloudinary Admin API, prints YAML block for pasting into an album markdown
- `content/photos/sample-album.md` — one seed album so development can proceed with real content
- `.env.example` — documents required Cloudinary Admin API env vars

**Modified files:**
- `nuxt.config.ts` — add `image.cloudinary` config and set `image.provider`
- `content.config.ts` — add `photos` collection + schema
- `layouts/default.vue` — insert "Photos" between "Experience" and "Contact" in `navItems`
- `package.json` — add `photoswipe`, `cloudinary`, `tsx` to devDependencies; add `cloudinary:list` script
- `.gitignore` — add `.env` (repo doesn't currently ignore it explicitly; it falls under `.env` pattern already, but verify)

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`, `yarn.lock`

- [ ] **Step 1: Install runtime dependency (PhotoSwipe)**

Run:
```bash
yarn add photoswipe
```

Expected: `photoswipe@^5.x.x` appears under `dependencies` in `package.json`; `yarn.lock` updated.

- [ ] **Step 2: Install dev dependencies (Cloudinary Admin SDK + tsx)**

Run:
```bash
yarn add --dev cloudinary tsx
```

Expected: `cloudinary` and `tsx` appear under `devDependencies`.

Rationale: `cloudinary` is used only by the `scripts/list-cloudinary-folder.ts` authoring script (never bundled into site output), so dev dep is correct. `tsx` runs TypeScript scripts directly.

- [ ] **Step 3: Verify install**

Run:
```bash
yarn lint
```

Expected: lint exits cleanly (no new errors from the install).

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock
git commit -m "Add photoswipe, cloudinary, tsx dependencies"
```

---

## Task 2: Configure @nuxt/image Cloudinary provider + env setup

**Files:**
- Modify: `nuxt.config.ts`
- Create: `.env.example`
- Modify: `.gitignore` (add explicit `.env` rule if missing)

- [ ] **Step 1: Check `.gitignore` for `.env` rule**

Run:
```bash
grep -n "^\.env" .gitignore
```

If line 60 shows `.env`, skip step 2. If no match, go to step 2.

- [ ] **Step 2: Add `.env` to `.gitignore` (only if missing)**

Append the following to `.gitignore`:
```
# Local environment (Cloudinary API creds, etc.)
.env
```

- [ ] **Step 3: Update `nuxt.config.ts` — replace the `image: {}` line**

Find the line:
```ts
  image: {},
```

Replace with:
```ts
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/djrhjpihn/image/upload/'
    }
  },
```

- [ ] **Step 4: Create `.env.example`**

Contents:
```
# Cloudinary Admin API credentials (dev-only, used by scripts/list-cloudinary-folder.ts)
# Find these in your Cloudinary dashboard → Settings → API Keys.
CLOUDINARY_CLOUD_NAME=djrhjpihn
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

- [ ] **Step 5: Verify dev server starts**

Run:
```bash
yarn dev
```

Expected: server starts on `localhost:3000` without image-provider errors. Open the home page in a browser to confirm existing pages still render. Stop the server (Ctrl+C) after verifying.

- [ ] **Step 6: Commit**

```bash
git add nuxt.config.ts .env.example .gitignore
git commit -m "Configure @nuxt/image with Cloudinary provider"
```

---

## Task 3: Add photos collection to content schema

**Files:**
- Modify: `content.config.ts`

- [ ] **Step 1: Add the photos collection**

Open `content.config.ts`. Add a `photos` key to the `collections` object alongside `blog` and `projects`:

```ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
      schema: z.object({
        date: z.string(),
        featuredImage: z.string(),
        featuredImageAlt: z.string(),
        subtitle: z.string(),
        tags: z.array(z.string()),
        keywords: z.string().optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**',
      schema: z.object({
        image: z.string(),
        imageAlt: z.string(),
        position: z.number(),
        isBeta: z.boolean().optional(),
        tag: z.string(),
        company: z.string(),
        github: z.string().optional(),
        liveUrl: z.string().optional(),
        readMoreUrl: z.string().optional(),
        npm: z.string().optional()
      })
    }),
    photos: defineCollection({
      type: 'page',
      source: 'photos/**',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
        position: z.number(),
        coverImage: z.string(),
        photos: z.array(z.object({
          publicId: z.string(),
          alt: z.string(),
          width: z.number(),
          height: z.number(),
          caption: z.string().optional()
        }))
      })
    })
  }
})
```

- [ ] **Step 2: Verify the schema compiles**

Run:
```bash
yarn dev
```

Expected: no schema errors in the terminal output (Nuxt Content logs schema validation failures clearly). Stop dev server after confirming.

- [ ] **Step 3: Commit**

```bash
git add content.config.ts
git commit -m "Add photos collection to Nuxt Content schema"
```

---

## Task 4: Create sample album markdown

**Files:**
- Create: `content/photos/sample-album.md`

Rationale: Downstream tasks render the `/photos` pages; we need at least one album of content for local verification. This uses Cloudinary's public "demo" cloud's sample images as placeholders — swap in real uploads later. (If your own Cloudinary account has photos ready, use your public_ids instead and set `baseURL` accordingly — but `djrhjpihn` + these sample ids will not resolve, so this file is for schema validation only during dev; see note at task end.)

- [ ] **Step 1: Create the file**

Create `content/photos/sample-album.md` with these exact contents:

```md
---
title: Sample Album
description: Placeholder album for development. Replace with real content.
date: '2025-06'
position: 1
coverImage: samples/landscapes/nature-mountains
photos:
  - publicId: samples/landscapes/nature-mountains
    alt: Mountain landscape
    width: 4000
    height: 2667
    caption: Sample caption for testing
  - publicId: samples/landscapes/beach-boat
    alt: Boat on a beach
    width: 4000
    height: 2667
  - publicId: samples/landscapes/architecture-signs
    alt: Street architecture and signs
    width: 2000
    height: 3000
  - publicId: samples/people/smiling-man
    alt: Portrait, smiling man
    width: 2400
    height: 3000
---
```

> Note on sample images: `samples/...` public_ids only exist on Cloudinary's `demo` cloud. To actually see images while developing, temporarily change `baseURL` in `nuxt.config.ts` to `https://res.cloudinary.com/demo/image/upload/`. Remember to change it back to `djrhjpihn` before finishing. Alternatively, replace the public_ids above with real ones from your `djrhjpihn` account.

- [ ] **Step 2: Verify content is picked up**

Run:
```bash
yarn dev
```

Visit `/_content/photos/sample-album.json` in the browser (Nuxt Content dev endpoint). Expected: see the parsed frontmatter + body JSON. If Nuxt flags validation errors, fix the file until it passes. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add content/photos/sample-album.md
git commit -m "Add sample photo album for development"
```

---

## Task 5: Create Cloudinary URL utility

**Files:**
- Create: `utils/cloudinary.ts`

Rationale: Nuxt 3 auto-imports everything in `utils/`. This helper is used anywhere we need a raw Cloudinary delivery URL outside of `<NuxtPicture>` (primarily: PhotoSwipe, which wants a direct `src`).

- [ ] **Step 1: Write the utility**

Create `utils/cloudinary.ts` with contents:

```ts
const CLOUDINARY_BASE = 'https://res.cloudinary.com/djrhjpihn/image/upload'

/** Max long-edge size (px) delivered to the lightbox. */
export const LIGHTBOX_MAX_EDGE = 2500

/**
 * Builds a Cloudinary delivery URL for a public_id with an optional transform.
 * Default transform caps the long edge at LIGHTBOX_MAX_EDGE, auto-negotiates
 * format (AVIF/WebP/JPEG), and auto-tunes quality.
 */
export function cloudinaryUrl(
  publicId: string,
  transform = `w_${LIGHTBOX_MAX_EDGE},c_limit,f_auto,q_auto`
): string {
  return `${CLOUDINARY_BASE}/${transform}/${publicId}`
}

/**
 * Given native image dimensions, returns the dimensions of the Cloudinary-
 * delivered image when using the default transform. PhotoSwipe uses these
 * to set proper zoom bounds (otherwise it upscales past delivered pixels).
 */
export function cloudinaryDeliveredDims(
  width: number,
  height: number
): { width: number; height: number } {
  const longEdge = Math.max(width, height)
  if (longEdge <= LIGHTBOX_MAX_EDGE) return { width, height }
  const scale = LIGHTBOX_MAX_EDGE / longEdge
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale)
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
yarn lint
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add utils/cloudinary.ts
git commit -m "Add cloudinaryUrl utility"
```

---

## Task 6: Create Cloudinary folder-listing script

**Files:**
- Create: `scripts/list-cloudinary-folder.ts`
- Modify: `package.json` (add `cloudinary:list` script)

- [ ] **Step 1: Write the script**

Create `scripts/list-cloudinary-folder.ts`:

```ts
/**
 * Lists all Cloudinary resources under a given folder prefix and prints a
 * ready-to-paste YAML block for pasting into a content/photos/*.md file.
 *
 * Usage: yarn cloudinary:list <folder>
 *   e.g. yarn cloudinary:list dval-photos/iceland
 */
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryResource {
  public_id: string
  width: number
  height: number
}

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('Usage: yarn cloudinary:list <folder>')
    console.error('Example: yarn cloudinary:list dval-photos/iceland')
    process.exit(1)
  }
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET in .env')
    process.exit(1)
  }

  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: 500
  }) as { resources: CloudinaryResource[] }

  if (result.resources.length === 0) {
    console.error(`No resources found under prefix "${folder}".`)
    process.exit(1)
  }

  // Sort alphabetically by public_id for deterministic output.
  const sorted = [...result.resources].sort((a, b) =>
    a.public_id.localeCompare(b.public_id)
  )

  const yaml = sorted.map(r =>
    `  - publicId: ${r.public_id}\n    alt: ''\n    width: ${r.width}\n    height: ${r.height}`
  ).join('\n')

  console.log(yaml)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Add the yarn script**

Open `package.json`. In the `scripts` object, add:

```json
"cloudinary:list": "tsx --env-file=.env scripts/list-cloudinary-folder.ts"
```

Final `scripts` block should look like:

```json
"scripts": {
  "dev": "nuxi dev",
  "build": "nuxi build",
  "generate": "nuxi generate",
  "preview": "nuxi preview",
  "postinstall": "nuxi prepare",
  "lint": "eslint .",
  "cloudinary:list": "tsx --env-file=.env scripts/list-cloudinary-folder.ts"
}
```

- [ ] **Step 3: Smoke test (optional — requires real creds)**

If the user has populated `.env` with real Cloudinary API creds and has a folder of uploaded photos, run:
```bash
yarn cloudinary:list dval-photos/sample
```

Expected: a YAML block printed to stdout. If no creds yet, skip this step and verify only that `yarn lint` is clean.

Run:
```bash
yarn lint
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add scripts/list-cloudinary-folder.ts package.json
git commit -m "Add Cloudinary folder-listing authoring script"
```

---

## Task 7: Create AlbumCard component

**Files:**
- Create: `components/AlbumCard.vue`

- [ ] **Step 1: Write the component**

Create `components/AlbumCard.vue`:

```vue
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
  // '2024-08' → 'Aug 2024'; '2024-08-14' → 'Aug 14, 2024'
  const parts = date.split('-')
  const year = parts[0]
  const month = MONTHS[parseInt(parts[1], 10) - 1]
  if (parts.length === 3) {
    return `${month} ${parseInt(parts[2], 10)}, ${year}`
  }
  return `${month} ${year}`
}
</script>
```

> Note on `album.path`: `@nuxt/content` v3 exposes the page path as `path` on returned items. If the runtime field is named differently (some v3 releases used `_path`), update the type and `albumPath` computed accordingly. The fix is a single line.

- [ ] **Step 2: Verify lint**

Run:
```bash
yarn lint
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add components/AlbumCard.vue
git commit -m "Add AlbumCard component"
```

---

## Task 8: Create pages/photos/index.vue (albums view only)

**Files:**
- Create: `pages/photos/index.vue`

Rationale: Keep this task small — index page renders the albums grid only. We'll layer on the view toggle + all-photos view in Task 14/15 once more components exist.

- [ ] **Step 1: Write the page**

Create `pages/photos/index.vue`:

```vue
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
```

- [ ] **Step 2: Verify page renders**

Run:
```bash
yarn dev
```

Visit `http://localhost:3000/photos` in the browser.

Expected:
- Page title "Photos" renders with the existing `h-underline page-header` styling.
- The sample album from Task 4 appears as one card in a grid (cover image may be broken if using `djrhjpihn` with sample public_ids — that's OK; the card layout, title, and "Sample Album · Jun 2025 · 4 photos" text should still render).
- No console errors related to the photos collection.
- Dark mode (if toggled) renders with the dark color palette.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add pages/photos/index.vue
git commit -m "Add /photos album index page"
```

---

## Task 9: Add Photos to main nav

**Files:**
- Modify: `layouts/default.vue`

- [ ] **Step 1: Update navItems**

In `layouts/default.vue`, find the `navItems` array (lines 23-29):

```ts
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'Projects', path: '/projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Contact', path: '/contact' }
]
```

Insert `{ label: 'Photos', path: '/photos' }` between Experience and Contact so the array becomes:

```ts
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'Projects', path: '/projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Photos', path: '/photos' },
  { label: 'Contact', path: '/contact' }
]
```

- [ ] **Step 2: Verify nav link appears and works**

Run:
```bash
yarn dev
```

Visit any page. Expected:
- "Photos" appears in the desktop nav between "Experience" and "Contact".
- Clicking "Photos" navigates to `/photos` and renders the page from Task 8.
- Mobile hamburger menu also shows "Photos" in the same position.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add layouts/default.vue
git commit -m "Add Photos to main nav"
```

---

## Task 10: Create PhotoGrid component (masonry, no lightbox yet)

**Files:**
- Create: `components/PhotoGrid.vue`

- [ ] **Step 1: Write the component**

Create `components/PhotoGrid.vue`:

```vue
<template>
  <div class="columns-1 sm:columns-2 md:columns-3 gap-3">
    <figure
      v-for="(photo, index) in photos"
      :key="photo.publicId + '-' + index"
      class="mb-3 break-inside-avoid cursor-pointer group"
      @click="$emit('photoClick', index)">
      <NuxtPicture
        :src="photo.publicId"
        :alt="photo.alt"
        :width="photo.width"
        :height="photo.height"
        sizes="sm:100vw md:50vw lg:33vw"
        loading="lazy"
        :img-attrs="{
          class:
            'w-full rounded-md transition-opacity duration-200 group-hover:opacity-95'
        }" />
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
</script>
```

- [ ] **Step 2: Verify lint**

Run:
```bash
yarn lint
```

Expected: clean. (We'll verify visually in the next task when it's actually used.)

- [ ] **Step 3: Commit**

```bash
git add components/PhotoGrid.vue
git commit -m "Add PhotoGrid masonry component"
```

---

## Task 11: Create pages/photos/[slug].vue (without lightbox)

**Files:**
- Create: `pages/photos/[slug].vue`

Rationale: Render the album detail page with the masonry grid first; we'll add the lightbox in Task 13 once the composable exists. Clicking a photo does nothing yet.

- [ ] **Step 1: Write the page**

Create `pages/photos/[slug].vue`:

```vue
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
    <PhotoGrid :photos="album.photos" @photo-click="onPhotoClick" />
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

function onPhotoClick(index: number) {
  // Lightbox wired in Task 13; no-op for now.
  console.debug('photo clicked', index)
}

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
```

- [ ] **Step 2: Verify page renders**

Run:
```bash
yarn dev
```

Visit `http://localhost:3000/photos/sample-album`.

Expected:
- "← Back to albums" link renders and routes back to `/photos`.
- Album title "Sample Album" + description render.
- Masonry grid with 4 photo figures appears. Images may be broken if using `djrhjpihn` without real content; the layout (3 columns on desktop, 2 on tablet, 1 on mobile) should be visible via the figure placeholders.
- Clicking a photo logs `photo clicked <index>` to the console (no error).
- Visiting `/photos/does-not-exist` renders the 404 page.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add pages/photos/[slug].vue
git commit -m "Add /photos/[slug] album detail page"
```

---

## Task 12: Create useLightbox composable

**Files:**
- Create: `composables/useLightbox.ts`

Rationale: A single PhotoSwipe instance is created on mount and destroyed on unmount. The `dataSource` is rebuilt from the current `photos.value` on every `open()` call, so the composable handles dynamic photo lists (e.g., switching between album view and all-photos view on `/photos`) without re-instantiating.

- [ ] **Step 1: Write the composable**

Create `composables/useLightbox.ts`:

```ts
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import type { Ref } from 'vue'
import 'photoswipe/style.css'

export interface LightboxPhoto {
  src: string
  width: number
  height: number
  alt: string
  caption?: string
}

/**
 * PhotoSwipe v5 wrapper. Creates one lightbox instance on mount.
 * `dataSource` is rebuilt from `photos.value` on each open() call, so the
 * composable stays in sync when the caller's photo list changes (e.g.,
 * toggling between album view and all-photos view).
 */
export function useLightbox(photos: Ref<LightboxPhoto[]>) {
  let lightbox: PhotoSwipeLightbox | null = null

  onMounted(() => {
    lightbox = new PhotoSwipeLightbox({
      dataSource: [],
      pswpModule: () => import('photoswipe')
    })

    lightbox.on('uiRegister', () => {
      lightbox?.pswp?.ui?.registerElement({
        name: 'photo-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: '',
        onInit: (el, pswp) => {
          el.style.position = 'absolute'
          el.style.bottom = '20px'
          el.style.left = '0'
          el.style.right = '0'
          el.style.textAlign = 'center'
          el.style.color = 'rgba(255,255,255,0.85)'
          el.style.fontSize = '14px'
          el.style.padding = '0 16px'
          el.style.pointerEvents = 'none'
          pswp.on('change', () => {
            el.innerHTML = photos.value[pswp.currIndex]?.caption || ''
          })
        }
      })
    })

    lightbox.init()
  })

  onBeforeUnmount(() => {
    lightbox?.destroy()
    lightbox = null
  })

  function open(index: number) {
    if (!lightbox) return
    lightbox.options.dataSource = photos.value.map(p => ({
      src: p.src,
      width: p.width,
      height: p.height,
      alt: p.alt
    }))
    lightbox.loadAndOpen(index)
  }

  return { open }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
yarn lint
```

Expected: clean. If TypeScript complains about `pswp.currIndex` or `pswp.ui`, inspect the `photoswipe` package's type definitions and adjust the call sites — the APIs above are from PhotoSwipe v5.

- [ ] **Step 3: Commit**

```bash
git add composables/useLightbox.ts
git commit -m "Add useLightbox composable (PhotoSwipe v5 wrapper)"
```

---

## Task 13: Wire lightbox into pages/photos/[slug].vue

**Files:**
- Modify: `pages/photos/[slug].vue`

- [ ] **Step 1: Update the page**

Replace the contents of `pages/photos/[slug].vue` entirely with:

```vue
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
```

- [ ] **Step 2: Verify lightbox behavior end-to-end**

Run:
```bash
yarn dev
```

Visit `http://localhost:3000/photos/sample-album`.

Expected (manual checks — all of these are PhotoSwipe built-ins, not our code):
- Clicking a photo opens the fullscreen lightbox.
- Left/right **arrow keys** navigate prev/next.
- On-screen **prev/next buttons** navigate.
- **ESC** closes the lightbox.
- **Click** the image toggles zoom.
- On a mobile device/emulator: **pinch-to-zoom** works, **swipe** left/right navigates, **swipe down** closes.
- **Caption** appears at the bottom of each image ("Sample Album · Sample caption for testing" for the first photo; just "Sample Album" for photos without captions).

If any of the above doesn't work, investigate whether PhotoSwipe loaded (network tab), the `dataSource` is populated (break inside `open()`), and whether the image URLs resolve (needs real photos to actually display).

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add pages/photos/[slug].vue
git commit -m "Wire PhotoSwipe lightbox into album detail page"
```

---

## Task 14: Create ViewToggle component

**Files:**
- Create: `components/ViewToggle.vue`

- [ ] **Step 1: Write the component**

Create `components/ViewToggle.vue`:

```vue
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
```

- [ ] **Step 2: Verify lint**

Run:
```bash
yarn lint
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add components/ViewToggle.vue
git commit -m "Add ViewToggle segmented control"
```

---

## Task 15: Add all-photos view + lightbox to pages/photos/index.vue

**Files:**
- Modify: `pages/photos/index.vue`

- [ ] **Step 1: Update the page**

Replace the contents of `pages/photos/index.vue` entirely with:

```vue
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
```

- [ ] **Step 2: Verify end-to-end behavior**

Run:
```bash
yarn dev
```

Visit `http://localhost:3000/photos`.

Expected:
- Page loads on the "Albums" view by default; toggle is highlighted on "Albums".
- Clicking "All photos" updates the URL to `/photos?view=all`, the grid switches to the flattened masonry of all photos across all albums.
- Browser back button returns to `/photos` (albums view).
- Clicking a photo in the all-photos view opens the lightbox at the correct index.
- Caption in lightbox shows `{album title} · {caption}` or just `{album title}`.
- Left/right arrow keys navigate through the full flattened list.
- Reloading `/photos?view=all` directly lands in the all-photos view.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add pages/photos/index.vue
git commit -m "Add all-photos view and lightbox to /photos index"
```

---

## Task 16: Final verification

**Files:** No new changes; verification only.

- [ ] **Step 1: Lint clean**

Run:
```bash
yarn lint
```

Expected: zero errors.

- [ ] **Step 2: Full dev-mode smoke test**

Run:
```bash
yarn dev
```

Walk through the feature in the browser end-to-end:
1. Visit `/` — home page renders, "Photos" appears in nav.
2. Click "Photos" — lands on `/photos`, albums grid renders, "Albums" toggle highlighted.
3. Click a sample album card — lands on `/photos/<slug>`, "← Back to albums" link visible, title + description render, masonry grid of photos visible.
4. Click any photo — lightbox opens. Arrow keys, on-screen prev/next, ESC, click-to-zoom all work. Caption displays correctly.
5. Close lightbox. Click "← Back to albums" — lands on `/photos`.
6. Click "All photos" toggle — URL becomes `/photos?view=all`, view switches to flattened masonry.
7. Click any photo — lightbox opens; captions include album title prefix.
8. Navigate via back button — returns to albums view.
9. Toggle dark mode — verify nav, toggle button, cards, album detail, masonry, and captions all render correctly in dark mode.
10. Resize window to mobile width — verify: nav collapses to hamburger, album index becomes single-column, masonry becomes single-column, lightbox still works.

Any failures → fix and re-verify. Stop dev server.

- [ ] **Step 3: Static build succeeds**

Run:
```bash
yarn generate
```

Expected:
- Build completes without errors.
- Output includes:
  - `.output/public/photos/index.html`
  - `.output/public/photos/sample-album/index.html`
- No warnings about unresolved routes or schema violations for the photos collection.

- [ ] **Step 4: Confirm static output works**

Run:
```bash
yarn preview
```

In a browser: visit `http://localhost:3000/photos` and click through to `/photos/sample-album`, open the lightbox. Expected: works identically to dev mode.

Stop preview server.

- [ ] **Step 5: Final commit (if any fixes were made)**

If any of the verification steps required code fixes:
```bash
git add -A
git commit -m "Fix issues from final verification pass"
```

If nothing needed fixing, no commit for this step.

---

## Post-implementation notes

- The `content/photos/sample-album.md` file points at Cloudinary `demo` cloud's sample public_ids, so images won't actually display unless `baseURL` in `nuxt.config.ts` is pointed at `demo` during development. Before shipping:
  1. Upload real photos to the `djrhjpihn` Cloudinary account under a folder like `dval-photos/<album-slug>/`.
  2. Populate `.env` with `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.
  3. Run `yarn cloudinary:list dval-photos/<album-slug>` and paste the output into a new `content/photos/<album-slug>.md`.
  4. Either delete `content/photos/sample-album.md` or replace its contents with a real album.
  5. Commit.

- Future work (per spec section 16):
  - If authoring grows tedious, extend the script to scaffold a full markdown file (combining folder listing + frontmatter skeleton).
  - If a single album exceeds ~200 photos, consider infinite scroll.
  - The data model supports future layout changes (justified rows, hero layout, etc.) without schema changes.
