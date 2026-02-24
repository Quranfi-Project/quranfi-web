
import { NextRequest, NextResponse } from 'next/server';
import quranClient from '@/lib/quranClient';

export const dynamic = 'force-dynamic';

const PER_PAGE = 50;
const SAHEEH_INTERNATIONAL = 20;

// Strip HTML tags from translation text (footnotes use <sup> etc.)
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
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
    // Fetch chapter metadata + first page of verses in parallel
    const [chapter, firstPage] = await Promise.all([
      quranClient.chapters.findById(surahNumber as never),
      quranClient.verses.findByChapter(surahNumber as never, {
        fields: { textUthmani: true },
        translations: [SAHEEH_INTERNATIONAL],
        words: false,
        perPage: PER_PAGE,
        page: 1,
      }),
    ]);

    // Fetch remaining pages in parallel if the surah has more than PER_PAGE verses
    const totalPages = Math.ceil(chapter.versesCount / PER_PAGE);
    let allVerses = [...firstPage];

    if (totalPages > 1) {
      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          quranClient.verses.findByChapter(surahNumber as never, {
            fields: { textUthmani: true },
            translations: [SAHEEH_INTERNATIONAL],
            words: false,
            perPage: PER_PAGE,
            page: i + 2,
          })
        )
      );
      allVerses = [...allVerses, ...remainingPages.flat()];
    }

    return NextResponse.json({
      surahNo: surahNumber,
      surahName: chapter.nameSimple,
      surahNameArabic: chapter.nameArabic,
      surahNameTranslation: chapter.translatedName?.name ?? '',
      numberOfAyahs: chapter.versesCount,
      revelationType: chapter.revelationPlace === 'meccan' ? 'Meccan' : 'Medinan',
      arabic1: allVerses.map((v) => v.textUthmani ?? ''),
      english: allVerses.map((v) => stripHtml(v.translations?.[0]?.text ?? '')),
      globalAyahNumbers: allVerses.map((v) => v.id),
    });
  } catch (error) {
    console.error(`[/api/surah/${id}]`, error);
    return NextResponse.json({ error: 'Failed to fetch surah' }, { status: 500 });
  }
}
