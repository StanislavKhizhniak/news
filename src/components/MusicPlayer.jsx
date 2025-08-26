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
  const [isMuted, setIsMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(1);
  const volumeTimeoutRef = useRef(null);
  const volumeSliderRef = useRef(null);

  useEffect(() => {
    // Загружаем сохраненную громкость при инициализации
    const savedVolume = localStorage.getItem('playerVolume');
    if (savedVolume !== null) {
      const volumeValue = parseFloat(savedVolume);
      if (!isNaN(volumeValue) && volumeValue >= 0 && volumeValue <= 1) {
        onVolumeChange({ target: { value: volumeValue } });
      }
    } else {
      // Устанавливаем громкость по умолчанию
      onVolumeChange({ target: { value: 0.7 } });
    }

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

  const handleVolumeClick = (e) => {
    if (!volumeSliderRef.current) return;
    
    const rect = volumeSliderRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const newVolume = Math.max(0, Math.min(1, 1 - (y / rect.height)));
    onVolumeChange({ target: { value: newVolume } });
    
    // Сохраняем громкость в localStorage
    localStorage.setItem('playerVolume', newVolume.toString());
  };

  const startVolumeDrag = (e) => {
    e.preventDefault();
    if (!volumeSliderRef.current) return;
    
    const rect = volumeSliderRef.current.getBoundingClientRect();
    
    const updateVolume = (e) => {
      const y = e.clientY - rect.top;
      const newVolume = Math.max(0, Math.min(1, 1 - (y / rect.height)));
      onVolumeChange({ target: { value: newVolume } });
      localStorage.setItem('playerVolume', newVolume.toString());
    };
    
    const stopDrag = () => {
      document.removeEventListener('mousemove', updateVolume);
      document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', updateVolume);
    document.addEventListener('mouseup', stopDrag);
    updateVolume(e);
  };

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange({ target: { value: volumeBeforeMute } });
      setIsMuted(false);
    } else {
      setVolumeBeforeMute(volume);
      onVolumeChange({ target: { value: 0 } });
      setIsMuted(true);
    }
  };

  const seek = (seconds) => {
    if (!audioRef.current) return;
    const newTime = audioRef.current.currentTime + seconds;
    audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const newTime = progress * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    
    // Также вызываем onSeek для обновления состояния в родительском компоненте
    if (onSeek) {
      onSeek({ target: { value: progress * 100 } });
    }
  };

  if (!isOpen || !currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
         style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}>
      
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Левая секция - информация о треке и громкость */}
          <div className="flex items-center space-x-5 flex-1 min-w-0 max-w-[450px]">
            {/* Обложка трека */}
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
            
            {/* Информация о треке */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                {currentTrack.title || 'Без названия'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {currentTrack.artist || 'Неизвестный артист'}
              </p>
            </div>

            {/* Контейнер громкости */}
            <div className="relative flex items-center flex-shrink-0"
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
                 }}>
              
              {/* Кнопка громкости */}
              <button
                onClick={toggleMute}
                className="w-10 h-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full flex items-center justify-center transition-colors music-player-btn"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
              
              {/* Вертикальный слайдер громкости */}
              {showVolumeSlider && (
                <div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 volume-slider-container"
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
                  <div className="flex flex-col items-center space-y-2">
                                         <div 
                       ref={volumeSliderRef}
                       className="relative w-1 h-20 bg-gray-200 dark:bg-gray-600 rounded cursor-pointer"
                       onClick={handleVolumeClick}
                       onMouseDown={startVolumeDrag}
                     >
                      <div 
                        className="absolute bottom-0 left-0 w-full bg-purple-600 rounded transition-all duration-100"
                        style={{ height: `${volume * 100}%` }}
                      />
                                             <div 
                         className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-600 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer"
                         style={{ top: `${(1 - volume) * 100}%` }}
                         onMouseDown={startVolumeDrag}
                       />
                    </div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {Math.round(volume * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Центральная секция - контролы воспроизведения */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Кнопка перемотки назад */}
            <button
              onClick={() => seek(-10)}
              className="w-10 h-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full flex items-center justify-center transition-colors music-player-btn"
              title="Перемотка назад 10 сек"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
            </button>

            {/* Кнопка воспроизведения/паузы */}
            <button
              onClick={isPlaying ? onPause : onPlay}
              disabled={audioLoading}
              className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg music-player-btn"
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

            {/* Кнопка перемотки вперед */}
            <button
              onClick={() => seek(10)}
              className="w-10 h-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full flex items-center justify-center transition-colors music-player-btn"
              title="Перемотка вперед 10 сек"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5v4l5-5-5-5v4c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
              </svg>
            </button>
          </div>

          {/* Правая секция - прогресс-бар и кнопка закрытия */}
          <div className="flex items-center space-x-4 flex-1 min-w-0 max-w-[450px]">
            {/* Прогресс-бар */}
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8 flex-shrink-0">
                {formatTime(currentTime)}
              </span>
              <div 
                className="flex-1 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg cursor-pointer relative overflow-hidden music-player-progress"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-100"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
                {/* Waveform bars (упрощенная версия) */}
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center gap-px px-2 pointer-events-none">
                  {Array.from({ length: 50 }, (_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 bg-white bg-opacity-30 rounded-sm transition-all duration-100 ${
                        isPlaying && duration > 0 && (i / 50) < (currentTime / duration) ? 'music-player-waveform' : ''
                      }`}
                      style={{ 
                        height: `${Math.random() * 20 + 10}px`,
                        opacity: duration > 0 && (i / 50) < (currentTime / duration) ? 0.8 : 0.3
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8 flex-shrink-0">
                {formatTime(duration)}
              </span>
            </div>

            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 music-player-btn"
              title="Закрыть плеер"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
