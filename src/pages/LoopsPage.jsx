import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function LoopsPage() {
  const [loops, setLoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingLoopId, setPlayingLoopId] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [downloadingLoopId, setDownloadingLoopId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const audioRef = useRef(null);

  const handlePlayAudio = async (loopId, loopURL) => {
    // Остановить текущее воспроизведение
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Если нажимаем на тот же луп, просто останавливаем
    if (playingLoopId === loopId) {
      setPlayingLoopId(null);
      setCurrentAudio(null);
      setAudioLoading(false);
      setAudioProgress(0);
      return;
    }

    try {
      setAudioLoading(true);
      
      // Если у нас есть временная ссылка, используем её напрямую
      if (loopURL && (loopURL.startsWith('http') || loopURL.startsWith('https'))) {
        console.log('Используем прямую ссылку:', loopURL);
        setCurrentAudio(loopURL);
        setPlayingLoopId(loopId);
        setAudioLoading(false); // Сбрасываем загрузку после установки ссылки
        return;
      }
      
      // Проверяем, есть ли ссылка в других форматах
      if (!loopURL && loopId) {
        console.log('Ссылка не найдена в переданных данных');
      }
      
      // Если у нас есть только ID лупа, получаем временную ссылку по имени файла
      if (loopId) {
        try {
          // Найдем луп в данных, чтобы получить имя файла
          const currentLoop = loops.find(loop => loop.loop?.loop_id === loopId);
          
          if (!currentLoop || !currentLoop.loop?.loop_name) {
            throw new Error('Не удалось найти имя файла для лупа');
          }
          
          const filename = currentLoop.loop.loop_name;
          console.log('Получаем временную ссылку для файла:', filename);
          
          // Отправляем GET запрос с именем файла в URL
          const url = `https://mycolconn.ru.tuna.am/loops/${encodeURIComponent(filename)}`;
          console.log('Отправляем запрос на URL:', url);
          
          // Используем fetch для лучшего контроля над загрузкой
          const response = await fetch(url, {
            headers: {
              'Accept': 'audio/mp3, */*'
              // Убираем Range заголовок, позволяем серверу самому решать
            }
          });
          
          console.log('Статус ответа:', response.status);
          console.log('Content-Type:', response.headers.get('content-type'));
          console.log('Content-Length:', response.headers.get('content-length'));
          console.log('Accept-Ranges:', response.headers.get('accept-ranges'));
          console.log('Content-Range:', response.headers.get('content-range'));
          console.log('Transfer-Encoding:', response.headers.get('transfer-encoding'));
          
          // Проверяем, является ли ответ аудио файлом
          if (response.headers.get('content-type') && response.headers.get('content-type').includes('audio/')) {
            console.log('Сервер возвращает аудио файл напрямую');
            
            // Проверяем поддержку чанков и частичных запросов
            const acceptRanges = response.headers.get('accept-ranges');
            const transferEncoding = response.headers.get('transfer-encoding');
            const contentRange = response.headers.get('content-range');
            
            console.log('Сервер поддерживает частичные запросы:', acceptRanges);
            console.log('Transfer-Encoding (чанки):', transferEncoding);
            console.log('Content-Range:', contentRange);
            
            // Если сервер поддерживает чанки или частичные запросы
            if (acceptRanges === 'bytes' || transferEncoding === 'chunked' || contentRange) {
              console.log('Сервер поддерживает потоковую передачу, используем прямую ссылку');
              setCurrentAudio(url);
            } else {
              console.log('Сервер не поддерживает потоковую передачу, но используем прямую ссылку');
              setCurrentAudio(url);
            }
            
            setPlayingLoopId(loopId);
            setAudioLoading(false);
          } else {
            throw new Error('Сервер не вернул аудио файл');
          }
        } catch (error) {
          console.error('Ошибка при получении временной ссылки:', error);
          if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.message;
            throw new Error(`Ошибка сервера (${status}): ${message}`);
          } else if (error.request) {
            throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
          } else {
            throw new Error(`Ошибка запроса: ${error.message}`);
          }
        }
      } else {
        throw new Error('ID лупа не предоставлен');
      }
    } catch (error) {
      console.error('Ошибка при получении временной ссылки:', error);
      console.log('Loop ID:', loopId, 'Loop URL:', loopURL);
      alert(`Ошибка при получении аудио файла: ${error.message}`);
      setAudioLoading(false);
      setPlayingLoopId(null);
      setCurrentAudio(null);
    }
  };

  const handleAudioEnded = () => {
    console.log('Аудио воспроизведение завершено');
    setPlayingLoopId(null);
    setCurrentAudio(null);
    setAudioLoading(false);
    setAudioProgress(0);
  };

  const handleAudioError = (error) => {
    console.error('Ошибка воспроизведения аудио:', error);
    setPlayingLoopId(null);
    setCurrentAudio(null);
    setAudioLoading(false);
    setAudioProgress(0);
    alert('Ошибка воспроизведения аудио. Возможно, файл недоступен или временная ссылка истекла.');
  };

  const handleAudioLoadStart = () => {
    console.log('Начало загрузки аудио');
    setAudioLoading(true);
  };

  const handleAudioCanPlay = () => {
    console.log('Аудио готово к воспроизведению');
    setAudioLoading(false);
  };

  const handleAudioProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.buffered.length > 0) 
        ? (audioRef.current.buffered.end(audioRef.current.buffered.length - 1) / audioRef.current.duration) * 100
        : 0;
      setAudioProgress(progress);
    }
  };

  const handleDownload = async (loopId, filename) => {
    try {
      setDownloadingLoopId(loopId);
      console.log('Начинаем скачивание файла:', filename);
      
      const downloadUrl = `https://mycolconn.ru.tuna.am/loops/${encodeURIComponent(filename)}`;
      
      // Используем fetch для принудительного скачивания
      console.log('Загружаем файл для скачивания...');
      
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Получаем размер файла для прогресса
      const contentLength = response.headers.get('content-length');
      const totalSize = contentLength ? parseInt(contentLength) : 0;
      
      console.log('Размер файла:', totalSize, 'байт');
      
      // Получаем файл как blob с отслеживанием прогресса
      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Обновляем прогресс
        if (totalSize > 0) {
          const progress = (receivedLength / totalSize) * 100;
          setDownloadProgress(progress);
          console.log(`Прогресс скачивания: ${Math.round(progress)}%`);
        }
      }
      
      // Собираем blob из чанков
      const blob = new Blob(chunks, { type: 'audio/mp3' });
      console.log('Файл загружен, размер:', blob.size, 'байт');
      
      // Создаем blob URL для скачивания
      const blobUrl = URL.createObjectURL(blob);
      
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename; // Принудительное скачивание
      link.style.display = 'none';
      
      // Добавляем в DOM и кликаем
      document.body.appendChild(link);
      link.click();
      
      // Удаляем ссылку из DOM
      document.body.removeChild(link);
      
      // Очищаем blob URL через некоторое время
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        console.log('Blob URL очищен');
      }, 1000);
      
      console.log('Скачивание файла запущено:', filename);
      alert(`Скачивание файла "${filename}" запущено!`);
      
    } catch (error) {
      console.error('Ошибка при скачивании:', error);
      alert(`Ошибка при скачивании файла: ${error.message}`);
    } finally {
      setDownloadingLoopId(null);
      setDownloadProgress(0);
    }
  };

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('https://mycolconn.ru.tuna.am/loops');
        let data = response.data;
        
        // Обработка различных форматов данных
        let processedData = data;
        
        // Если данные приходят в объекте с ключом 'loops'
        if (data && data.loops && Array.isArray(data.loops)) {
          processedData = data.loops;
        }
        // Если данные приходят в объекте с ключом 'data'
        else if (data && data.data && Array.isArray(data.data)) {
          processedData = data.data;
        }
        // Если данные приходят как объект, преобразуем в массив
        else if (data && typeof data === 'object' && !Array.isArray(data)) {
          processedData = Object.values(data);
        }
        // Если данные уже массив
        else if (Array.isArray(data)) {
          processedData = data;
        }
        // Если данные не в ожидаемом формате, создаем пустой массив
        else {
          console.warn('Неожиданный формат данных:', data);
          processedData = [];
        }
        
        setLoops(processedData);
        setError(null);
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError('Не удалось загрузить данные с сервера');
        setLoops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoops();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка лупов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/qn9FkoqYgI4?si=cPsxS_h9rSZQmlhC&autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Послушать старика и пойте по его совету!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Музыкальные Лупы
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Откройте для себя коллекцию уникальных музыкальных лупов для вашего творчества
          </p>
        </div>
      </section>

      {/* Loops List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Доступные лупы</h2>
          
          {!Array.isArray(loops) || loops.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Нет данных</h3>
              <p className="text-gray-500">В данный момент нет доступных лупов</p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  Полученные данные: {JSON.stringify(loops, null, 2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loops.map((item, index) => (
                <div key={item.loop?.loop_id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <picture>
                          <source 
                            srcSet={item.user?.avatar_URL?.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp') || '/images/default-avatar.webp'} 
                            type="image/webp"
                          />
                          <source 
                            srcSet={item.user?.avatar_URL?.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.avif') || '/images/default-avatar.avif'} 
                            type="image/avif"
                          />
                          <source 
                            srcSet={item.user?.avatar_URL?.replace(/\.(webp|avif|gif|bmp|tiff)$/i, '.jpg') || '/images/default-avatar.jpg'} 
                            type="image/jpeg"
                          />
                          <source 
                            srcSet={item.user?.avatar_URL?.replace(/\.(webp|avif|jpg|jpeg|gif|bmp|tiff)$/i, '.png') || '/images/default-avatar.png'} 
                            type="image/png"
                          />
                          <img 
                            src={item.user?.avatar_URL || '/images/default-avatar.jpg'} 
                            alt={item.user?.nickname || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        </picture>
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg" style={{display: 'none'}}>
                          {item.user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {item.loop?.loop_name || 'Без названия'}
                        </h3>
                        <p className="text-sm text-gray-500">{item.user?.nickname || 'Неизвестный артист'}</p>
                        {item.user?.is_billboard_producer && (
                          <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                            Billboard Producer
                          </span>
                        )}
                        {item.user?.status && item.user.status !== '[none]' && (
                          <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ml-1 ${
                            item.user.status === 'PLATINUM' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
                          }`}>
                            {item.user.status}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">BPM</p>
                        <p className="font-semibold text-gray-800">{item.loop?.bpm || 'N/A'}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Тональность</p>
                        <p className="font-semibold text-gray-800">{item.loop?.key || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                      <span>Загружено: {new Date(item.loop?.uploaded_at).toLocaleDateString('ru-RU')}</span>
                      {item.loop?.need_labs && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                          Требует Labs
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-4 text-sm">
                        <div className="flex items-center">
                          <span className="text-green-600 mr-1">👍</span>
                          <span>{item.likes || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-red-600 mr-1">👎</span>
                          <span>{item.dislikes || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-purple-600 mr-1">⭐</span>
                          <span>{item.superlikes || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
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
                          
                          handlePlayAudio(item.loop?.loop_id, tempUrl);
                        }} 
                        disabled={audioLoading && playingLoopId === item.loop?.loop_id}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                          playingLoopId === item.loop?.loop_id 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        } ${audioLoading && playingLoopId === item.loop?.loop_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {audioLoading && playingLoopId === item.loop?.loop_id 
                          ? `⏳ Загрузка ${Math.round(audioProgress)}%` 
                          : playingLoopId === item.loop?.loop_id 
                            ? '⏹️ Остановить' 
                            : '▶️ Слушать'
                        }
                      </button>
                      <button 
                        onClick={() => handleDownload(item.loop?.loop_id, item.loop?.loop_name)}
                        disabled={downloadingLoopId === item.loop?.loop_id}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
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
                      <div className="mt-2 text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
                        <span className="flex items-center">
                          <span className="mr-1">⏰</span>
                          Временная ссылка для прослушивания
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Скрытый аудио элемент для воспроизведения */}
      {currentAudio && (
        <audio
          ref={audioRef}
          src={currentAudio}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          onLoadStart={handleAudioLoadStart}
          onCanPlay={handleAudioCanPlay}
          onProgress={handleAudioProgress}
          style={{ display: 'none' }}
          autoPlay
          preload="metadata"
          controls={false}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}

export default LoopsPage;
