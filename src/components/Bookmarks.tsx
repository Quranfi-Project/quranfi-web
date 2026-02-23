'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBookmarks, removeBookmark as removeBookmarkDB, getPageBookmarks, removePageBookmark, PageBookmark } from '../utils/bookmarksDB';
import { FaArrowLeft, FaQuran, FaBookOpen } from 'react-icons/fa';
import { bookmarkChannel } from "../utils/sync";

type Bookmark = {
  id: string;
  verse_id: string;
  created_at: string;
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pageBookmarks, setPageBookmarks] = useState<PageBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'verses' | 'pages'>('verses');
  const router = useRouter();

  const loadAll = async () => {
    setLoading(true);
    try {
      const [verseData, pageData] = await Promise.all([
        getBookmarks(),
        getPageBookmarks(),
      ]);
      setBookmarks(verseData || []);
      setPageBookmarks(pageData || []);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load bookmarks from IndexedDB
  useEffect(() => {
    loadAll();
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const listener = async (msg: MessageEvent) => {
      if (msg.data === "BOOKMARKS_UPDATED") {
        const [verseData, pageData] = await Promise.all([
          getBookmarks(),
          getPageBookmarks(),
        ]);
        setBookmarks(verseData || []);
        setPageBookmarks(pageData || []);
      }
    };
    bookmarkChannel.addEventListener('message', listener);
    return () => bookmarkChannel.removeEventListener('message', listener);
  }, []);

  // Parse "surah:ayah"
  const parseVerseId = (verseId: string) => {
    const [surahNumber, ayahNumber] = verseId.split(':');
    return { surahNumber: Number(surahNumber), ayahNumber: Number(ayahNumber) };
  };

  // Navigate to verse
  const navigateToVerse = (verseId: string) => {
    const { surahNumber, ayahNumber } = parseVerseId(verseId);
    router.push(`/surah/${surahNumber}#ayah-${ayahNumber}`);
  };

  // Remove verse bookmark
  const handleRemove = async (bookmarkId: string) => {
    try {
      await removeBookmarkDB(bookmarkId);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      bookmarkChannel.postMessage("BOOKMARKS_UPDATED");
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  // Remove page bookmark
  const handleRemovePage = async (pageNumber: number) => {
    try {
      await removePageBookmark(pageNumber);
      setPageBookmarks(prev => prev.filter(pb => pb.pageNumber !== pageNumber));
      bookmarkChannel.postMessage("BOOKMARKS_UPDATED");
    } catch (error) {
      console.error("Error removing page bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FaArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold text-center flex-1 dark:text-gray-100">Your Bookmarks</h1>

        <div className="w-10"></div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setTab('verses')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'verses'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Verses ({bookmarks.length})
        </button>
        <button
          onClick={() => setTab('pages')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'pages'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Pages ({pageBookmarks.length})
        </button>
      </div>

      {/* Verses tab */}
      {tab === 'verses' && (
        bookmarks.length === 0 ? (
          <div className="text-center mt-10">
            <FaQuran className="mx-auto text-5xl text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No bookmarks yet</p>
            <p className="text-gray-500 dark:text-gray-500">Bookmark verses by clicking the bookmark icon in Surah view</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => {
              const { surahNumber, ayahNumber } = parseVerseId(bookmark.verse_id);

              return (
                <div
                  key={bookmark.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        onClick={() => navigateToVerse(bookmark.verse_id)}
                      >
                        Surah {surahNumber}, Ayah {ayahNumber}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Bookmarked on {new Date(bookmark.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigateToVerse(bookmark.verse_id)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Go to Verse
                      </button>

                      <button
                        onClick={() => handleRemove(bookmark.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Pages tab */}
      {tab === 'pages' && (
        pageBookmarks.length === 0 ? (
          <div className="text-center mt-10">
            <FaBookOpen className="mx-auto text-5xl text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No page bookmarks yet</p>
            <p className="text-gray-500 dark:text-gray-500">Bookmark pages while reading in Reading Mode</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...pageBookmarks]
              .sort((a, b) => a.pageNumber - b.pageNumber)
              .map((pb) => (
                <div
                  key={pb.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        Page {pb.pageNumber}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Bookmarked on {new Date(pb.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/read/${pb.pageNumber}`)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Go to Page
                      </button>

                      <button
                        onClick={() => handleRemovePage(pb.pageNumber)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )
      )}
    </div>
  );
};

export default Bookmarks;
