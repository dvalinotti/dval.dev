# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog for Dan Valinotti at dval.dev. Built with Nuxt 3 (Vue 3) and statically generated.

## Commands

- `yarn dev` — dev server with hot reload at localhost:3000
- `yarn build` — production build
- `yarn generate` — generate static site
- `yarn preview` — preview generated site
- `yarn lint` — run ESLint

## Architecture

- **Framework**: Nuxt 3 (Vue 3) with static generation via `nuxi generate`
- **Language**: TypeScript with `<script setup lang="ts">` throughout
- **Content**: Blog posts and project pages are Markdown files in `content/` managed by `@nuxt/content` v3. Collections defined in `content.config.ts`. Content queried via `queryCollection()`.
- **Styling**: TailwindCSS (with `@tailwindcss/typography` plugin, dark mode via `class` strategy) + SCSS variables in `assets/scss/variables.scss`
- **Components**: Auto-imported (Nuxt 3 default). FontAwesome icons use the `<Fa>` component name (registered via `plugins/fontawesome.ts`).
- **Pages**: `pages/blog/[slug].vue` renders individual blog posts, `pages/blog/tags/[slug].vue` handles tag filtering. `pages/projects.vue` lists projects from `content/projects/`.
- **Analytics**: Plausible.io (via `@nuxtjs/plausible` module)
- **PWA**: Enabled via `@vite-pwa/nuxt`
- **Images**: `@nuxt/image` with `<NuxtPicture>` components
- **Sitemap**: Auto-generated via `@nuxtjs/sitemap`
