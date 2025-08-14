import React from 'react';
import StatusTooltip from './StatusTooltip';

function LoopCard({ 
  item, 
  index, 
  playingLoopId, 
  audioLoading, 
  audioProgress, 
  downloadingLoopId, 
  downloadProgress, 
  onPlayAudio, 
  onDownload,
  compact = false,
  isPlayerOpen = false
}) {
  const isCurrentlyPlaying = playingLoopId === item.loop?.loop_id;
  const isSelected = isCurrentlyPlaying && isPlayerOpen;
  const isPaused = isCurrentlyPlaying && !isPlayerOpen;
  const isTrackSelected = isCurrentlyPlaying; // Карточка выбрана, если трек активен (играет или на паузе)
  
  return (
    <div 
      key={item.loop?.loop_id || index} 
      className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-200 relative ${
        isTrackSelected ? 'bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500 shadow-lg' : 'bg-white'
      }`}
    >
      {/* Уведомление LABS в стиле мессенджера */}
      {item.loop?.need_labs && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
            LABS
          </div>
        </div>
      )}
      {compact ? (
        // Компактный режим (3 в ряд)
        <div className="p-4 relative overflow-visible">
          {/* Уведомление LABS для компактного режима */}
          {item.loop?.need_labs && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-lg">
                LABS
              </div>
            </div>
          )}
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-3">
              {item.user?.avatar_URL ? (
                <img 
                  src={item.user.avatar_URL} 
                  alt={item.user?.nickname || 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm ${item.user?.avatar_URL ? 'hidden' : 'block'}`}>
                {item.user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {item.loop?.title || 'Без названия'}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs text-gray-500 truncate">{item.user?.nickname || 'Неизвестный артист'}</p>
                {item.user?.is_billboard_producer && (
                  <div className="relative group">
                    <img src="/svg/awards/bilboard.svg" alt="Billboard Producer" className="w-4 h-4 cursor-help" />
                    <StatusTooltip status="BILLBOARD" />
                  </div>
                )}
                {item.user?.status && item.user.status !== '[none]' && (
                  <div className="relative group">
                    {item.user.status === 'PLATINUM' && (
                      <>
                        <img src="/svg/awards/platinum.svg" alt="Platinum" className="w-4 h-4 cursor-help" />
                        <StatusTooltip status="PLATINUM" />
                      </>
                    )}
                    {item.user.status === 'GOLD' && (
                      <>
                        <img src="/svg/awards/gold.svg" alt="Gold" className="w-4 h-4 cursor-help" />
                        <StatusTooltip status="GOLD" />
                      </>
                    )}
                    {item.user.status === 'VIP' && (
                      <>
                        <img src="/svg/awards/vip.svg" alt="VIP" className="w-4 h-4 cursor-help" />
                        <StatusTooltip status="VIP" />
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Теги */}
              {item.loop?.tags && Array.isArray(item.loop.tags) && item.loop.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.loop.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="inline-block text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.loop.tags.length > 3 && (
                    <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      +{item.loop.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                const tempUrl = item.loop?.temporary_url || 
                              item.loop?.loop_URL || 
                              item.loop?.audio_url ||
                              item.loop?.stream_url ||
                              item.loop?.url ||
                              item.temporary_url || 
                              item.audio_url ||
                              item.stream_url ||
                              item.url;
                
                onPlayAudio(item.loop?.loop_id, tempUrl);
              }} 
              disabled={audioLoading && playingLoopId === item.loop?.loop_id}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors text-xs ${
                isTrackSelected 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } ${audioLoading && isCurrentlyPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {audioLoading && isCurrentlyPlaying 
                ? `⏳ ${Math.round(audioProgress)}%` 
                : isTrackSelected 
                  ? (isCurrentlyPlaying ? '⏸️' : '▶️')
                  : '▶️'
              }
            </button>
            <button 
              onClick={() => onDownload(item.loop?.loop_id, item.loop?.title)}
              disabled={downloadingLoopId === item.loop?.loop_id}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors text-xs ${
                downloadingLoopId === item.loop?.loop_id 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white opacity-50 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {downloadingLoopId === item.loop?.loop_id 
                ? `⏳ ${Math.round(downloadProgress)}%` 
                : '📥'
              }
            </button>
          </div>
        </div>
      ) : (
        // Подробный режим (1 в ряд)
        <div className="p-4 sm:p-6 overflow-visible">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
            <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0">
            {item.user?.avatar_URL ? (
              <img 
                src={item.user.avatar_URL} 
                alt={item.user?.nickname || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg ${item.user?.avatar_URL ? 'hidden' : 'block'}`}>
              {item.user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              {item.loop?.title || 'Без названия'}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-sm text-gray-500">{item.user?.nickname || 'Неизвестный артист'}</p>
                          {item.user?.is_billboard_producer && (
              <div className="relative group">
                <img src="/svg/awards/bilboard.svg" alt="Billboard Producer" className="w-6 h-6 cursor-help" />
                <StatusTooltip status="BILLBOARD" />
              </div>
            )}
            {item.user?.status && item.user.status !== '[none]' && (
              <div className="relative group">
                {item.user.status === 'PLATINUM' && (
                  <>
                    <img src="/svg/awards/platinum.svg" alt="Platinum" className="w-6 h-6 cursor-help" />
                    <StatusTooltip status="PLATINUM" />
                  </>
                )}
                {item.user.status === 'GOLD' && (
                  <>
                    <img src="/svg/awards/gold.svg" alt="Gold" className="w-6 h-6 cursor-help" />
                    <StatusTooltip status="GOLD" />
                  </>
                )}
                {item.user.status === 'VIP' && (
                  <>
                    <img src="/svg/awards/vip.svg" alt="VIP" className="w-6 h-6 cursor-help" />
                    <StatusTooltip status="VIP" />
                  </>
                )}
                {!['PLATINUM', 'GOLD', 'VIP'].includes(item.user.status) && (
                  <span className={`inline-block text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 cursor-help`}>
                    {item.user.status}
                  </span>
                )}
              </div>
            )}
            </div>
            
            {/* Теги */}
            {item.loop?.tags && Array.isArray(item.loop.tags) && item.loop.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.loop.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="inline-block text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">BPM</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800">{item.loop?.bpm || 'N/A'}</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Тональность</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800">{item.loop?.key || 'N/A'}</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Лайки</p>
            <p className="text-sm sm:text-base font-semibold text-green-600">{item.likes || 0}</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Дизлайки</p>
            <p className="text-sm sm:text-base font-semibold text-red-600">{item.dislikes || 0}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
          <button 
            onClick={() => {
              // Ищем временную ссылку в различных местах данных
              const tempUrl = item.loop?.temporary_url || 
                            item.loop?.loop_URL || 
                            item.loop?.audio_url ||
                            item.loop?.stream_url ||
                            item.loop?.url ||
                            item.temporary_url || 
                            item.audio_url ||
                            item.stream_url ||
                            item.url;
              
              onPlayAudio(item.loop?.loop_id, tempUrl);
            }} 
            disabled={audioLoading && isCurrentlyPlaying}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
              isTrackSelected 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            } ${audioLoading && isCurrentlyPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {audioLoading && isCurrentlyPlaying 
              ? `⏳ Загрузка ${Math.round(audioProgress)}%` 
              : isTrackSelected 
                ? (isCurrentlyPlaying ? '⏸️ Пауза' : '▶️ Продолжить')
                : '▶️ Слушать'
            }
          </button>
          <button 
            onClick={() => onDownload(item.loop?.loop_id, item.loop?.title)}
            disabled={downloadingLoopId === item.loop?.loop_id}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
              downloadingLoopId === item.loop?.loop_id 
                ? 'bg-blue-600 hover:bg-blue-700 text-white opacity-50 cursor-not-allowed' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {downloadingLoopId === item.loop?.loop_id 
              ? `⏳ Скачивание ${Math.round(downloadProgress)}%` 
              : '📥 Скачать'
            }
          </button>
        </div>
        
        {/* Информация о временной ссылке */}
        {(item.loop?.temporary_url || item.loop?.audio_url || item.loop?.stream_url || item.loop?.url || item.temporary_url || item.audio_url || item.stream_url || item.url) && (
          <div className="mt-3 text-xs text-gray-500 bg-yellow-50 p-2 sm:p-3 rounded border border-yellow-200">
            <span className="flex items-center">
              <span className="mr-1">⏰</span>
              Временная ссылка для прослушивания
            </span>
          </div>
        )}
        
        {/* Дата загрузки и дополнительная информация */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-xs sm:text-sm text-gray-500 gap-2">
          <span>Загружено: {new Date(item.loop?.uploaded_at).toLocaleDateString('ru-RU')}</span>
          <div className="flex items-center">
            <span className="text-purple-600 mr-1">⭐</span>
            <span>{item.superlikes || 0}</span>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default LoopCard;
