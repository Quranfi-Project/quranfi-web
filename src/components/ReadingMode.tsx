'use client'

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaBookmark, FaRegBookmark, FaSearch } from 'react-icons/fa';
import { fetchQuranPage, QuranPageData, QuranPageAyah } from '../utils/api';
import {
  addPageBookmark,
  removePageBookmark,
  isPageBookmarked,
} from '../utils/bookmarksDB';
import { bookmarkChannel } from '../utils/sync';

const TOTAL_PAGES = 604;

const getFontSizeClass = (size: number): string =>
  ({ 1: 'text-xl', 2: 'text-2xl', 3: 'text-3xl', 4: 'text-4xl' }[size] ?? 'text-3xl');

const convertToArabicNumerals = (num: number): string => {
  const map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(n => map[parseInt(n)]).join('');
};

const ReadingMode = () => {
  const params = useParams();
  const router = useRouter();

  const currentPage = parseInt(params?.pageNumber as string, 10);

  const [pageData, setPageData] = useState<QuranPageData | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(3);
  const [jumpInput, setJumpInput] = useState('');
  const [showJump, setShowJump] = useState(false);
  const jumpRef = useRef<HTMLInputElement>(null);

  // Guard: redirect invalid page numbers
  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 1 || currentPage > TOTAL_PAGES) {
      router.replace('/read/1');
    }
  }, [currentPage, router]);

  // Load page data + bookmark state
  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 1 || currentPage > TOTAL_PAGES) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [data, bookmarked] = await Promise.all([
          fetchQuranPage(currentPage),
          isPageBookmarked(currentPage),
        ]);
        setPageData(data);
        setIsBookmarked(bookmarked);
        localStorage.setItem('lastReadPage', String(currentPage));
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch {
        setError('Failed to load page. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [currentPage]);

  // Cross-tab bookmark sync
  useEffect(() => {
    const listener = async (msg: MessageEvent) => {
      if (msg.data === 'BOOKMARKS_UPDATED') {
        const bookmarked = await isPageBookmarked(currentPage);
        setIsBookmarked(bookmarked);
      }
    };
    bookmarkChannel.addEventListener('message', listener);
    return () => bookmarkChannel.removeEventListener('message', listener);
  }, [currentPage]);

  const toggleBookmark = async () => {
    if (isBookmarked) {
      await removePageBookmark(currentPage);
      setIsBookmarked(false);
    } else {
      await addPageBookmark(currentPage);
      setIsBookmarked(true);
    }
    bookmarkChannel.postMessage('BOOKMARKS_UPDATED');
  };

  const goToPrev = () => {
    if (currentPage > 1) router.push(`/read/${currentPage - 1}`);
  };

  const goToNext = () => {
    if (currentPage < TOTAL_PAGES) router.push(`/read/${currentPage + 1}`);
  };

  const handleJump = () => {
    const n = parseInt(jumpInput, 10);
    if (n >= 1 && n <= TOTAL_PAGES) {
      router.push(`/read/${n}`);
      setJumpInput('');
      setShowJump(false);
    }
  };

  const handleJumpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleJump();
    if (e.key === 'Escape') setShowJump(false);
  };

  // Show jump input and focus it
  const openJump = () => {
    setShowJump(true);
    setTimeout(() => jumpRef.current?.focus(), 50);
  };

  // Group ayahs to detect surah breaks
  const needsSurahHeader = (ayah: QuranPageAyah, index: number, ayahs: QuranPageAyah[]): boolean => {
    if (ayah.numberInSurah !== 1) return false;
    // Don't show header if this is surah 1 starting at the very top — it's always page 1 ayah 1
    // but we still show the header for consistency; Bismillah suppression handles the duplicate
    return true;
  };

  if (isNaN(currentPage) || currentPage < 1 || currentPage > TOTAL_PAGES) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft size={16} />
          </button>

          {/* Page indicator */}
          <span className="flex-1 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
            Page {currentPage} / {TOTAL_PAGES}
          </span>

          {/* Bookmark toggle */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={isBookmarked ? 'Remove page bookmark' : 'Bookmark this page'}
          >
            {isBookmarked ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
          </button>

          {/* Jump to page */}
          <button
            onClick={openJump}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Jump to page"
          >
            <FaSearch size={14} />
          </button>

          {/* Font size controls */}
          <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-lg px-1">
            {[1, 2, 3, 4].map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  fontSize === size
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {['S', 'M', 'L', 'XL'][size - 1]}
              </button>
            ))}
          </div>
        </div>

        {/* Jump input (inline, below top bar) */}
        {showJump && (
          <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex items-center gap-2 bg-white dark:bg-gray-800">
            <input
              ref={jumpRef}
              type="number"
              min={1}
              max={TOTAL_PAGES}
              value={jumpInput}
              onChange={e => setJumpInput(e.target.value)}
              onKeyDown={handleJumpKeyDown}
              placeholder={`Page 1–${TOTAL_PAGES}`}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleJump}
              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Go
            </button>
            <button
              onClick={() => setShowJump(false)}
              className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Page content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-32">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        )}

        {error && (
          <div className="text-center mt-16 text-red-500 dark:text-red-400">
            <p>{error}</p>
            <button
              onClick={() => router.push(`/read/${currentPage}`)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && pageData && (
          <div dir="rtl" className="space-y-1">
            {pageData.ayahs.map((ayah, index) => (
              <span key={ayah.number}>
                {/* Surah header when a new surah starts on this page */}
                {needsSurahHeader(ayah, index, pageData.ayahs) && (
                  <div dir="ltr" className="text-center my-8 py-5 border-y border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                      {ayah.surah.englishName} &mdash; {ayah.surah.englishNameTranslation}
                    </p>
                    <p className="text-2xl font-arabic-quran text-gray-900 dark:text-gray-100 leading-loose">
                      {ayah.surah.name}
                    </p>
                    {/* Bismillah — suppress for Al-Fatiha (1) which has it as ayah 1, and At-Tawba (9) */}
                    {ayah.surah.number !== 1 && ayah.surah.number !== 9 && (
                      <p className="text-xl font-arabic-quran text-gray-600 dark:text-gray-400 mt-3 leading-loose">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                      </p>
                    )}
                  </div>
                )}
                {/* Ayah text inline */}
                <span
                  className={`${getFontSizeClass(fontSize)} font-arabic-quran text-gray-900 dark:text-gray-100 leading-loose`}
                >
                  {ayah.text}{' '}
                  <span className="text-gold-500 dark:text-gold-400 text-base">
                    ﴿{convertToArabicNumerals(ayah.numberInSurah)}﴾
                  </span>{' '}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={goToPrev}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[80px] justify-center"
          >
            <FaArrowLeft size={14} />
            <span className="text-sm font-medium">Prev</span>
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {currentPage} / {TOTAL_PAGES}
          </span>

          <button
            onClick={goToNext}
            disabled={currentPage >= TOTAL_PAGES}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[80px] justify-center"
          >
            <span className="text-sm font-medium">Next</span>
            <FaArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingMode;
