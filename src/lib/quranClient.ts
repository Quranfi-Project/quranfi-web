import { QuranClient, Language } from '@quranjs/api';

if (!process.env.QURAN_CLIENT_ID || !process.env.QURAN_CLIENT_SECRET) {
  throw new Error('Missing QURAN_CLIENT_ID or QURAN_CLIENT_SECRET environment variables');
}

const quranClient = new QuranClient({
  clientId: process.env.QURAN_CLIENT_ID,
  clientSecret: process.env.QURAN_CLIENT_SECRET,
  defaults: {
    language: Language.ENGLISH,
  },
});

export default quranClient;
