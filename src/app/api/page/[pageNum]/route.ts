import { NextRequest, NextResponse } from 'next/server';
import { getQuranClient } from '@/lib/quranClient';

export const dynamic = 'force-dynamic';

const SAHEEH_INTERNATIONAL = 20;

function stripHtml(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageNum: string }> }
) {
  const { pageNum } = await params;
  const pageNumber = Number(pageNum);

  if (!pageNumber || pageNumber < 1 || pageNumber > 604) {
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
  }

  try {
    const quranClient = getQuranClient();

    const verses = await quranClient.verses.findByPage(pageNumber as never, {
      fields: { textUthmani: true, chapterId: true } as never,
      translations: [SAHEEH_INTERNATIONAL],
      words: false,
    });

    // Parse chapter number from verseKey ("1:1" → 1) as reliable fallback
    const getChapterNum = (v: (typeof verses)[0]) =>
      v.chapterId ?? Number(v.verseKey?.split(':')[0]);

    // Fetch unique chapter metadata for surah headers
    const chapterIds = [...new Set(verses.map(v => getChapterNum(v)).filter(Boolean))];
    const chapters = await Promise.all(
      chapterIds.map(id => quranClient.chapters.findById(id as never))
    );
    const chapterMap = Object.fromEntries(
      chapters.map(c => [c.id, { nameSimple: c.nameSimple, nameArabic: c.nameArabic }])
    );

    return NextResponse.json({
      pageNumber,
      verses: verses.map(v => {
        const chapterNum = getChapterNum(v);
        return {
          verseKey: v.verseKey,
          chapterNumber: chapterNum,
          verseNumber: v.verseNumber,
          arabic: v.textUthmani ?? '',
          translation: stripHtml(v.translations?.[0]?.text ?? ''),
          chapterName: chapterMap[chapterNum]?.nameSimple ?? '',
          chapterNameArabic: chapterMap[chapterNum]?.nameArabic ?? '',
        };
      }),
    });
  } catch (error) {
    console.error(`[/api/page/${pageNum}]`, error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
