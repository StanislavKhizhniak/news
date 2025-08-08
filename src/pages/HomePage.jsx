import React, { useState, useEffect } from 'react';
import WeeklyTrackCard from '../components/WeeklyTrackCard';
import ProducerRequestCard from '../components/ProducerRequestCard';

function HomePage() {
  // Моковые данные для лучших треков недели (позже будет заменено на реальный API)
  const [weeklyTracks, setWeeklyTracks] = useState([
    {
      id: 1,
      title: "Midnight Groove",
      artist: "DJ Beats",
      bpm: 128,
      key: "Am",
      likes: 245,
      superlikes: 12,
      uploadDate: "15.01.2024",
      week: "3"
    },
    {
      id: 2,
      title: "Urban Flow",
      artist: "Producer X",
      bpm: 140,
      key: "C#m",
      likes: 189,
      superlikes: 8,
      uploadDate: "12.01.2024",
      week: "3"
    },
    {
      id: 3,
      title: "Deep House Vibes",
      artist: "Sound Master",
      bpm: 125,
      key: "Fm",
      likes: 156,
      superlikes: 6,
      uploadDate: "10.01.2024",
      week: "3"
    }
  ]);

  // Моковые данные для требований продюсеров
  const [producerRequests, setProducerRequests] = useState([
    {
      id: 1,
      title: "Deep House Bassline",
      description: "Нужен качественный баслайн для deep house трека. Должен быть глубоким, но не перегруженным. Ищу что-то в стиле Tale of Us или Maceo Plex.",
      genre: "House",
      bpm: 128,
      key: "Am",
      producer: "Alex Producer",
      budget: 150,
      status: "active",
      date: "2 часа назад"
    },
    {
      id: 2,
      title: "Techno Kick & Percussion",
      description: "Ищу мощный kick для techno трека. Нужен четкий, но не слишком агрессивный. Также нужны качественные перкуссионные элементы.",
      genre: "Techno",
      bpm: 135,
      key: "Dm",
      producer: "Techno Master",
      budget: 200,
      status: "active",
      date: "5 часов назад"
    },
    {
      id: 3,
      title: "Hip-Hop Beat Loop",
      description: "Нужен луп для hip-hop бита. Ищу что-то в стиле 90s, с хорошим грувом и качественными сэмплами.",
      genre: "Hip-Hop",
      bpm: 90,
      key: "Cm",
      producer: "Beat Maker",
      budget: 100,
      status: "active",
      date: "1 день назад"
    },
    {
      id: 4,
      title: "DnB Breakbeat",
      description: "Ищу качественный breakbeat для drum & bass трека. Нужен энергичный, но не перегруженный.",
      genre: "DnB",
      bpm: 174,
      key: "F#m",
      producer: "DnB Artist",
      budget: 180,
      status: "active",
      date: "2 дня назад"
    }
  ]);

  // TODO: Здесь будет функция для получения лучших треков с сервера
  // const fetchWeeklyTracks = async () => {
  //   try {
  //     const response = await fetch('/api/weekly-tracks');
  //     const data = await response.json();
  //     setWeeklyTracks(data);
  //   } catch (error) {
  //     console.error('Ошибка при загрузке лучших треков:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchWeeklyTracks();
  // }, []);
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            COLLAB CONNECT
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Текст придумаю позже
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Узнать больше
          </button>
        </div>
      </section>

      {/* Weekly Tracks Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Лучшие треки недели</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Откройте для себя самые популярные треки, выбранные нашим сообществом. 
              Каждую неделю мы обновляем список лучших работ.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {weeklyTracks.map((track, index) => (
              <WeeklyTrackCard 
                key={track.id} 
                track={track} 
                rank={index + 1}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Смотреть все треки
            </button>
          </div>
        </div>
      </section>

      {/* Producer Requests Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Предложения по лупам для вас</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Продюсеры ищут создателей лупов для своих проектов. 
              Найдите интересные заказы и начните сотрудничество.
            </p>
          </div>
          
          <div className="space-y-4 max-w-4xl mx-auto relative">
            {producerRequests.map((request, index) => (
              <ProducerRequestCard 
                key={request.id} 
                request={request} 
                index={index}
                isLast={index === 3}
              />
            ))}
            
            {/* Кнопка "Читать далее" поверх последней карточки */}
            <div className="absolute bottom-0 right-0 transform translate-y-1/2">
              <button 
                onClick={() => window.location.href = '/producers'}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                Читать далее
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage; 