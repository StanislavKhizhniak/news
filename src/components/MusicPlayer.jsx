import React, { useRef, useEffect, useState } from 'react';

function MusicPlayer({ 
  isOpen, 
  currentTrack, 
  isPlaying, 
  audioLoading, 
  audioProgress, 
  onPlay, 
  onPause, 
  onClose,
  audioRef,
  currentTime,
  duration,
  onTimeUpdate,
  onSeek,
  onVolumeChange,
  volume
}) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);



  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };



  if (!isOpen || !currentTrack) return null;

  return (
    <>
             {/* Музыкальный плеер */}
       <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
            style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}>
         
         <div className="container mx-auto px-6 py-4">
           <div className="flex items-center justify-between">
            
                         {/* Информация о треке */}
             <div className="flex items-center space-x-5 flex-1 min-w-0">
               <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                 {currentTrack.avatarUrl ? (
                   <img 
                     src={currentTrack.avatarUrl} 
                     alt={currentTrack.artist || 'Artist'}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       e.target.style.display = 'none';
                       e.target.nextSibling.style.display = 'block';
                     }}
                   />
                 ) : null}
                 <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ${currentTrack.avatarUrl ? 'hidden' : 'block'}`}>
                   <span className="text-white text-2xl">
                     {currentTrack.artist?.charAt(0)?.toUpperCase() || '🎵'}
                   </span>
                 </div>
               </div>
               
               <div className="flex-1 min-w-0">
                 <h3 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                   {currentTrack.title || 'Без названия'}
                 </h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                   {currentTrack.artist || 'Неизвестный артист'}
                 </p>
               </div>
             </div>

                         {/* Контролы воспроизведения */}
             <div className="flex items-center space-x-3">
               <button
                 onClick={isPlaying ? onPause : onPlay}
                 disabled={audioLoading}
                 className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg"
               >
                 {audioLoading ? (
                   <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : isPlaying ? (
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                   </svg>
                 ) : (
                   <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M8 5v14l11-7z"/>
                   </svg>
                 )}
               </button>
               <button
                 onClick={onClose}
                 disabled={audioLoading}
                 className="w-10 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                 title="Остановить"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M6 6h12v12H6z"/>
                 </svg>
               </button>
             </div>

                         {/* Прогресс-бар */}
             <div className="flex-1 mx-6 max-w-lg">
               <div className="flex items-center space-x-3">
                 <span className="text-sm text-gray-500 dark:text-gray-400 w-12">
                   {formatTime(currentTime)}
                 </span>
                 <input
                   type="range"
                   min="0"
                   max="100"
                   value={duration > 0 ? (currentTime / duration) * 100 : 0}
                   onChange={onSeek}
                   className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                   style={{
                     background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
                   }}
                 />
                 <span className="text-sm text-gray-500 dark:text-gray-400 w-12">
                   {formatTime(duration)}
                 </span>
               </div>
             </div>

                         {/* Громкость */}
             <div className="relative flex items-center space-x-3">
               <div 
                 className="relative"
                 onMouseEnter={() => {
                   if (volumeTimeoutRef.current) {
                     clearTimeout(volumeTimeoutRef.current);
                   }
                   setShowVolumeSlider(true);
                 }}
                 onMouseLeave={() => {
                   volumeTimeoutRef.current = setTimeout(() => {
                     setShowVolumeSlider(false);
                   }, 1000);
                 }}
               >
                 <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                 </svg>
                 
                                   {/* Вертикальный слайдер громкости */}
                  {showVolumeSlider && (
                    <div 
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700"
                      onMouseEnter={() => {
                        if (volumeTimeoutRef.current) {
                          clearTimeout(volumeTimeoutRef.current);
                        }
                      }}
                      onMouseLeave={() => {
                        volumeTimeoutRef.current = setTimeout(() => {
                          setShowVolumeSlider(false);
                        }, 1000);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={onVolumeChange}
                            className="w-2 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
                            style={{
                              background: `linear-gradient(to top, #8b5cf6 0%, #8b5cf6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">
                          {Math.round(volume * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
               </div>
             </div>

                         {/* Кнопка закрытия */}
             <button
               onClick={onClose}
               className="w-10 h-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
               title="Закрыть плеер"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
        </div>
      </div>


    </>
  );
}

export default MusicPlayer;
