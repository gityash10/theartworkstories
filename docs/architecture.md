# Architecture

## Pages

Each page has its own directory under `pages/`. The current homepage entry point is `pages/home/index.html`.

## CSS

Base styles define the reset, variables, typography context, and global layout. Components contain reusable navigation and search rules. Page styles contain the homepage composition. Utilities contain shared animation behavior.

## JavaScript

`js/core/main.js` is the browser entry module and owns shared reveal behavior. `js/core/navigation.js` owns shared navigation/search behavior. `js/pages/home.js` owns homepage scroll motion and intro state.

## Assets and Data

Images are grouped under `assets/images/artworks/` and `assets/images/posters/`. Artwork metadata belongs in `data/artworks.js` and can be expanded as page content is introduced.

## Scaling

New pages should add a page folder, page stylesheet, and page module only when needed. Shared behavior should remain in `js/core/`, reusable styles in component/base/utility layers, and content metadata in `data/`.