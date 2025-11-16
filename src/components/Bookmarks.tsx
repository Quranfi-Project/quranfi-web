import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookmarks, removeBookmark as removeBookmarkDB } from '../utils/bookmarksDB';
import { FaArrowLeft, FaQuran } from 'react-icons/fa';
import { bookmarkChannel } from "../utils/sync";

type Bookmark = {
  id: string;
  verse_id: string;
  created_at: string;
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load bookmarks from IndexedDB
  useEffect(() => {
    const loadBookmarks = async () => {
      setLoading(true);

      try {
        const data = await getBookmarks();
        setBookmarks(data || []);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Parse "surah:ayah"
  const parseVerseId = (verseId: string) => {
    const [surahNumber, ayahNumber] = verseId.split(':');
    return { surahNumber: Number(surahNumber), ayahNumber: Number(ayahNumber) };
  };

  // Navigate to verse
  const navigateToVerse = (verseId: string) => {
    const { surahNumber, ayahNumber } = parseVerseId(verseId);
    navigate(`/surah/${surahNumber}#ayah-${ayahNumber}`);
  };

  // Remove bookmark
const handleRemove = async (bookmarkId: string) => {
  try {
    await removeBookmarkDB(bookmarkId); // Delete from IndexedDB

    // Update local state
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));

    // 🔥 Notify all tabs + SurahDetail instantly
    bookmarkChannel.postMessage("BOOKMARKS_UPDATED");

  } catch (error) {
    console.error("Error removing bookmark:", error);
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
          onClick={() => navigate(-1)} 
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FaArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold text-center flex-1">Your Bookmarks</h1>
        
        <div className="w-10"></div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center mt-10">
          <FaQuran className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No bookmarks yet</p>
          <p className="text-gray-500">Bookmark verses by clicking the bookmark icon in Surah view</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const { surahNumber, ayahNumber } = parseVerseId(bookmark.verse_id);

            return (
              <div 
                key={bookmark.id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigateToVerse(bookmark.verse_id)}
                    >
                      Surah {surahNumber}, Ayah {ayahNumber}
                    </h3>

                    <p className="text-gray-500 text-sm">
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
      )}
    </div>
  );
};

export default Bookmarks;
