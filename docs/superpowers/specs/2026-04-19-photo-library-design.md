# Photo Library — Design Spec

**Date:** 2026-04-19
**Author:** Dan Valinotti (w/ Claude brainstorm)
**Status:** Approved, ready for implementation planning

## 1. Purpose

Add a photo library to dval.dev where visitors can browse Dan's amateur photography, organized into albums. Avoid third-party "cloud sharing" platforms (Flickr, Google Photos); keep image hosting under Dan's control and the album/metadata source of truth in the repo.

## 2. Requirements

Functional:
- A new top-level nav item "Photos" between "Experience" and "Contact", linking to `/photos`.
- `/photos` lists all albums as a uniform 3-column grid of cover images with title + year + photo count.
- On `/photos`, an inline toggle switches between "Albums" and "All photos" (all photos across all albums in one masonry grid). View state is reflected in the URL as `?view=all` for shareability and back-button support.
- `/photos/[slug]` shows a single album: title, description, date, and a CSS-columns masonry grid of the album's photos (preserves native aspect ratios).
- Clicking any photo opens a PhotoSwipe v5 lightbox that supports:
  - Pinch-to-zoom (touch).
  - Click (or double-tap) to toggle zoom on the fullscreen image.
  - Prev/next via on-screen buttons and left/right arrow keys.
  - Swipe navigation (touch) and swipe-down-to-close.
  - ESC to close.
  - Caption display (album title + optional per-photo caption).

