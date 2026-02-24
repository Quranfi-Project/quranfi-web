// src/utils/api.ts
import axios from 'axios';

// Fetch all Surahs — Quran Foundation API only (via internal route)
export const fetchSurahs = async () => {
  const response = await axios.get('/api/surahs');
  return response.data;
};

// Fetch a specific Surah — Quran Foundation API only (via internal route)
export const fetchSurah = async (surahNumber: number) => {
  const response = await axios.get(`/api/surah/${surahNumber}`);
  return response.data;
};

// Fetch reciters — mp3quran.net (reads with timing data)
// Returns { [readId]: { name, folderUrl } }
export const fetchReciters = async (): Promise<Record<string, { name: string; folderUrl: string }>> => {
  const response = await axios.get('/api/reciters');
  return response.data;
};

// Fetch verse timings — calls mp3quran.net directly (public API, works in static/Capacitor builds)
export const fetchVerseTimings = async (
  surahId: number,
  readId: string
): Promise<Record<string, { startTime: number; endTime: number }>> => {
  const response = await axios.get(
    `https://mp3quran.net/api/v3/ayat_timing?surah=${surahId}&read=${readId}`
  );
  const timings: Array<{ ayah: number; start_time: number; end_time: number }> = response.data;
  const result: Record<string, { startTime: number; endTime: number }> = {};
  for (const t of timings) {
    if (t.ayah > 0) {
      result[`${surahId}:${t.ayah}`] = { startTime: t.start_time, endTime: t.end_time };
    }
  }
  return result;
};

// Construct chapter audio URL from folder URL — e.g. "https://server10.mp3quran.net/ajm/001.mp3"
export const getChapterAudioUrl = (folderUrl: string, surahNumber: number): string => {
  return `${folderUrl}${surahNumber.toString().padStart(3, '0')}.mp3`;
};

// Page-based Quran reading (Madina Mushaf, 604 pages)
export type QuranPageAyah = {
  number: number;       // global ayah number
  text: string;         // Uthmani Arabic text
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
  };
};

export type QuranPageData = {
  pageNumber: number;
  ayahs: QuranPageAyah[];
};

export const fetchQuranPage = async (pageNumber: number): Promise<QuranPageData> => {
  const response = await axios.get(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
  const data = response.data.data;
  return {
    pageNumber: data.number,
    ayahs: data.ayahs.map((a: any) => ({
      number: a.number,
      text: a.text,
      numberInSurah: a.numberInSurah,
      surah: {
        number: a.surah.number,
        name: a.surah.name,
        englishName: a.surah.englishName,
        englishNameTranslation: a.surah.englishNameTranslation,
        numberOfAyahs: a.surah.numberOfAyahs,
      },
    })),
  };
};
