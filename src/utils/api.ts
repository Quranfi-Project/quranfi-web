// src/utils/api.ts
import axios from 'axios';

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';
const ALQURAN_CDN = 'https://cdn.islamic.network/quran/audio/128';
const ALQURAN_SURAH_CDN = 'https://cdn.islamic.network/quran/audio-surah/128';

// Old API (kept as fallback)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AUDIO_URL = process.env.NEXT_PUBLIC_API_AUDIO_URL;

// Fetch all Surahs — Al-Quran Cloud primary, old API fallback
export const fetchSurahs = async () => {
  try {
    const response = await axios.get(`${ALQURAN_BASE}/surah`);
    return response.data.data.map((s: any) => ({
      number: s.number,
      surahName: s.englishName,
      surahNameArabic: s.name,
      surahNameTranslation: s.englishNameTranslation,
      numberOfAyahs: s.numberOfAyahs,
      revelationType: s.revelationType,
    }));
  } catch {
    const response = await axios.get(`${BASE_URL}/surah.json`);
    return response.data.map((surah: any, index: number) => ({
      ...surah,
      number: index + 1,
    }));
  }
};

// Fetch a specific Surah — Al-Quran Cloud primary, old API fallback
export const fetchSurah = async (surahNumber: number) => {
  try {
    const response = await axios.get(
      `${ALQURAN_BASE}/surah/${surahNumber}/editions/quran-simple,en.sahih`
    );
    const editions = response.data.data;
    const arabicEdition = editions[0];
    const englishEdition = editions[1];
    return {
      surahNo: surahNumber,
      surahName: arabicEdition.englishName,
      surahNameArabic: arabicEdition.name,
      surahNameTranslation: arabicEdition.englishNameTranslation,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      revelationType: arabicEdition.revelationType,
      arabic1: arabicEdition.ayahs.map((a: any) => a.text),
      english: englishEdition.ayahs.map((a: any) => a.text),
      globalAyahNumbers: arabicEdition.ayahs.map((a: any) => a.number),
    };
  } catch {
    const response = await axios.get(`${BASE_URL}/${surahNumber}.json`);
    return {
      ...response.data,
      globalAyahNumbers: null,
    };
  }
};

// Fetch a specific Ayah
export const fetchAyah = async (surahNumber: number, ayahNumber: number) => {
  const response = await axios.get(`${BASE_URL}/${surahNumber}/${ayahNumber}.json`);
  return response.data;
};

// Fetch reciters — Al-Quran Cloud primary, old API fallback
export const fetchReciters = async (): Promise<{ [key: string]: string }> => {
  try {
    const response = await axios.get(
      `${ALQURAN_BASE}/edition?format=audio&language=ar&type=versebyverse`
    );
    const result: { [key: string]: string } = {};
    response.data.data.forEach((r: any) => {
      result[r.identifier] = r.englishName;
    });
    return result;
  } catch {
    const response = await axios.get(`${BASE_URL}/reciters.json`);
    return response.data;
  }
};

// Verse audio — returns primary (Al-Quran Cloud CDN) and fallback (old API) URLs
export const fetchVerseAudio = (
  reciterIdentifier: string,
  globalAyahNumber: number | null,
  surahNumber: number,
  ayahNumber: number
): { primary: string | null; fallback: string | null } => ({
  primary: globalAyahNumber != null
    ? `${ALQURAN_CDN}/${reciterIdentifier}/${globalAyahNumber}.mp3`
    : null,
  fallback: AUDIO_URL
    ? `${AUDIO_URL}/${reciterIdentifier}/${surahNumber}_${ayahNumber}.mp3`
    : null,
});

// Chapter audio — returns primary (Al-Quran Cloud CDN) and fallback (old API) URLs
export const getChapterAudioUrl = async (
  reciterIdentifier: string,
  surahNumber: number
): Promise<{ primary: string; fallback: string | null }> => {
  const primary = `${ALQURAN_SURAH_CDN}/${reciterIdentifier}/${surahNumber}.mp3`;
  let fallback: string | null = null;
  if (BASE_URL) {
    try {
      const response = await axios.get(`${BASE_URL}/audio/${surahNumber}.json`);
      const data = response.data;
      fallback = data[reciterIdentifier]?.originalUrl || data[reciterIdentifier]?.url || null;
    } catch {
      // no fallback available
    }
  }
  return { primary, fallback };
};

// Keep old fetchChapterAudio export for any other consumers
export const fetchChapterAudio = async (surahNumber: number) => {
  const response = await axios.get(`${BASE_URL}/audio/${surahNumber}.json`);
  return response.data;
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
  const response = await axios.get(`${ALQURAN_BASE}/page/${pageNumber}/quran-uthmani`);
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
