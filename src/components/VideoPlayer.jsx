import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

const VideoPlayer = ({ url, onProgress, handleDuration, onEnded, className = '' }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Reset states when URL changes
  useEffect(() => {
    if (url) {
      console.log('VideoPlayer: URL changed to:', url);
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      setPlaying(false);
      setPlayed(0);
      setLoaded(0);
    }
  }, [url]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
    if (onProgress) {
      onProgress(state);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.currentTime = parseFloat(e.target.value) * duration;
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleDurationChange = (duration) => {
    setDuration(duration);
    if (handleDuration) {
      handleDuration(duration);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };

  const handleError = (error) => {
    console.error('VideoPlayer: Error occurred:', error);
    console.error('VideoPlayer: Current URL:', url);
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Failed to load video. Please check the video file or URL.');
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handlePlaying = () => {
    setIsLoading(false);
    setHasError(false);
    setErrorMessage('');
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      const playerElement = playerRef.current.wrapper;
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      } else if (playerElement.webkitRequestFullscreen) {
        playerElement.webkitRequestFullscreen();
      } else if (playerElement.msRequestFullscreen) {
        playerElement.msRequestFullscreen();
      }
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime || 0;
      playerRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const handleForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime || 0;
      playerRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleMouseLeave = () => {
    if (playing) {
      setShowControls(false);
    }
  };

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        onLoadStart={() => {
          console.log('VideoPlayer: Video load started');
          setIsLoading(true);
        }}
        onCanPlay={() => {
          console.log('VideoPlayer: Video can play');
          setIsLoading(false);
          setHasError(false);
        }}
        onError={handleError}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload'
            }
          }
        }}
      />
      
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${played * 100}%, #4b5563 ${played * 100}%, #4b5563 100%)`
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {playing ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={handleRewind}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={handleForward}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <SkipForward size={20} />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMute}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <span className="text-white text-sm">
                {formatTime(duration * played)} / {formatTime(duration)}
              </span>
            </div>
            
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center p-6">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Video Load Error</h3>
            <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                // Force re-render by updating a state
                setPlaying(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Play Button - only show when not loading, no error, and not playing */}
      {!playing && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transition-colors"
          >
            <Play size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;