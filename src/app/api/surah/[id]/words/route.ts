
import { NextRequest, NextResponse } from 'next/server';
import { getQuranClient } from '@/lib/quranClient';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

const PER_PAGE = 50;
// Mishary Rashid al-Afasy — used as timing reference for word segment proportional scaling
const TIMING_RECITATION_ID = '7';

function stripHtml(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const surahNumber = Number(id);

  if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json({ error: 'Invalid surah number' }, { status: 400 });
  }

  try {
    const quranClient = getQuranClient();

    // Get chapter verse count + first pages in parallel
    const [chapter, firstVersePage, firstAudioPage] = await Promise.all([
      quranClient.chapters.findById(surahNumber as never),
      quranClient.verses.findByChapter(surahNumber as never, {
        words: true,
        perPage: PER_PAGE,
        page: 1,
      } as never),
      quranClient.audio.findVerseRecitationsByChapter(
        surahNumber as never,
        TIMING_RECITATION_ID,
        { fields: { segments: true }, page: 1, perPage: PER_PAGE } as never
      ),
    ]);

    const totalPages = Math.ceil((chapter.versesCount as number) / PER_PAGE);
    const remainingNums = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

    // Fetch remaining pages in parallel
    const [remainingVersePages, remainingAudioPages] = totalPages > 1
      ? await Promise.all([
          Promise.all(remainingNums.map(page =>
            quranClient.verses.findByChapter(surahNumber as never, {
              words: true,
              perPage: PER_PAGE,
              page,
            } as never)
          )),
          Promise.all(remainingNums.map(page =>
            quranClient.audio.findVerseRecitationsByChapter(
              surahNumber as never,
              TIMING_RECITATION_ID,
              { fields: { segments: true }, page, perPage: PER_PAGE } as never
            )
          )),
        ])
      : [[], []];

    const allVerses: any[] = [firstVersePage as any[], ...(remainingVersePages as any[][])].flat();
    const allAudioFiles: any[] = [
      (firstAudioPage as any)?.audioFiles ?? [],
      ...(remainingAudioPages as any[]).map((p: any) => p?.audioFiles ?? []),
    ].flat();

    // Build segment lookup: verseKey → [[wordFrom, wordTo, timeFrom, timeTo], ...]
    // Times are in ms relative to the start of each verse's audio (used for proportional scaling)
    const segments: Record<string, [number, number, number, number][]> = {};
    for (const af of allAudioFiles) {
      if (af?.verseKey && Array.isArray(af.segments) && af.segments.length > 0) {
        segments[af.verseKey] = af.segments;
      }
    }

    // Build word text + translation lookup: verseKey → string[]
    const words: Record<string, string[]> = {};
    const translations: Record<string, string[]> = {};
    for (const verse of allVerses) {
      if (!verse) continue;
      const verseKey: string = verse.verseKey ?? `${surahNumber}:${verse.verseNumber}`;
      // Only include actual spoken words (skip verse-end markers, pause signs, etc.)
      const wordItems: any[] = (verse.words ?? []).filter(
        (w: any) => w.charTypeName === 'word'
      );
      if (wordItems.length > 0) {
        words[verseKey] = wordItems.map((w: any) => w.textUthmani ?? w.text ?? '');
        translations[verseKey] = wordItems.map((w: any) =>
          stripHtml(w.translation?.text ?? '')
        );
      }
    }

    return NextResponse.json({ words, translations, segments });
  } catch (error) {
    console.error(`[/api/surah/${id}/words]`, error);
    return NextResponse.json({ words: {}, translations: {}, segments: {} });
  }
}
