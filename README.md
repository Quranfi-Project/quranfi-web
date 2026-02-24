# Quranfi

Quranfi is a modern web app for reading and listening to the Quran with English translations. Built with Next.js 15, TypeScript, and Tailwind CSS v4.

**Live:** [quranfi.xyz](https://quranfi.xyz) · [quranfi-web.vercel.app](https://quranfi-web.vercel.app)

## Features

- Browse all 114 surahs with Arabic names, English transliterations, and translations
- Filter surahs by revelation type (Meccan / Medinan)
- Read individual surahs in verse-by-verse or reading (continuous) mode
- Listen to full-chapter audio with 300+ reciters and rewayat
- Verse-level seek — click any verse to jump directly to it in the audio
- Adjustable Arabic font size
- Bookmark verses (stored locally)
- Dark mode
- Android app via Capacitor

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |
| Mobile | Capacitor (Android) |

## Getting Started

```sh
git clone https://github.com/EasyCanadianGamer/quranfi-web.git
cd quranfi-web
npm install
```

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```sh
cp .env.local.example .env.local
```

Required environment variables:

```
QURAN_CLIENT_ID=       # Quran Foundation API client ID
QURAN_CLIENT_SECRET=   # Quran Foundation API client secret
```

Start the dev server:

```sh
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run build:capacitor` | Build for Android (targets Vercel deployment) |
| `npm run start` | Run production build locally |
| `npm run lint` | Lint |

## Project Structure

```
src/
  app/              # Next.js App Router pages + API routes
    api/
      surahs/       # GET /api/surahs — chapter list
      surah/[id]/   # GET /api/surah/:id — chapter + verses
      reciters/     # GET /api/reciters — reciter list
  components/       # React client components
  lib/              # Server-side utilities (quranClient)
  utils/            # Shared helpers + API fetch functions
  css/              # Arabic font styles
```

## APIs

See [docs/api.md](docs/api.md) for full documentation on every external API used.

## License

MIT
