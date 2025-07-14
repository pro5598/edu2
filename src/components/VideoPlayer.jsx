import { useState } from 'react';
import Video from 'next-video';

const VideoPlayer = ({ url, className = '', onProgress, handleDuration, onEnded }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTimeUpdate = (e) => {
    if (onProgress) {
      const currentTime = e.target.currentTime;
      const duration = e.target.duration;
      if (duration) {
        const played = currentTime / duration;
        const loaded = e.target.buffered.length > 0 ? e.target.buffered.end(0) / duration : 0;
        
        onProgress({
          played,
          playedSeconds: currentTime,
          loaded,
          loadedSeconds: loaded * duration
        });
      }
    }
  };

  const handleLoadedMetadata = (e) => {
    if (handleDuration) {
      handleDuration(e.target.duration);
    }
  };

  const handleError = (e) => {
    console.error('VideoPlayer: Error occurred:', e);
    setHasError(true);
    setErrorMessage('Failed to load video. Please check the video file or URL.');
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
  };

  if (!url) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center p-6">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">No video URL provided</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-white text-center p-6">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Video Load Error</h3>
            <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <Video
          src={url}
          controls
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onEnded}
          onError={handleError}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;