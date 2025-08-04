import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProducersPage() {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Тестовые данные на случай недоступности сервера
  const mockProducers = [
    {
      name: "TechCorp Industries",
      category: "Электроника",
      description: "Ведущий производитель электронных компонентов и устройств",
      contact: "+7 (495) 123-45-67",
      website: "https://techcorp.com"
    },
    {
      name: "Green Solutions",
      category: "Экология",
      description: "Инновационные решения для экологически чистого производства",
      contact: "+7 (495) 234-56-78",
      website: "https://greensolutions.ru"
    },
    {
      name: "Smart Systems",
      category: "Автоматизация",
      description: "Системы автоматизации и управления производственными процессами",
      contact: "+7 (495) 345-67-89",
      website: "https://smartsystems.com"
    }
  ];

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('https://x9k7he-93-81-193-225.ru.tuna.am/producers/');
        let data = response.data;
        
        // Обработка различных форматов данных
        let processedData = data;
        
        // Если данные приходят в объекте с ключом 'producers'
        if (data && data.producers && Array.isArray(data.producers)) {
          processedData = data.producers;
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
        // Если данные не в ожидаемом формате, используем тестовые данные
        else {
          console.warn('Неожиданный формат данных:', data);
          processedData = mockProducers;
        }
        
        setProducers(processedData);
        setError(null);
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError('Не удалось загрузить данные с сервера');
        // В случае ошибки показываем тестовые данные
        setProducers(mockProducers);
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Производители
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Изучите наших партнеров и производителей, которые помогают нам создавать качественные продукты
          </p>
        </div>
      </section>

      {/* Producers List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Наши партнеры</h2>
          
          {!Array.isArray(producers) || producers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Нет данных</h3>
              <p className="text-gray-500">В данный момент нет доступных производителей</p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  Полученные данные: {JSON.stringify(producers, null, 2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {producers.map((producer, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">
                          {producer.name ? producer.name.charAt(0).toUpperCase() : 'P'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {producer.name || 'Неизвестный производитель'}
                        </h3>
                        {producer.category && (
                          <p className="text-sm text-gray-500">{producer.category}</p>
                        )}
                      </div>
                    </div>
                    
                    {producer.description && (
                      <p className="text-gray-600 mb-4">{producer.description}</p>
                    )}
                    
                    {producer.contact && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-1">Контакты:</p>
                        <p className="text-gray-700">{producer.contact}</p>
                      </div>
                    )}
                    
                    {producer.website && (
                      <div className="mt-4">
                        <a 
                          href={producer.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Посетить сайт →
                        </a>
                      </div>
                    )}
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

export default ProducersPage;
