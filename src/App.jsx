import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProducersPage from './pages/ProducersPage';
import LoopsPage from './pages/LoopsPage';
import IntroAnimation from './application/IntroAnimation';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showIntro, setShowIntro] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Проверяем, был ли пользователь уже на сайте
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowIntro(false);
      setIsFirstVisit(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIsFirstVisit(false);
    // Сохраняем информацию о том, что пользователь уже посетил сайт
    localStorage.setItem('hasVisited', 'true');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'producers':
        return <ProducersPage />;
      case 'loops':
        return <LoopsPage />;
      default:
        return <HomePage />;
    }
  };

  // Если показываем интро, не рендерим Layout
  if (showIntro) {
    return <IntroAnimation onAnimationComplete={handleIntroComplete} />;
  }

  return (
    <ThemeProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
