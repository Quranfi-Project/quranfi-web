'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchSurahs } from '../utils/api';

const SurahList = () => {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'All' | 'Meccan' | 'Medinan'>('All');

  useEffect(() => {
    const loadSurahs = async () => {
      const data = await fetchSurahs();
      setSurahs(data);
    };
    loadSurahs();
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      surah.surahName.toLowerCase().includes(searchLower) ||
      surah.surahNameArabic.includes(searchTerm) ||
      surah.surahNameTranslation.toLowerCase().includes(searchLower) ||
      surah.number.toString().includes(searchTerm);
    const matchesRevelation =
      revelationFilter === 'All' || surah.revelationType === revelationFilter;
    return matchesSearch && matchesRevelation;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Surahs</h1>
      <div className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Search surahs..."
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-gold-500 dark:focus:ring-gold-400
            shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          {(['All', 'Meccan', 'Medinan'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setRevelationFilter(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                revelationFilter === type
                  ? type === 'Meccan'
                    ? 'bg-amber-500 dark:bg-amber-600 text-white'
                    : type === 'Medinan'
                    ? 'bg-teal-500 dark:bg-teal-600 text-white'
                    : 'bg-gold-500 text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
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
                  bg-gold-100 dark:bg-gold-900 text-gold-700 dark:text-gold-300
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
