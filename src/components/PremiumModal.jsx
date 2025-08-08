import React, { useState, useEffect } from 'react';

const PremiumModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Открываем модальное окно через 5 секунд после загрузки страницы
    const initialTimeout = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    
    // Устанавливаем таймер на 5 секунд для следующего открытия
    const newTimeoutId = setTimeout(() => {
      setIsOpen(true);
    }, 5000);
    
    setTimeoutId(newTimeoutId);
  };

  const handleBuyPremium = () => {
    // Здесь можно добавить логику для перехода к покупке премиума
    alert('Переход к покупке премиум-подписки!');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👑</span>
              <h2 className="text-xl font-bold">ПРЕМИУМ ПОДПИСКА</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              КУПИ ПРЕМИУМ!
            </h3>
            <p className="text-gray-600 mb-4">
              Получи доступ к эксклюзивным возможностям и улучшенному опыту
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-gray-700">Безлимитные загрузки</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-gray-700">Эксклюзивные лупы</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-gray-700">Приоритетная поддержка</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span className="text-gray-700">Без рекламы</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ₽999/месяц
            </div>
            <div className="text-sm text-gray-500">
              или ₽9999/год (экономия 17%)
            </div>
          </div>
          
          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBuyPremium}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              КУПИТЬ ПРЕМИУМ
            </button>
            <button
              onClick={handleClose}
              className="w-full bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Может быть позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
