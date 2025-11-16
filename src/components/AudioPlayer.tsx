import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaForward, FaRedo, FaTimes } from 'react-icons/fa';

export interface AudioPlayerRef {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
}

const CustomAudioPlayer = forwardRef<AudioPlayerRef, {
  audioUrl: string;
  title?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}>(({ audioUrl, title, onPlay, onPause, onEnded }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);
  const [completedRepeats, setCompletedRepeats] = useState(0);
  const [showRepeatInput, setShowRepeatInput] = useState(false);
  const [customRepeat, setCustomRepeat] = useState('1');

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
    // completedRepeats counts how many TIMES we've restarted the audio so far
    // We restart only if completedRepeats + 1 < repeatCount
    if (completedRepeats + 1 < repeatCount) {
      setCompletedRepeats(prev => prev + 1);
      audio.currentTime = 0;
      audio.play();
    } else {
      setIsPlaying(false);
      setCompletedRepeats(0); // reset
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="flex items-center space-x-2">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm">{formatTime(duration)}</span>
      </div>
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={handlePlayPause}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
        <button
          onClick={() => handleSeek(currentTime + 10)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FaForward size={20} />
        </button>
        
        <div className="relative">
          {showRepeatInput ? (
            <form onSubmit={handleRepeatSubmit} className="flex items-center">
              <input
                type="number"
                min="1"
                max="100"
                value={customRepeat}
                onChange={(e) => setCustomRepeat(e.target.value)}
                className="w-16 p-1 border border-gray-300 rounded mr-2"
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
                className="p-1 ml-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                <FaTimes size={14} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowRepeatInput(true)}
              className={`p-2 rounded-lg hover:bg-gray-200 ${
                repeatCount > 0 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={repeatCount > 0 ? `Repeating ${repeatCount} times` : 'Set repeat'}
            >
              <div className="flex items-center">
                <FaRedo size={16} />
                {repeatCount > 0 && (
                  <span className="ml-1 text-xs font-bold">{repeatCount}</span>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
});

CustomAudioPlayer.displayName = 'CustomAudioPlayer';

export default CustomAudioPlayer;