// src/components/SurahList.tsx
// import { useEffect, useState } from 'react';
// import { fetchSurahs } from '../utils/api';

const DuaList = () => {
  // const [surahs, setSurahs] = useState<any[]>([]);
  // const [searchTerm, setSearchTerm] = useState('');

  // useEffect(() => {
  //   const loadSurahs = async () => {
  //     const data = await fetchSurahs();
  //     setSurahs(data);
  //   };
  //   loadSurahs();
  // }, []);

  // const filteredSurahs = surahs.filter((surah) => {
  //   const searchLower = searchTerm.toLowerCase();
  //   return (
  //     surah.surahName.toLowerCase().includes(searchLower) ||
  //     surah.surahNameArabic.includes(searchTerm) || // Arabic doesn't need toLower
  //     surah.surahNameTranslation.toLowerCase().includes(searchLower) ||
  //     surah.number.toString().includes(searchTerm)
  //   )
  // });
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Duas: Coming Soon</h1>
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search surahs..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="space-y-2">
        {filteredSurahs.map((surah) => (
          <li key={surah.number} className="p-2 bg-white rounded-lg shadow-md">
            <a
              href={`/surah/${surah.number}`}
              className="text-blue-500 hover:underline"
            >
{surah.number}. {surah.surahName} ({surah.surahNameArabic}) - {surah.surahNameTranslation}            </a>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default DuaList;