import { NextResponse } from 'next/server';
import { getQuranClient } from '@/lib/quranClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quranClient = getQuranClient();
    const chapters = await quranClient.chapters.findAll();
    const data = chapters.map((c) => ({
      number: c.id,
      surahName: c.nameSimple,
      surahNameArabic: c.nameArabic,
      surahNameTranslation: c.translatedName?.name ?? '',
      numberOfAyahs: c.versesCount,
      revelationType: c.revelationPlace === 'meccan' ? 'Meccan' : 'Medinan',
    }));
    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/surahs]', error);
    return NextResponse.json({ error: 'Failed to fetch surahs' }, { status: 500 });
  }
}
