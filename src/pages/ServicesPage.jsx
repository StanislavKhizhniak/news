import React from 'react';

function ServicesPage() {
  const services = [
    {
      id: 1,
      title: 'Веб-разработка',
      description: 'Создание современных веб-сайтов и веб-приложений с использованием передовых технологий.',
      icon: '🌐',
      features: ['React/Next.js', 'Node.js/Express', 'Базы данных', 'API интеграции']
    },
    {
      id: 2,
      title: 'Мобильные приложения',
      description: 'Разработка нативных и кроссплатформенных мобильных приложений для iOS и Android.',
      icon: '📱',
      features: ['React Native', 'Flutter', 'iOS/Android', 'Push уведомления']
    },
    {
      id: 3,
      title: 'UI/UX дизайн',
      description: 'Создание интуитивных и красивых интерфейсов с фокусом на пользовательский опыт.',
      icon: '🎨',
      features: ['Прототипирование', 'Визуальный дизайн', 'UX исследования', 'Анимации']
    },
    {
      id: 4,
      title: 'E-commerce решения',
      description: 'Разработка полнофункциональных интернет-магазинов и платформ электронной коммерции.',
      icon: '🛒',
      features: ['Платежные системы', 'Управление товарами', 'Аналитика', 'SEO оптимизация']
    },
    {
      id: 5,
      title: 'Облачные решения',
      description: 'Развертывание и поддержка приложений в облачной инфраструктуре.',
      icon: '☁️',
      features: ['AWS/Azure/GCP', 'Docker/Kubernetes', 'CI/CD', 'Мониторинг']
    },
    {
      id: 6,
      title: 'Консультации',
      description: 'Технические консультации и аудит существующих проектов.',
      icon: '💡',
      features: ['Технический аудит', 'Архитектурные решения', 'Оптимизация', 'Безопасность']
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Наши услуги</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы предлагаем полный спектр услуг по разработке цифровых решений 
            для вашего бизнеса. От идеи до запуска - мы с вами на каждом этапе.
          </p>
        </section>

        {/* Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Process Section */}
        <section className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Наш процесс работы</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Анализ</h3>
              <p className="text-gray-600">Изучаем ваши потребности и цели проекта</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Планирование</h3>
              <p className="text-gray-600">Создаем детальный план и архитектуру решения</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Разработка</h3>
              <p className="text-gray-600">Реализуем проект с использованием лучших практик</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Запуск</h3>
              <p className="text-gray-600">Тестируем и запускаем проект в продакшн</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Готовы начать проект?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Свяжитесь с нами для бесплатной консультации
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Получить консультацию
          </button>
        </section>
      </div>
    </div>
  );
}

export default ServicesPage; 