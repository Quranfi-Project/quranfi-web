import { NextResponse } from 'next/server';


export const dynamic = 'force-static';

export async function GET() {
  const response = await fetch('https://mp3quran.net/api/v3/reciters?language=eng');
  const data: {
    reciters: Array<{
      id: number;
      name: string;
      moshaf: Array<{
        id: number;
        name: string;
        server: string;
        surah_total: number;
      }>;
    }>;
  } = await response.json();

  const result: Record<string, { name: string; folderUrl: string }> = {};
  for (const reciter of data.reciters) {
    for (const moshaf of reciter.moshaf) {
      result[String(moshaf.id)] = {
        name: `${reciter.name} — ${moshaf.name}`,
        folderUrl: moshaf.server,
      };
    }
  }
  return NextResponse.json(result);
}
