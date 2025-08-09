import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LoopCard from '../components/LoopCard';
import PremiumModal from '../components/PremiumModal';

function LoopsPage() {
  const [loops, setLoops] = useState([]); // кэш загруженных лупов
  const [loading, setLoading] = useState(true); // первоначальная загрузка
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingLoopId, setPlayingLoopId] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [downloadingLoopId, setDownloadingLoopId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' или 'compact'
  const [visibleCount, setVisibleCount] = useState(15); // сколько показываем на странице
  const [perPageBase, setPerPageBase] = useState(6); // показывать по N (для компакт умножим на 3)
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const audioRef = useRef(null);

  // Число карточек на странице зависит от выбора пользователя
  // Для компактного вида умножаем базовое значение на 3
  const PAGE_SIZE_DETAILED = perPageBase; // 6 или 18
  const PAGE_SIZE_COMPACT = perPageBase * 3; // 18 или 54
  const CACHE_CHUNK_DETAILED = 60; // грузим в кэш
  const CACHE_CHUNK_COMPACT = 180;

  const getPageSize = () => (viewMode === 'compact' ? PAGE_SIZE_COMPACT : PAGE_SIZE_DETAILED);
  // Загружаем за раз столько, сколько показываем на странице
  const getCacheChunkSize = () => getPageSize();

  const processIncomingData = (data) => {
    let processedData = data;
    if (data && data.loops && Array.isArray(data.loops)) {
      processedData = data.loops;
    } else if (data && data.data && Array.isArray(data.data)) {
      processedData = data.data;
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      processedData = Object.values(data);
    } else if (Array.isArray(data)) {
      processedData = data;
    } else {
      processedData = [];
    }
    return processedData;
  };

  const dedupeLoops = (items) => {
    const seen = new Set();
    const unique = [];
    for (const item of items || []) {
      const key = item?.loop?.loop_id ?? item?.loop?.loop_name ?? item?.id ?? JSON.stringify(item);
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
    return unique;
  };

  const fetchLoops = async (offset, limit) => {
    const base = `https://mycollabs.ru.tuna.am/loops`;

    const smallLimit = getPageSize();
    const page1 = Math.floor(offset / Math.max(limit, 1)) + 1;

    const candidates = [
      `${base}?offset=${offset}&limit=${limit}`,
      `${base}?offset=${offset}&count=${limit}`,
      `${base}?start=${offset}&limit=${limit}`,
      `${base}?skip=${offset}&take=${limit}`,
      `${base}?page=${page1}&page_size=${limit}`,
      `${base}?page=${page1}&per_page=${limit}`,
      // Повтор с меньшим лимитом, если сервер не принимает большой
      `${base}?offset=${offset}&limit=${smallLimit}`,
      `${base}?offset=${offset}&count=${smallLimit}`,
      `${base}?start=${offset}&limit=${smallLimit}`,
      `${base}?skip=${offset}&take=${smallLimit}`,
      `${base}?page=${page1}&page_size=${smallLimit}`,
      `${base}?page=${page1}&per_page=${smallLimit}`,
    ];

    let lastErr = null;
    for (const url of candidates) {
      try {
        const response = await axios.get(url);
        return processIncomingData(response.data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 400 || status === 404 || status === 422) {
          lastErr = err;
          continue;
        }
        throw err;
      }
    }
    throw lastErr || new Error('Не удалось получить данные');
  };

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
        setAudioLoading(false);
        return;
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
          
          // Отправляем GET запрос с именем файла в URL (без параметра download)
          const url = `https://mycollabs.ru.tuna.am/loops/${encodeURIComponent(filename)}`;
          console.log('Отправляем запрос на URL для воспроизведения:', url);
          
          // Используем fetch для лучшего контроля над загрузкой
          const response = await fetch(url, {
            headers: {
              'Accept': 'audio/mp3, */*'
            }
          });
          
          console.log('Статус ответа:', response.status);
          console.log('Content-Type:', response.headers.get('content-type'));
          
          // Проверяем, является ли ответ аудио файлом
          if (response.headers.get('content-type') && response.headers.get('content-type').includes('audio/')) {
            console.log('Сервер возвращает аудио файл напрямую');
            setCurrentAudio(url);
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
      
      // Используем URL с параметром download=True
      const downloadUrl = `https://mycollabs.ru.tuna.am/loops/${encodeURIComponent(filename)}?download=True`;
      
      // Используем fetch для принудительного скачивания
      console.log('Загружаем файл для скачивания с параметром download=True...');
      
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

  // Первичная загрузка и перезагрузка при смене режима отображения
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsFetchingMore(false);
        setHasMore(true);
        setLoops([]);
        const pageSize = getPageSize();
        const chunkSize = getCacheChunkSize();
        setVisibleCount(pageSize);
        const chunk = await fetchLoops(0, chunkSize);
        const unique = dedupeLoops(chunk);
        setLoops(unique);
        if (!chunk || chunk.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError('Не удалось загрузить данные с сервера');
        setLoops([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Инициализация perPageBase из localStorage
  useEffect(() => {
    const saved = Number(localStorage.getItem('loops_per_page_base'));
    if (saved === 6 || saved === 18) {
      setPerPageBase(saved);
    }
  }, []);

  // При изменении количества "Показывать по" сохраняем выбор и при необходимости догружаем до полного экрана
  useEffect(() => {
    const pageSize = getPageSize();
    setVisibleCount(pageSize);
    localStorage.setItem('loops_per_page_base', String(perPageBase));

    const topUpIfNeeded = async () => {
      if (isFetchingMore || !hasMore) return;
      if (Array.isArray(loops) && loops.length < pageSize) {
        try {
          setIsFetchingMore(true);
          const nextChunk = await fetchLoops(loops.length, pageSize);
          const merged = dedupeLoops([...(loops || []), ...(nextChunk || [])]);
          setLoops(merged);
          const noGrowth = merged.length === loops.length;
          if (!nextChunk || nextChunk.length === 0 || noGrowth) {
            setHasMore(false);
          }
        } catch (e) {
          // молча не ломаем UX; кнопка догрузки останется доступной
          // при ошибке просто не меняем hasMore
        } finally {
          setIsFetchingMore(false);
        }
      }
    };

    topUpIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPageBase, viewMode]);

  const handleLoadMore = async () => {
    const pageSize = getPageSize();
    const needMoreFromCache = visibleCount + pageSize > loops.length;
    if (!needMoreFromCache) {
      setVisibleCount((prev) => prev + pageSize);
      return;
    }
    if (!hasMore || isFetchingMore) return;
    try {
      setIsFetchingMore(true);
      const chunkSize = getCacheChunkSize();
      const nextOffset = loops.length; // (x-1) * limit
      const nextChunk = await fetchLoops(nextOffset, chunkSize);
      const merged = dedupeLoops([...loops, ...(nextChunk || [])]);
      const noGrowth = merged.length === loops.length;
      setLoops(merged);
      if (!nextChunk || nextChunk.length === 0 || noGrowth) {
        setHasMore(false);
      }
      setVisibleCount((prev) => prev + pageSize);
    } catch (err) {
      console.error('Ошибка подгрузки данных:', err);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  };

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
      <section className="py-8 sm:py-16 overflow-visible">
        <div className="container mx-auto px-4 sm:px-6 overflow-visible">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Доступные лупы</h2>
            
            {/* Переключатель стилей и "Показывать по" */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'detailed'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span className="flex items-center">
                    <span className="mr-2">📋</span>
                    Подробно
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span className="flex items-center">
                    <span className="mr-2">📊</span>
                    Компактно
                  </span>
                </button>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <span className="text-sm text-gray-600 mr-2">Показывать по:</span>
                <button
                  onClick={() => setPerPageBase(6)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    perPageBase === 6 ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {viewMode === 'compact' ? 6 * 3 : 6}
                </button>
                <button
                  onClick={() => setPerPageBase(18)}
                  className={`ml-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    perPageBase === 18 ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {viewMode === 'compact' ? 18 * 3 : 18}
                </button>
              </div>
            </div>
          </div>
          
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
            <div className={`overflow-visible ${viewMode === 'compact' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "grid grid-cols-1 gap-6 max-w-4xl mx-auto"
            }`}>
              {loops.slice(0, visibleCount).map((item, index) => (
                <LoopCard
                  key={`${item?.loop?.loop_id ?? item?.loop?.loop_name ?? 'i'}-${index}`}
                  item={item}
                  index={index}
                  playingLoopId={playingLoopId}
                  audioLoading={audioLoading}
                  audioProgress={audioProgress}
                  downloadingLoopId={downloadingLoopId}
                  downloadProgress={downloadProgress}
                  onPlayAudio={handlePlayAudio}
                  onDownload={handleDownload}
                  compact={viewMode === 'compact'}
                />
              ))}
            </div>
          )}
          {/* Ещё лупы */}
          {Array.isArray(loops) && loops.length > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingMore || !hasMore}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm ${
                  isFetchingMore
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : hasMore
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFetchingMore ? 'Загружаем...' : hasMore ? 'ЕЩЁ ЛУПЫ' : 'Больше лупов нет'}
              </button>
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
      
      {/* Premium Modal */}
      {/* <PremiumModal /> */}
    </div>
  );
}

export default LoopsPage;
