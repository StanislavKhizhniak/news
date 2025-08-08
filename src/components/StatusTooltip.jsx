import React from 'react';

function StatusTooltip({ status, title, description }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'PLATINUM':
        return {
          title: 'Platinum Status',
          description: 'Высший статус в сообществе. Доступен только избранным артистам с выдающимися достижениями.'
        };
      case 'GOLD':
        return {
          title: 'Gold Status',
          description: 'Премиум статус для опытных музыкантов с высоким качеством работ.'
        };
      case 'VIP':
        return {
          title: 'VIP Status',
          description: 'Привилегированный статус для активных участников сообщества.'
        };
      case 'BILLBOARD':
        return {
          title: 'Billboard Producer',
          description: 'Статус для продюсеров, чьи треки попали в чарты Billboard.'
        };
      default:
        return {
          title: status,
          description: 'Пользовательский статус в сообществе.'
        };
    }
  };

  const info = getStatusInfo(status);

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] max-w-xs">
      <div className="font-semibold mb-1">{info.title}</div>
      <div className="text-gray-300 text-xs leading-relaxed">{info.description}</div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  );
}

export default StatusTooltip;
