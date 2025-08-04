import React, { useState } from 'react';

function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'E-commerce платформа',
      category: 'web',
      description: 'Современный интернет-магазин с интеграцией платежных систем',
      image: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=E-commerce',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
    },
    {
      id: 2,
      title: 'Мобильное приложение',
      category: 'mobile',
      description: 'Кроссплатформенное приложение для доставки еды',
      image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Mobile+App',
      technologies: ['React Native', 'Firebase', 'Redux', 'Google Maps']
    },
    {
      id: 3,
      title: 'Корпоративный сайт',
      category: 'web',
      description: 'Многостраничный сайт для крупной компании',
      image: 'https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Corporate+Site',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel']
    },
    {
      id: 4,
      title: 'UI/UX дизайн',
      category: 'design',
      description: 'Полный редизайн пользовательского интерфейса',
      image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=UI+Design',
      technologies: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
    },
    {
      id: 5,
      title: 'Облачное решение',
      category: 'cloud',
      description: 'Микросервисная архитектура в облаке',
      image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Cloud+Solution',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Node.js']
    },
    {
      id: 6,
      title: 'Веб-приложение',
      category: 'web',
      description: 'Система управления проектами',
      image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Web+App',
      technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io']
    }
  ];

  const filters = [
    { id: 'all', label: 'Все проекты' },
    { id: 'web', label: 'Веб-разработка' },
    { id: 'mobile', label: 'Мобильные приложения' },
    { id: 'design', label: 'UI/UX дизайн' },
    { id: 'cloud', label: 'Облачные решения' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Наше портфолио</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Посмотрите на наши лучшие работы и убедитесь в качестве наших услуг. 
            Каждый проект - это уникальное решение для конкретных задач клиента.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Статистика проектов</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Завершенных проектов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Технологий</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Поддержка проектов</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Хотите такой же проект?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Свяжитесь с нами и обсудим ваши идеи
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Обсудить проект
          </button>
        </section>
      </div>
    </div>
  );
}

export default PortfolioPage; 