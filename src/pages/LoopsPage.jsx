import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoopsPage() {
  const [loops, setLoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('https://s1bz53-93-81-193-225.ru.tuna.am/loops');
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
                      <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Слушать
                      </button>
                      <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                        Скачать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default LoopsPage;