Non-functional:
- Static site builds must still succeed via `yarn generate`.
- Must not bloat the git repo (images are not committed).
- Data model must be portable — a future migration off Cloudinary to self-hosted images should be a provider swap, not a rewrite.
- Matches existing site conventions: Nuxt 3 + `<script setup lang="ts">`, TailwindCSS + SCSS variables, auto-imported components, dark-mode via `class` strategy, `@nuxt/content` v3 for content, `@nuxt/image` with `<NuxtPicture>` for images.

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│ content/photos/*.md (source of truth for albums)    │
└────────────────┬────────────────────────────────────┘
                 │ queryCollection('photos')
                 ▼
┌─────────────────────────────────────────────────────┐
│ pages/photos/index.vue   pages/photos/[slug].vue    │
│   ViewToggle               PhotoGrid (masonry)       │
│   AlbumCard grid            → LightboxTrigger        │
│   or PhotoGrid (all)           → useLightbox()       │
└────────────────┬────────────────────────────────────┘
                 │ <NuxtPicture provider="cloudinary">
                 ▼
┌─────────────────────────────────────────────────────┐
│ @nuxt/image → Cloudinary (delivery)                 │
│ (cloud: djrhjpihn, transforms: f_auto,q_auto)       │
└─────────────────────────────────────────────────────┘
```

Image *authoring* flow (one-time per album, out-of-band from runtime):
```
User uploads JPEGs → Cloudinary folder
   ↓
scripts/list-cloudinary-folder.ts (Admin API)
   ↓
YAML block → paste into content/photos/<slug>.md
   ↓
git commit, deploy, static rebuild
```

## 4. Routes

| Route | File | Purpose |
|---|---|---|
| `/photos` (or `/photos?view=all`) | `pages/photos/index.vue` | Album index with inline view toggle |
| `/photos/[slug]` | `pages/photos/[slug].vue` | Single album detail |

The `?view=all` query param controls the inline toggle state. The Nuxt router does not re-render the page for a query change, so the toggle is reactive via `useRoute().query`.

## 5. Components (new)

| Component | Purpose | Depends on |
|---|---|---|
| `AlbumCard.vue` | Single album tile on `/photos`: cover image + title + year + photo count | `<NuxtPicture>` |
| `PhotoGrid.vue` | CSS-columns masonry grid. Takes `photos: Photo[]` and emits click-at-index. Used on album detail + all-photos view. | `<NuxtPicture>`, `useLightbox` |
| `ViewToggle.vue` | Segmented control ("Albums" / "All photos"); reads/writes `?view=` in the URL | `useRoute`, `useRouter` |

### `useLightbox.ts` composable

```ts
// composables/useLightbox.ts
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

type Photo = { src: string; width: number; height: number; alt: string; caption?: string }

export function useLightbox(photos: Ref<Photo[]>) {
  let lightbox: PhotoSwipeLightbox | null = null

  onMounted(() => {
    lightbox = new PhotoSwipeLightbox({
      dataSource: photos.value.map(p => ({
        src: p.src,
        width: p.width,
        height: p.height,
        alt: p.alt,
      })),
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()
  })

  onBeforeUnmount(() => {
    lightbox?.destroy()
    lightbox = null
  })

  return {
    open: (index: number) => lightbox?.loadAndOpen(index),
  }
}
```

The caller (`PhotoGrid.vue`) is responsible for mapping schema photos (`{ publicId, alt, width, height, caption? }`) into the `Photo` shape above — specifically, building `src` from `publicId` via a helper:

```ts
// utils/cloudinary.ts
export function cloudinaryUrl(publicId: string, transform = 'w_2500,c_limit,f_auto,q_auto') {
  return `https://res.cloudinary.com/djrhjpihn/image/upload/${transform}/${publicId}`
}
```

`width` and `height` passed to PhotoSwipe are the **native** dimensions from the markdown. PhotoSwipe uses them to compute pinch-zoom bounds and prevent layout shift. Cloudinary's `c_limit` transform won't upscale, so if the native image is smaller than 2500px on the long edge, PhotoSwipe still gets correct proportions.

The composable takes a snapshot of `photos.value` at mount; if the photo list changes after mount (which shouldn't happen for static content), the lightbox won't auto-update. Acceptable for this use case.

## 6. Content Schema

Added to `content.config.ts`:

```ts
photos: defineCollection({
  type: 'page',
  source: 'photos/**',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),  // 'YYYY-MM' or 'YYYY-MM-DD'; lexicographic sort = chronological
    position: z.number(),             // manual album ordering (asc)
    coverImage: z.string(),           // Cloudinary public_id, required
    photos: z.array(z.object({
      publicId: z.string(),           // Cloudinary public_id
      alt: z.string(),                // accessibility, required
      width: z.number(),              // native width of source on Cloudinary
      height: z.number(),             // native height
      caption: z.string().optional(), // optional per-photo note
    })),
  }),
})
```

Example `content/photos/iceland.md`:

```md
---
title: Iceland
description: A week chasing waterfalls and weather.
date: '2024-08'
position: 1
coverImage: dval-photos/iceland/iceland-reykjavik-001
photos:
  - publicId: dval-photos/iceland/iceland-reykjavik-001
    alt: Fog rolling over a cliff outside Reykjavik
    width: 5472
    height: 3648
  - publicId: dval-photos/iceland/iceland-goldencircle-015
    alt: Waterfall at Gullfoss
    width: 5472
    height: 3648
    caption: Third attempt before the rain stopped.
---
```

## 7. Data Flow

### `/photos` (index)

```ts
const { data: albums } = await useAsyncData('photos', () =>
  queryCollection('photos').order('position', 'ASC').all()
)
const route = useRoute()
const view = computed(() => route.query.view === 'all' ? 'all' : 'albums')

const allPhotos = computed(() => {
  // reverse-chron by album date; within an album, preserve authored order
  return [...albums.value]
    .sort((a, b) => b.date.localeCompare(a.date))
    .flatMap(album =>
      album.photos.map(p => ({ ...p, albumTitle: album.title, albumPath: album.path }))
    )
})
```

> Note: `album.path` is the field `@nuxt/content` v3 exposes for a page's route path. Verify the exact field name during implementation — depending on the v3 release it may be `path`, `_path`, or similar. This is a one-line fix and does not affect the schema.

Template toggles between `<div v-if="view === 'albums'"><AlbumCard .../>…</div>` and `<PhotoGrid v-else :photos="allPhotos" />`.

### `/photos/[slug]`

```ts
const route = useRoute()
const { data: album } = await useAsyncData(`photo-${route.params.slug}`, () =>
  queryCollection('photos').path(`/photos/${route.params.slug}`).first()
)
```

## 8. Image Pipeline (`@nuxt/image` + Cloudinary)

`nuxt.config.ts`:

```ts
image: {
  cloudinary: {
    baseURL: 'https://res.cloudinary.com/djrhjpihn/image/upload/'
  },
  provider: 'cloudinary',
}
```

Cloudinary-side: enable `f_auto,q_auto` as account defaults (Console → Settings → Optimization). No per-image transform config needed in the site.

With `provider: 'cloudinary'` set globally, all `<NuxtPicture>` / `<NuxtImg>` usages default to Cloudinary and don't need the attribute per call:

```vue
<NuxtPicture
  :src="photo.publicId"
  :alt="photo.alt"
  :width="400"
  :height="300"
  sizes="sm:100vw md:50vw lg:33vw"
  loading="lazy"
/>
```

For PhotoSwipe's full-screen image, build the URL directly with a size cap:
```ts
`https://res.cloudinary.com/djrhjpihn/image/upload/w_2500,c_limit/${publicId}`
```
(Can also be a helper function.)

## 9. Lightbox (PhotoSwipe v5)

- Add `photoswipe` to dependencies.
- Dynamic import inside the composable so the ~37KB gzipped bundle only loads when needed.
- Captions: built by concatenating `album.title` + (`photo.caption` if present) when constructing `dataSource`.
- PhotoSwipe handles out of the box: pinch-zoom, double-tap zoom, click-to-zoom, mousewheel zoom, keyboard left/right/esc, swipe nav, swipe-down-close, prev/next buttons.
- No custom styling beyond what PhotoSwipe ships. If visual integration tweaks are needed (dark mode match, font), those are one small SCSS file.

## 10. Navigation Update

`layouts/default.vue:24` — insert between Experience and Contact:

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

## 11. Authoring Workflow (per new album)

Primary flow (recommended):

1. **Upload to Cloudinary.** Upload the JPEGs into a folder (e.g., `dval-photos/<album-slug>/`) via the Cloudinary web UI or CLI.
2. **Scaffold the album.** Run:
   ```
   yarn album:scaffold dval-photos/<album-slug>
   ```
   `scripts/scaffold-album.ts` hits Cloudinary's Admin API, interactively prompts for `title`, `description`, `date`, `position`, and cover-image selection, then writes `content/photos/<slug>.md` with the full frontmatter and photos list pre-populated (all `alt` fields blank). `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` live in a gitignored `.env`.
3. **Fill in alts + optional captions.** Open the generated file, add an `alt` string for each photo (required for accessibility), and add `caption:` lines on any notable shots.
4. **Commit + deploy.** Push; static rebuild picks it up.

Low-level alternative:

- `yarn cloudinary:list dval-photos/<album-slug>` prints just the YAML photo block (no frontmatter, no prompts) if you want to paste into an existing file or do something custom.

## 12. Portability

Migrating off Cloudinary to self-hosted images later:
- Change provider in `nuxt.config.ts` (`ipx` for self-hosted, or any other `@nuxt/image` provider). Call sites using `<NuxtPicture>` don't change.
- Update the lightbox helper that builds the full-size URL (one function).
- Update public_ids in `content/photos/*.md` if paths change (search and replace).
- Nothing about Cloudinary's folder structure or Admin API leaks into runtime code — it's used only *at authoring time* to generate the YAML blocks.

The markdown is vendor-neutral. The `publicId` field is effectively "identifier within the configured image provider", not "Cloudinary public_id".

## 13. Error / Empty States

- **Empty album** (`photos: []`): render "No photos in this album yet." No special-case log/warning.
- **Missing album slug** (bad URL): default Nuxt 404 via the existing `error.vue`.
- **Broken image URL**: `<NuxtPicture>` renders a broken `<img>`; no client-side retry/fallback.

## 14. Testing & Verification

Repo has no test suite today. Verification plan:
1. `yarn lint` — clean.
2. `yarn dev` — manually verify each route:
   - `/photos` index renders album grid; view toggle switches to all-photos masonry; URL updates to `?view=all` and back; back button works.
   - `/photos/<slug>` renders album title/desc/masonry.
   - Click any photo → PhotoSwipe opens at correct index.
   - Keyboard left/right navigates; ESC closes.
   - Pinch-zoom on mobile emulator works.
   - Dark mode: grids, captions, toggle all render correctly.
3. `yarn generate` — static build completes, output contains pages for every album slug.

No new test framework introduced.

## 15. Out of Scope (for this version)

- EXIF display (camera/lens/settings).
- Per-photo location, date, or tags.
- Photo search or tag filtering.
- Infinite scroll / paging within albums or the all-photos view (300 photos is fine to lazy-load at once).
- Upload widget on the site itself (authoring stays CLI + markdown).
- Self-hosted image pipeline (deferred; design supports swapping to it later).

## 16. Open Questions / Future Work

- If adding albums becomes tedious after 3–5 rounds, consider a CLI that scaffolds the full markdown from a Cloudinary folder in one command (combining steps 2 and 3 of the workflow).
- If the "all photos" view grows to 1000+ photos, revisit whether infinite scroll is needed.
- Revisit layout (B was chosen for CSS-only simplicity; future reshuffle to justified rows or hero layout remains possible — the data model doesn't constrain layout).

## 17. Files Touched (expected)

**New:**
- `pages/photos/index.vue`
- `pages/photos/[slug].vue`
- `components/AlbumCard.vue`
- `components/PhotoGrid.vue`
- `components/ViewToggle.vue`
- `composables/useLightbox.ts`
- `scripts/list-cloudinary-folder.ts`
- `content/photos/` (directory, initially empty or with one sample album)
- `.env.example` (documenting Cloudinary Admin API vars)

**Modified:**
- `content.config.ts` — add `photos` collection
- `nuxt.config.ts` — add Cloudinary provider config
- `layouts/default.vue` — add Photos nav item
- `package.json` — add `photoswipe`, `cloudinary` (Admin SDK for the script), `tsx` (or similar, to run the script); add `cloudinary:list` yarn script
- `.gitignore` — ensure `.env` is ignored (already is)
