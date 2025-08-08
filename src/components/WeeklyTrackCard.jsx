import React from 'react';

function WeeklyTrackCard({ track, rank }) {
  const getRankClass = (rank) => {
    switch (rank) {
      case 1:
        return 'rank-1 text-white';
      case 2:
        return 'rank-2 text-white';
      case 3:
        return 'rank-3 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Ранг трека */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankClass(rank)}`}>
            {getRankIcon(rank)}
          </div>
          <div className="text-sm text-gray-500">
            {track.week} неделя
          </div>
        </div>

        {/* Информация о треке */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {track.title || 'Без названия'}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{track.artist || 'Неизвестный артист'}</p>
          
          {/* Статистики */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">BPM</p>
              <p className="font-semibold text-gray-800">{track.bpm || 'N/A'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Ключ</p>
              <p className="font-semibold text-gray-800">{track.key || 'N/A'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Лайки</p>
              <p className="font-semibold text-green-600">{track.likes || 0}</p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            ▶️ Слушать
          </button>
          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            📥 Скачать
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex justify-between items-center">
            <span>Загружено: {track.uploadDate || 'Неизвестно'}</span>
            <span className="text-purple-600">⭐ {track.superlikes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyTrackCard;
