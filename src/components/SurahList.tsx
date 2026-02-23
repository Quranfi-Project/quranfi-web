'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchSurahs } from '../utils/api';

const SurahList = () => {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSurahs = async () => {
      const data = await fetchSurahs();
      setSurahs(data);
    };
    loadSurahs();
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      surah.surahName.toLowerCase().includes(searchLower) ||
      surah.surahNameArabic.includes(searchTerm) ||
      surah.surahNameTranslation.toLowerCase().includes(searchLower) ||
      surah.number.toString().includes(searchTerm)
    );
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Surahs</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search surahs..."
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSurahs.map((surah) => (
          <Link key={surah.number} href={`/surah/${surah.number}`}>
            <div className="
              bg-white dark:bg-gray-800
              rounded-xl shadow-md hover:shadow-lg
              transition-all duration-200 hover:-translate-y-0.5
              p-4 flex flex-col gap-2
              border border-gray-100 dark:border-gray-700
              cursor-pointer h-full
            ">
              {/* Top row: number badge + revelation type */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
                  bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300
                  text-sm font-bold">
                  {surah.number}
                </span>
                {surah.revelationType && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    surah.revelationType === 'Meccan'
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                      : 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                  }`}>
                    {surah.revelationType}
                  </span>
                )}
              </div>

              {/* Arabic name */}
              <p className="text-2xl font-arabic text-right text-gray-800 dark:text-gray-100 leading-loose">
                {surah.surahNameArabic}
              </p>

              {/* English name + translation */}
              <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {surah.surahName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {surah.surahNameTranslation}
              </p>

              {/* Verse count */}
              {surah.numberOfAyahs && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
                  {surah.numberOfAyahs} verses
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
