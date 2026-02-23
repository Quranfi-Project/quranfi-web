// src/utils/api.ts
import axios from 'axios';

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';
const ALQURAN_CDN = 'https://cdn.islamic.network/quran/audio/128';
const ALQURAN_SURAH_CDN = 'https://cdn.islamic.network/quran/audio-surah/128';
const EVERYAYAH_CDN = 'https://everyayah.com/data';

// Old API (kept as fallback)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AUDIO_URL = process.env.NEXT_PUBLIC_API_AUDIO_URL;

// EveryAyah reciters not available on Al-Quran Cloud
// identifier format: "everyayah:{folder}"
const EVERYAYAH_RECITERS: { identifier: string; name: string }[] = [
  { identifier: 'everyayah:Abdul_Basit_Murattal_192kbps',           name: 'Abdul Basit Murattal' },
  { identifier: 'everyayah:Abdul_Basit_Mujawwad_128kbps',           name: 'Abdul Basit Mujawwad' },
  { identifier: 'everyayah:Minshawy_Murattal_128kbps',              name: 'Minshawy Murattal' },
  { identifier: 'everyayah:Minshawy_Mujawwad_192kbps',              name: 'Minshawy Mujawwad' },
  { identifier: 'everyayah:Ghamadi_40kbps',                         name: 'Ghamadi' },
  { identifier: 'everyayah:Mohammad_al_Tablaway_128kbps',           name: 'Mohammad Al-Tablaway' },
  { identifier: 'everyayah:Mustafa_Ismail_48kbps',                  name: 'Mustafa Ismail' },
  { identifier: 'everyayah:Husary_Muallim_128kbps',                 name: 'Husary (Muallim / Teaching)' },
  { identifier: 'everyayah:Khaalid_Abdullaah_al-Qahtaanee_192kbps', name: 'Khalid Al-Qahtani' },
  { identifier: 'everyayah:Yasser_Ad-Dussary_128kbps',              name: 'Yasser Ad-Dussary' },
  { identifier: 'everyayah:Nasser_Alqatami_128kbps',                name: 'Nasser Alqatami' },
  { identifier: 'everyayah:Salaah_AbdulRahman_Bukhatir_128kbps',   name: 'Salaah Bukhatir' },
  { identifier: 'everyayah:Muhsin_Al_Qasim_192kbps',               name: 'Muhsin Al-Qasim' },
  { identifier: 'everyayah:Abdullaah_3awwaad_Al-Juhaynee_128kbps', name: 'Abdullah Al-Juhaynee' },
  { identifier: 'everyayah:Salah_Al_Budair_128kbps',               name: 'Salah Al-Budair' },
  { identifier: 'everyayah:Abdullah_Matroud_128kbps',              name: 'Abdullah Matroud' },
  { identifier: 'everyayah:Muhammad_AbdulKareem_128kbps',          name: 'Muhammad AbdulKareem' },
  { identifier: 'everyayah:Ali_Jaber_64kbps',                      name: 'Ali Jaber' },
  { identifier: 'everyayah:Fares_Abbad_64kbps',                    name: 'Fares Abbad' },
  { identifier: 'everyayah:Akram_AlAlaqimy_128kbps',               name: 'Akram Al-Alaqimy' },
  { identifier: 'everyayah:Sahl_Yassin_128kbps',                   name: 'Sahl Yassin' },
  { identifier: 'everyayah:Yaser_Salamah_128kbps',                 name: 'Yaser Salamah' },
  { identifier: 'everyayah:Ahmed_Neana_128kbps',                   name: 'Ahmed Neana' },
  { identifier: 'everyayah:warsh/warsh_Abdul_Basit_128kbps',       name: 'Abdul Basit (Warsh)' },
  { identifier: 'everyayah:warsh/warsh_ibrahim_aldosary_128kbps',  name: 'Ibrahim Al-Dosary (Warsh)' },
];

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

// Fetch reciters — Al-Quran Cloud + EveryAyah merged, old API fallback
export const fetchReciters = async (): Promise<{ [key: string]: string }> => {
  let result: { [key: string]: string } = {};

  try {
    const response = await axios.get(
      `${ALQURAN_BASE}/edition?format=audio&language=ar&type=versebyverse`
    );
    response.data.data.forEach((r: any) => {
      result[r.identifier] = r.englishName;
    });
  } catch {
    const response = await axios.get(`${BASE_URL}/reciters.json`);
    result = response.data;
  }

  // Merge EveryAyah reciters
  EVERYAYAH_RECITERS.forEach(({ identifier, name }) => {
    result[identifier] = name;
  });

  return result;
};

// Verse audio — returns primary + fallback URLs
// Handles both Al-Quran Cloud and EveryAyah reciters
export const fetchVerseAudio = (
  reciterIdentifier: string,
  globalAyahNumber: number | null,
  surahNumber: number,
  ayahNumber: number
): { primary: string | null; fallback: string | null } => {
  if (reciterIdentifier.startsWith('everyayah:')) {
    const folder = reciterIdentifier.slice('everyayah:'.length);
    const s = surahNumber.toString().padStart(3, '0');
    const a = ayahNumber.toString().padStart(3, '0');
    return {
      primary: `${EVERYAYAH_CDN}/${folder}/${s}${a}.mp3`,
      fallback: null,
    };
  }

  return {
    primary: globalAyahNumber != null
      ? `${ALQURAN_CDN}/${reciterIdentifier}/${globalAyahNumber}.mp3`
      : null,
    fallback: AUDIO_URL
      ? `${AUDIO_URL}/${reciterIdentifier}/${surahNumber}_${ayahNumber}.mp3`
      : null,
  };
};

// Chapter audio — EveryAyah has no chapter-level files, returns null for those reciters
export const getChapterAudioUrl = async (
  reciterIdentifier: string,
  surahNumber: number
): Promise<{ primary: string | null; fallback: string | null }> => {
  if (reciterIdentifier.startsWith('everyayah:')) {
    return { primary: null, fallback: null };
  }

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
