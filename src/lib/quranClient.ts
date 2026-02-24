import { QuranClient, Language } from '@quranjs/api';

let _client: QuranClient | null = null;

export function getQuranClient(): QuranClient {
  if (!_client) {
    if (!process.env.QURAN_CLIENT_ID || !process.env.QURAN_CLIENT_SECRET) {
      throw new Error('Missing QURAN_CLIENT_ID or QURAN_CLIENT_SECRET environment variables');
    }
    _client = new QuranClient({
      clientId: process.env.QURAN_CLIENT_ID,
      clientSecret: process.env.QURAN_CLIENT_SECRET,
      defaults: {
        language: Language.ENGLISH,
      },
    });
  }
  return _client;
}
