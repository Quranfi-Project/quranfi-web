# API Documentation

This document covers every external API and data source Quranfi uses.

---

## 1. Quran Foundation API

**SDK:** [`@quranjs/api`](https://www.npmjs.com/package/@quranjs/api)
**Base URL:** `https://api.quran.com/api/v4` (managed automatically by the SDK)
**Auth:** OAuth2 client credentials (`QURAN_CLIENT_ID` + `QURAN_CLIENT_SECRET`)
**Used in:** server-side only via `src/lib/quranClient.ts`

This is the primary source for all Quran text (Arabic and English) and chapter metadata.

### Endpoints used

#### List all chapters
```
client.chapters.findAll()
```
Returns metadata for all 114 surahs. Fields used:
| Field | Description |
|---|---|
| `id` | Surah number (1–114) |
| `nameSimple` | Transliterated name (e.g. `Al-Fatihah`) |
| `nameArabic` | Arabic name (e.g. `الفاتحة`) |
| `translatedName.name` | English meaning (e.g. `The Opener`) |
| `versesCount` | Number of ayahs |
| `revelationPlace` | `"makkah"` or `"madinah"` |

#### Get single chapter
```
client.chapters.findById(surahNumber)
```
Same fields as above, for one surah.

#### Get verses for a chapter
```
client.verses.findByChapter(surahNumber, {
  fields: { textUthmani: true },
  translations: [20],
  words: false,
  perPage: 50,
  page: N,
})
```
Fetched page-by-page (50 verses per page) and merged. Fields used:
| Field | Description |
|---|---|
| `id` | Global ayah number (1–6236) |
| `verseNumber` | Ayah number within the surah |
| `textUthmani` | Arabic text (Uthmani script) |
| `translations[0].text` | English translation (HTML — stripped before use) |

**Translation ID 20** = Saheeh International (en.sahih)

### Notes
- The client is initialized once as a singleton in `src/lib/quranClient.ts`
- Never import `quranClient` from a `'use client'` component — server only
- `revelationPlace` returns `"makkah"` / `"madinah"` (not `"meccan"` / `"medinan"`)

---

## 2. mp3quran.net API v3

**Base URL:** `https://mp3quran.net/api/v3`
**Auth:** None (public API)
**Used in:** `src/app/api/reciters/route.ts`, `src/utils/api.ts`

Source for audio recitations and verse-level timestamps.

### Endpoints used

#### List reciters
```
GET https://mp3quran.net/api/v3/reciters?language=eng
```
Returns a list of reciters, each with one or more moshaf (recitation versions / rewayat).

Response shape (simplified):
```json
{
  "reciters": [
    {
      "id": 1,
      "name": "Abdul Basit Abdul Samad",
      "moshaf": [
        {
          "id": 5,
          "name": "Rewayat Hafs A'n Assem",
          "server": "https://server7.mp3quran.net/basit/",
          "surah_total": 114
        }
      ]
    }
  ]
}
```

The internal `/api/reciters` route flattens this into:
```json
{
  "5": {
    "name": "Abdul Basit Abdul Samad — Rewayat Hafs A'n Assem",
    "folderUrl": "https://server7.mp3quran.net/basit/"
  }
}
```

The map key (`"5"` above) is the **moshaf ID**, which doubles as the `readId` for verse timing lookups.

#### Verse timings
```
GET https://mp3quran.net/api/v3/ayat_timing?surah={surahId}&read={readId}
```
Returns per-verse start/end timestamps (milliseconds) for a given surah + reciter.

Response shape:
```json
[
  { "ayah": 1, "start_time": 0, "end_time": 3520 },
  { "ayah": 2, "start_time": 3520, "end_time": 9100 }
]
```

Normalized to:
```json
{
  "1:1": { "startTime": 0, "endTime": 3520 },
  "1:2": { "startTime": 3520, "endTime": 9100 }
}
```

Key format: `"{surahId}:{verseNumber}"`

#### Audio file URL
Audio files are not fetched via API — the URL is constructed directly:
```
{folderUrl}{surahNumber padded to 3 digits}.mp3
```
Example: `https://server7.mp3quran.net/basit/001.mp3`

Utility: `getChapterAudioUrl(folderUrl, surahNumber)` in `src/utils/api.ts`

---

## 3. AlQuran Cloud API

**Base URL:** `https://api.alquran.cloud/v1`
**Auth:** None (public API)
**Used in:** `src/utils/api.ts` → `fetchQuranPage()`

Used for page-based Quran reading (Madina Mushaf layout, 604 pages).

### Endpoints used

#### Get Quran page
```
GET https://api.alquran.cloud/v1/page/{pageNumber}/quran-uthmani
```
Returns all ayahs on a given mushaf page with Uthmani Arabic text and surah metadata.

Response shape (simplified):
```json
{
  "data": {
    "number": 1,
    "ayahs": [
      {
        "number": 1,
        "text": "بِسۡمِ ٱللَّهِ...",
        "numberInSurah": 1,
        "surah": {
          "number": 1,
          "name": "سُورَةُ ٱلْفَاتِحَةِ",
          "englishName": "Al-Faatiha",
          "englishNameTranslation": "The Opening",
          "numberOfAyahs": 7
        }
      }
    ]
  }
}
```

Pages range from 1 to 604.

---

## Internal API Routes

These are Next.js route handlers in `src/app/api/` that proxy external APIs and keep secrets server-side.

| Route | Method | Description |
|---|---|---|
| `/api/surahs` | GET | All 114 chapters (Quran Foundation API) |
| `/api/surah/:id` | GET | Single chapter with all verses + translations |
| `/api/reciters` | GET | Flattened reciter/moshaf list (mp3quran.net) |

All three are `force-static` — generated at build time and cached.

Client components call these internal routes via helper functions in `src/utils/api.ts`:
- `fetchSurahs()` → `GET /api/surahs`
- `fetchSurah(id)` → `GET /api/surah/:id`
- `fetchReciters()` → `GET /api/reciters`
- `fetchVerseTimings(surahId, readId)` → calls mp3quran.net directly (public, no secrets)
- `fetchQuranPage(pageNumber)` → calls AlQuran Cloud directly (public, no secrets)
