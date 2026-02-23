'use client'

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSurah, fetchReciters, fetchVerseAudio, getChapterAudioUrl } from '../utils/api';
import CustomAudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import { FaPlay, FaPause, FaArrowLeft, FaRegBookmark, FaBookmark, FaCog } from 'react-icons/fa';
import { addBookmark, getBookmarks, removeBookmark as removeBookmarkDB } from '../utils/bookmarksDB';
import { bookmarkChannel } from "../utils/sync";

import '../css/surah.css';

const SurahDetail = () => {
  const params = useParams<{ surahNumber: string }>();
  const surahNumber = params?.surahNumber;
  const router = useRouter();

  const [surah, setSurah] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [reciters, setReciters] = useState<{ [key: string]: string }>({});
  const [selectedReciter, setSelectedReciter] = useState<string>('ar.alafasy');
  const [chapterAudioUrls, setChapterAudioUrls] = useState<{ primary: string; fallback: string | null } | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState<number>(2);
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [, setCurrentRepeat] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chapterAudioPlayerRef = useRef<AudioPlayerRef>(null);

  // -------------------------------
  // Load Bookmarks
  // -------------------------------
  const reloadBookmarks = async () => {
    const data = await getBookmarks();
    setBookmarks(new Set(data.map((b) => b.verse_id)));
  };

  useEffect(() => {
    reloadBookmarks();
  }, [surahNumber]);

  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        await reloadBookmarks();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const listener = async (msg: MessageEvent) => {
      if (msg.data === "BOOKMARKS_UPDATED") {
        await reloadBookmarks();
      }
    };

    bookmarkChannel.addEventListener("message", listener);
    return () => bookmarkChannel.removeEventListener("message", listener);
  }, []);

  const toggleBookmark = async (verseId: string) => {
    if (bookmarks.has(verseId)) {
      await removeBookmarkDB(verseId);
      const updated = new Set(bookmarks);
      updated.delete(verseId);
      setBookmarks(updated);
    } else {
      await addBookmark({
        id: verseId,
        verse_id: verseId,
        created_at: new Date().toISOString(),
      });
      const updated = new Set(bookmarks);
      updated.add(verseId);
      setBookmarks(updated);
    }

    bookmarkChannel.postMessage("BOOKMARKS_UPDATED");
  };

  // -------------------------------
  // Load Surah / Reciters / Audio
  // -------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const surahData = await fetchSurah(Number(surahNumber));
        setSurah(surahData);

        const reciterList = await fetchReciters();
        setReciters(reciterList);

        const audioUrls = await getChapterAudioUrl(selectedReciter, Number(surahNumber));
        setChapterAudioUrls(audioUrls);
      } catch (error) {
        console.error('Error loading Surah:', error);
      }
    };
    loadData();
  }, [surahNumber]);

  // Reload chapter audio URL when reciter changes
  useEffect(() => {
    if (!surahNumber) return;
    getChapterAudioUrl(selectedReciter, Number(surahNumber)).then(setChapterAudioUrls);
  }, [selectedReciter, surahNumber]);

  // -------------------------------
  // Audio handling
  // -------------------------------
  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsPlaying(false);
    setCurrentVerseIndex(null);
    setCurrentRepeat(0);

    if (chapterAudioPlayerRef.current?.isPlaying) {
      chapterAudioPlayerRef.current.pause();
    }
  };

  const handleVerseAudio = (index: number) => {
    if (!surah) return;

    const globalAyahNum = surah.globalAyahNumbers?.[index] ?? null;
    const { primary, fallback } = fetchVerseAudio(
      selectedReciter,
      globalAyahNum,
      surah.surahNo,
      index + 1
    );

    const audioUrl = primary || fallback;
    if (!audioUrl) return;

    if (currentVerseIndex === index && isPlaying) {
      stopAllAudio();
      return;
    }

    stopAllAudio();

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentVerseIndex(index);
    setIsPlaying(true);
    setCurrentRepeat(0);

    // If primary fails and fallback exists, retry with fallback
    if (primary && fallback) {
      audio.onerror = () => {
        const fallbackAudio = new Audio(fallback);
        audioRef.current = fallbackAudio;
        fallbackAudio.play();
        fallbackAudio.onended = handleEnded(fallbackAudio);
      };
    }

    audio.play();
    audio.onended = handleEnded(audio);
  };

  const handleEnded = (audio: HTMLAudioElement) => () => {
    setCurrentRepeat(prev => {
      const next = prev + 1;
      if (next < repeatCount) {
        audio.currentTime = 0;
        audio.play();
        return next;
      }
      stopAllAudio();
      return 0;
    });
  };

  // -------------------------------
  // Utils
  // -------------------------------
  const getVerseId = (i: number) => `${surah.surahNo}:${i + 1}`;

  const convertToArabicNumerals = (num: number) => {
    const map = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return num.toString().split('').map(n => map[parseInt(n)]).join('');
  };

  const getFontSizeClass = (size: number) => ({
    1: 'text-xl',
    2: 'text-2xl',
    3: 'text-3xl',
    4: 'text-4xl',
  }[size] || 'text-2xl');

  if (!surah) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500 dark:text-gray-400 text-lg">Loading...</div>
    </div>
  );

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="p-4 pb-36 relative">

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-1 transition-colors"
          >
            <FaArrowLeft size={16} /><span>Back</span>
          </button>

          {Number(surahNumber) < 114 && (
            <button
              onClick={() => router.push(`/surah/${Number(surahNumber) + 1}`)}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-1 transition-colors"
            >
              <span>Next</span>
              <FaArrowLeft size={16} className="rotate-180" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <FaCog size={20} />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute right-4 top-16 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          p-4 shadow-xl rounded-xl z-10 w-72">
          <h3 className="font-bold text-lg mb-3 dark:text-gray-100">Settings</h3>

          {/* Font size */}
          <label className="text-sm font-medium dark:text-gray-300">Arabic Font Size</label>
          <div className="grid grid-cols-2 gap-2 mb-4 mt-1">
            {[1,2,3,4].map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  fontSize === size
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {["Small","Medium","Large","X-Large"][size-1]}
              </button>
            ))}
          </div>

          {/* Repeat */}
          <label className="text-sm font-medium block mb-2 dark:text-gray-300">Verse Repeat</label>
          <select
            value={repeatCount}
            onChange={(e) => setRepeatCount(Number(e.target.value))}
            className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded mb-4
              bg-white dark:bg-gray-700 dark:text-gray-200"
          >
            <option value={1}>No repeat</option>
            <option value={2}>2 times</option>
            <option value={3}>3 times</option>
            <option value={5}>5 times</option>
            <option value={10}>10 times</option>
          </select>

          {/* Reciter */}
          <label className="text-sm font-medium block mb-2 dark:text-gray-300">Reciter</label>
          <select
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(e.target.value)}
            className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded
              bg-white dark:bg-gray-700 dark:text-gray-200"
          >
            {Object.entries(reciters).map(([id, name]) => (
              <option key={id} value={id}>{name as string}</option>
            ))}
          </select>
        </div>
      )}

      {/* Surah header */}
      <div className="text-center py-6 border-b border-gray-100 dark:border-gray-700 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{surah.surahName}</h1>
        <p className="text-4xl font-arabic mt-2 text-gray-700 dark:text-gray-300 leading-loose">{surah.surahNameArabic}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{surah.surahNameTranslation}</p>
      </div>

      {/* AYAH LIST */}
      <div className="mt-4 space-y-4">
        {surah.arabic1.map((ayah: string, index: number) => {
          const verseId = getVerseId(index);
          const isBookmarked = bookmarks.has(verseId);

          return (
            <div
              key={index}
              id={`ayah-${index + 1}`}
              className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm
                border border-gray-100 dark:border-gray-700 space-y-3"
            >
              {/* Top row: verse number + actions */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
                  bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-bold">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(verseId)}
                    className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors p-1"
                  >
                    {isBookmarked
                      ? <FaBookmark className="text-yellow-500" size={18} />
                      : <FaRegBookmark size={18} />}
                  </button>
                  <button
                    onClick={() => handleVerseAudio(index)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    {currentVerseIndex === index && isPlaying
                      ? <FaPause size={16} />
                      : <FaPlay size={16} />}
                  </button>
                </div>
              </div>

              {/* Arabic text — full width, right-aligned */}
              <p className={`${getFontSizeClass(fontSize)} font-arabic text-right
                text-gray-900 dark:text-gray-100 leading-loose`} dir="rtl">
                {ayah} <span className="text-gray-400 dark:text-gray-500">﴿{convertToArabicNumerals(index + 1)}﴾</span>
              </p>

              {/* English translation */}
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t
                border-gray-100 dark:border-gray-700 pt-3">
                {surah.english[index]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95
        backdrop-blur-sm shadow-2xl border-t border-gray-200 dark:border-gray-700 p-3">
        <CustomAudioPlayer
          ref={chapterAudioPlayerRef}
          audioUrl={chapterAudioUrls?.primary ?? ''}
          fallbackUrl={chapterAudioUrls?.fallback}
          title={`${surah.surahName} — ${surah.surahNameArabic}`}
          onPlay={() => stopAllAudio()}
        />
      </div>

    </div>
  );
};

export default SurahDetail;
