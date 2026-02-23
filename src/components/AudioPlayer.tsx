'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaForward, FaRedo, FaTimes } from 'react-icons/fa';

export interface AudioPlayerRef {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
}

const CustomAudioPlayer = forwardRef<AudioPlayerRef, {
  audioUrl: string;
  fallbackUrl?: string | null;
  title?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}>(({ audioUrl, fallbackUrl, title, onPlay, onPause, onEnded }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);
  const [completedRepeats, setCompletedRepeats] = useState(0);
  const [showRepeatInput, setShowRepeatInput] = useState(false);
  const [customRepeat, setCustomRepeat] = useState('1');
  const triedFallback = useRef(false);

  // Reset fallback flag when audioUrl changes
  useEffect(() => {
    triedFallback.current = false;
  }, [audioUrl]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      }
    },
    isPlaying
  }));

  // Update current time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        onPause?.();
      } else {
        audioRef.current.play();
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        if (completedRepeats + 1 < repeatCount) {
          setCompletedRepeats(prev => prev + 1);
          audio.currentTime = 0;
          audio.play();
        } else {
          setIsPlaying(false);
          setCompletedRepeats(0);
          onEnded?.();
        }
      };

      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl, onEnded, repeatCount, completedRepeats]);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRepeatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(customRepeat);
    if (!isNaN(count) && count >= 0) {
      setRepeatCount(count);
      setCompletedRepeats(0);
      setShowRepeatInput(false);
    }
  };

  const cancelRepeat = () => {
    setRepeatCount(0);
    setShowRepeatInput(false);
  };

  const handleError = () => {
    if (!triedFallback.current && fallbackUrl && audioRef.current) {
      triedFallback.current = true;
      audioRef.current.src = fallbackUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      {title && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 truncate">
          {title}
        </p>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right shrink-0">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 accent-blue-500 cursor-pointer"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 shrink-0">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePlayPause}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition-all duration-150 active:scale-95"
        >
          {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>

        <button
          onClick={() => handleSeek(currentTime + 10)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
          title="Skip 10s"
        >
          <FaForward size={18} />
        </button>

        <div className="relative">
          {showRepeatInput ? (
            <form onSubmit={handleRepeatSubmit} className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="100"
                value={customRepeat}
                onChange={(e) => setCustomRepeat(e.target.value)}
                className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="Times"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Set
              </button>
              <button
                type="button"
                onClick={cancelRepeat}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              >
                <FaTimes size={14} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowRepeatInput(true)}
              className={`p-2 rounded-lg transition-colors ${
                repeatCount > 0
                  ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
              title={repeatCount > 0 ? `Repeating ${repeatCount} times` : 'Set repeat'}
            >
              <div className="flex items-center gap-1">
                <FaRedo size={16} />
                {repeatCount > 0 && (
                  <span className="text-xs font-bold">{repeatCount}</span>
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl || undefined} onError={handleError} />
    </div>
  );
});

CustomAudioPlayer.displayName = 'CustomAudioPlayer';

export default CustomAudioPlayer;
