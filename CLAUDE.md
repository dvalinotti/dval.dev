# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog for Dan Valinotti at dval.dev. Built with Nuxt 2 and statically generated.

## Commands

- `yarn dev` — dev server with hot reload at localhost:3000
- `yarn build` — production build
- `yarn generate` — generate static site
- `yarn lint` — run ESLint (JS and Vue files)

## Architecture

- **Framework**: Nuxt 2 (Vue 2) with `target: 'static'`
- **Content**: Blog posts and project pages are Markdown files in `content/` managed by `@nuxt/content`. Reading time is auto-calculated via a content hook in `nuxt.config.js`.
- **Styling**: TailwindCSS (with `@tailwindcss/typography` plugin, dark mode via `class` strategy) + SCSS variables in `assets/scss/variables.scss`
- **Components**: Auto-imported (Nuxt `components: true`). FontAwesome icons use the `<Fa>` component name.
- **Pages**: `pages/blog/_slug.vue` renders individual blog posts, `pages/blog/tags/` handles tag filtering. `pages/projects.vue` lists projects from `content/projects/`.
- **Analytics**: Plausible.io (via `vue-plausible` module)
- **PWA**: Enabled via `@nuxtjs/pwa`
