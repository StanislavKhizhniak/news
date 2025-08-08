import React from 'react';
import { getGenreColor } from '../constants/colors';

function ProducerRequestCard({ request, index, isLast = false }) {
  const getGenreClass = (genre) => {
    const genreClasses = {
      'House': 'genre-house',
      'Techno': 'genre-techno',
      'DnB': 'genre-dnb',
      'Hip-Hop': 'genre-hiphop',
      'Trap': 'genre-trap',
      'Dubstep': 'genre-dubstep',
      'default': 'bg-gray-500'
    };
    return genreClasses[genre] || genreClasses.default;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
      isLast ? 'opacity-60 relative' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Левая часть - основная информация */}
          <div className="flex-1 mr-6">
            {/* Заголовок и жанр */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-800">
                {request.title || 'Без названия'}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getGenreClass(request.genre)}`}>
                {request.genre || 'Не указан'}
              </span>
            </div>

            {/* Описание */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {request.description || 'Описание отсутствует'}
            </p>

            {/* Требования и информация о продюсере */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">BPM</p>
                  <p className="font-semibold text-gray-800">{request.bpm || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Ключ</p>
                  <p className="font-semibold text-gray-800">{request.key || 'N/A'}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Бюджет:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {request.budget ? `$${request.budget}` : 'Не указан'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть - дополнительная информация и кнопки */}
          <div className="flex flex-col items-end space-y-3 min-w-[200px]">
            {/* Информация о продюсере */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold mr-2">
                {request.producer?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <span className="text-sm text-gray-600">{request.producer || 'Анонимный продюсер'}</span>
            </div>

            {/* Статус и дата */}
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                request.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {request.status === 'active' ? 'Активен' : 'Завершен'}
              </span>
              <span className="text-xs text-gray-500">
                {request.date || 'Недавно'}
              </span>
            </div>

            {/* Кнопка действия */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors text-sm">
              Откликнуться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProducerRequestCard;
