import React, { useState, useEffect } from 'react';

function IntroAnimation({ onAnimationComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'COLLAB CONNECT';

  useEffect(() => {
    // Анимация появления текста по буквам
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150); // Задержка между буквами

      return () => clearTimeout(timer);
    } else {
      // После появления всех букв, ждем 2 секунды и начинаем уменьшение
      const timer = setTimeout(() => {
        setIsAnimating(false);
        // Вызываем callback после завершения анимации
        setTimeout(() => {
          onAnimationComplete();
        }, 1000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 transition-all duration-1000 ease-in-out z-50 flex items-center justify-center ${
        isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-4 tracking-wider">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>
        <div className="w-16 h-1 bg-white mx-auto rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export default IntroAnimation; 