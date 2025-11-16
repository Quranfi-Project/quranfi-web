import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurah, fetchReciters, fetchVerseAudio, fetchChapterAudio } from '../utils/api';
import CustomAudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import { FaPlay, FaPause, FaArrowLeft, FaRegBookmark, FaBookmark, FaCog } from 'react-icons/fa';
import { addBookmark, getBookmarks, removeBookmark as removeBookmarkDB } from '../utils/bookmarksDB';
import { bookmarkChannel } from "../utils/sync";

import '../css/surah.css';

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();

  const [surah, setSurah] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [reciters, setReciters] = useState<{ [key: string]: string }>({});
  const [selectedReciter, setSelectedReciter] = useState<string>('1');
  const [chapterAudio, setChapterAudio] = useState<any>({});
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState<number>(2);
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [currentRepeat, setCurrentRepeat] = useState<number>(0);

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

  // When page becomes visible (return from Bookmarks page)
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
      await reloadBookmarks(); // instantly refresh state
    }
  };

  bookmarkChannel.addEventListener("message", listener);

  return () => bookmarkChannel.removeEventListener("message", listener);
}, []);

  // Toggle bookmark
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

        const chapterAudioData = await fetchChapterAudio(Number(surahNumber));
        setChapterAudio(chapterAudioData);
      } catch (error) {
        console.error('Error loading Surah:', error);
      }
    };
    loadData();
  }, [surahNumber]);

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

//   const handleVerseAudio = (index: number) => {
//     const audioUrl = fetchVerseAudio(selectedReciter, surah.surahNo, index + 1);

//     if (currentVerseIndex === index && isPlaying) {
//       stopAllAudio();
//       return;
//     }

//     stopAllAudio();
//     const audio = new Audio(audioUrl);
//     audioRef.current = audio;
//     audio.play();

//     setCurrentVerseIndex(index);
//     setIsPlaying(true);
//     setCurrentRepeat(1);

// audio.onended = () => {
//   setCurrentRepeat(prev => {
//     const next = prev + 1;

//     // Keep repeating until next < repeatCount
//     if (next < repeatCount) {
//       audio.currentTime = 0;
//       audio.play();
//       return next;
//     }

//     // Stop repeating
//     stopAllAudio();
//     return 0; // reset
//   });
// };

//   };
const handleVerseAudio = (index: number) => {
  const audioUrl = fetchVerseAudio(selectedReciter, surah.surahNo, index + 1);

  // If playing same ayah → stop
  if (currentVerseIndex === index && isPlaying) {
    stopAllAudio();
    return;
  }

  stopAllAudio();

  const audio = new Audio(audioUrl);
  audioRef.current = audio;
  setCurrentVerseIndex(index);
  setIsPlaying(true);

  // ⭐ Start counting repeats from 0 (first play is repeat #0)
  setCurrentRepeat(0);

  audio.play();

  audio.onended = () => {
    setCurrentRepeat(prev => {
      const next = prev + 1;

      // ⭐ If next < repeatCount → play again
      if (next < repeatCount) {
        audio.currentTime = 0;
        audio.play();
        return next;
      }

      // ⭐ Stop after finishing all repeats
      stopAllAudio();
      return 0;
    });
  };
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

  if (!surah) return <div>Loading...</div>;

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="p-4 pb-24 relative">

      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="p-2 bg-blue-500 text-white rounded-lg flex items-center gap-1">
            <FaArrowLeft size={16} /><span>Back</span>
          </button>

          {Number(surahNumber) < 114 && (
            <button
              onClick={() => navigate(`/surah/${Number(surahNumber) + 1}`)}
              className="p-2 bg-blue-500 text-white rounded-lg flex items-center gap-1"
            >
              <span>Next</span>
              <FaArrowLeft size={16} className="rotate-180" />
            </button>
          )}
        </div>

        <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-gray-200 rounded-lg">
          <FaCog size={20} />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute right-4 top-16 bg-white p-4 shadow-lg rounded-lg z-10 w-72">
          <h3 className="font-bold text-lg mb-3">Settings</h3>

          {/* Font size */}
          <label className="text-sm font-medium">Arabic Font Size</label>
          <div className="grid grid-cols-2 gap-2 mb-4 mt-1">
            {[1,2,3,4].map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-2 rounded-md text-sm ${
                  fontSize === size ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {["Small","Medium","Large","X-Large"][size-1]}
              </button>
            ))}
          </div>

          {/* Repeat */}
          <label className="text-sm font-medium block mb-2">Verse Repeat</label>
          <select value={repeatCount} onChange={(e) => setRepeatCount(Number(e.target.value))}
            className="w-full p-2 border rounded mb-4">
            <option value={1}>No repeat</option>
            <option value={2}>2 times</option>
            <option value={3}>3 times</option>
            <option value={5}>5 times</option>
            <option value={10}>10 times</option>
          </select>

          {/* Reciter */}
          <label className="text-sm font-medium block mb-2">Reciter</label>
          <select value={selectedReciter} onChange={(e) => setSelectedReciter(e.target.value)}
            className="w-full p-2 border rounded">
            {Object.entries(reciters).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Surah Names */}
      <h1 className="text-2xl font-bold">{surah.surahName}</h1>
      <h2 className="text-xl text-gray-700">{surah.surahNameArabic}</h2>

      {/* ------------------------ */}
      {/* AYAH LIST */}
      {/* ------------------------ */}
      <div className="mt-4 space-y-4">
        {surah.arabic1.map((ayah: string, index: number) => {
          const verseId = getVerseId(index);
          const isBookmarked = bookmarks.has(verseId);

          return (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div className="flex-1">

                <div className="flex items-start gap-4">
                  {/* Bookmark */}
                  <button onClick={() => toggleBookmark(verseId)} className="text-xl hover:text-yellow-500">
                    {isBookmarked ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
                  </button>

                  {/* Ayah Number */}
                  <span className="text-2xl font-arabic">{index + 1}.</span>

                  {/* Arabic Text */}
                  <p className={`${getFontSizeClass(fontSize)} text-right font-arabic leading-loose flex-1`}>
                    {ayah} <span className="ml-2">.{convertToArabicNumerals(index + 1)}</span>
                  </p>
                </div>

                {/* ⭐ ENGLISH MEANING (THIS WAS MISSING BEFORE!) */}
                <p className="text-lg text-gray-700 mt-2">
                  {surah.english[index]}
                </p>
              </div>

              {/* Play / Pause Button */}
              <button
                onClick={() => handleVerseAudio(index)}
                className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {currentVerseIndex === index && isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <h3 className="text-lg font-semibold">Chapter Audio</h3>
        <CustomAudioPlayer
          ref={chapterAudioPlayerRef}
          audioUrl={
            chapterAudio[selectedReciter]?.originalUrl ||
            chapterAudio[selectedReciter]?.url
          }
          title={`Surah ${surah.surahName} - ${surah.surahNameArabic}`}
          onPlay={() => stopAllAudio()}
        />
      </div>

    </div>
  );
};

export default SurahDetail;
