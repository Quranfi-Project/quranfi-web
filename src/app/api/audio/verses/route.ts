import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const surah = request.nextUrl.searchParams.get('surah');
  const readId = request.nextUrl.searchParams.get('readId');

  if (!surah || !readId) {
    return NextResponse.json({}, { status: 400 });
  }

  const response = await fetch(
    `https://mp3quran.net/api/v3/ayat_timing?surah=${surah}&read=${readId}`
  );
  const timings: Array<{
    ayah: number;
    start_time: number;
    end_time: number;
  }> = await response.json();

  const result: Record<string, { startTime: number; endTime: number }> = {};
  const surahNum = parseInt(surah);
  for (const t of timings) {
    if (t.ayah > 0) {
      result[`${surahNum}:${t.ayah}`] = {
        startTime: t.start_time,
        endTime: t.end_time,
      };
    }
  }
  return NextResponse.json(result);
}
