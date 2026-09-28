# Architecture

All frontend source lives inside `front-end/`.

## Pages

Each page has its own directory under `front-end/pages/`. The current homepage entry point is `front-end/pages/home/index.html`. Static pages (home, login, signup, contribution, our-story) use plain HTML, CSS and vanilla JS. App pages under `front-end/pages/app/` mount React via a `*-main.tsx` entry file in `front-end/story/src/`.

## React application

`front-end/story/src/` contains the React sources:

- `components/` — shared components (`AppSidebar`, `AccountDropdown`) and the `ui/button` primitive
- `pages/` — page-level React components
- `settings/` — Settings section components and the typed localStorage preferences layer
- `data/` — frontend mock/data-layer code (`artworks.ts`, `collections.ts`)
- `types/` — shared TypeScript types
- `lib/` — utilities (`cn`)

Shared build setup (`package.json`, `vite.config.ts`, `tsconfig.json`) sits at the repository root; Vite's `root` points at `front-end/`.

## CSS

Base styles define the reset, variables, typography context, and global layout. Components contain reusable navigation and search rules. Page styles contain the homepage composition. Utilities contain shared animation behavior.

## JavaScript

`front-end/js/core/main.js` is the browser entry module and owns shared reveal behavior. `front-end/js/core/navigation.js` owns shared navigation/search behavior. `front-end/js/pages/home.js` owns homepage scroll motion and intro state.

## Assets and Data

Images are grouped under `front-end/assets/images/artworks/`, `front-end/assets/images/posters/`, and `front-end/assets/images/story/`. Artwork metadata belongs in `front-end/data/artworks.js` (currently a placeholder reserved for backend integration) and `front-end/story/src/data/artworks.ts` for the React app.

## Scaling

New pages should add a page folder, page stylesheet, and page module only when needed. Shared behavior should remain in `front-end/js/core/`, reusable styles in component/base/utility layers, and content metadata in `front-end/data/`.