# The ArtWork Stories

A living archive of human-made art — discover the stories behind what people create.

Every artwork carries something with it: a moment, a memory, an idea. The ArtWork
Stories is a community platform for sharing those stories — explore artworks and
collections, share your own work, and follow the people and moments behind the art.

## ✨ Features

- **Discover** — browse artworks and community stories
- **Explore** — find art by discipline: painting, photography, sculpture, film, poetry
- **Collections** — organize artworks into personal or shared collections
- **Share an Artwork** — publish your own work, or credit someone else's with its source
- **Profile** — your artworks, liked pieces, activity, and personal collections
- **Settings** — account, privacy, notifications, appearance, connected accounts,
  data & storage, security, and help

## 🧱 Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — multi-page build with one HTML entry per route
- [Tailwind CSS 4](https://tailwindcss.com/) + hand-written CSS design system
- [Lucide](https://lucide.dev/) icons
- Static pages (home, login, signup, contribution, our-story) use plain HTML/CSS/JS;
  app pages mount React via per-page entry files

## 📁 Project Structure

```
├── front-end/            # All frontend source
│   ├── pages/            # One folder per route, each with index.html
│   │   ├── home/         #   static landing page
│   │   ├── login/ signup/ contribution/ our-story/
│   │   └── app/          #   React app pages (discover, collections, profile, …)
│   ├── story/src/        # React sources
│   │   ├── components/   #   shared components + ui primitives
│   │   ├── pages/        #   page-level components
│   │   ├── settings/     #   settings section + preferences layer
│   │   ├── data/         #   frontend mock/data layer
│   │   ├── types/        #   shared TypeScript types
│   │   └── lib/          #   utilities
│   ├── assets/           # images (artworks, posters, story)
│   ├── css/              # static-page stylesheets (base/components/pages/utilities)
│   ├── js/               # static-page scripts
│   └── data/             # shared content metadata placeholder
├── docs/                 # architecture & design-system notes
├── vite.config.ts        # Vite root points at front-end/
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ (tested on 22)
- npm

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
```

Starts Vite at `http://localhost:5173`. Pages are served from `front-end/`, e.g.
`http://localhost:5173/pages/home/index.html`.

### Build & Preview

```bash
npm run build     # production build → front-end/dist/
npm run preview   # serve the production build locally
```

### Type Check

```bash
npm run typecheck
```

## 🗺️ Pages

| Route | Path |
| --- | --- |
| Home | `/pages/home/index.html` |
| Login / Signup | `/pages/login/index.html` · `/pages/signup/index.html` |
| Our Story / Contribute | `/pages/our-story/index.html` · `/pages/contribution/index.html` |
| Discover / Explore | `/pages/app/discover/index.html` · `/pages/app/explore/index.html` |
| Stories / Story of the Week | `/pages/app/stories/index.html` · `/pages/app/story-of-week/index.html` |
| Artists / Creators | `/pages/app/artists/index.html` · `/pages/app/creators/index.html` |
| Collections | `/pages/app/collections/index.html` · `/pages/app/collection/index.html` |
| My Collections / Create | `/pages/app/my-collections/index.html` · `/pages/app/create/index.html` |
| Notifications | `/pages/app/notifications/index.html` |
| Profile | `/pages/app/profile/index.html` |
| Settings | `/pages/app/settings/<section>/index.html` |

## 🤝 Contributing

1. Create a branch for your change
2. Run `npm run typecheck` and `npm run build` before pushing
3. Keep formatting consistent — Prettier is used for `front-end/story/src/`

## 📄 License

All rights reserved. Artwork images belong to their respective creators.
