import React from 'react';

function Header({ currentPage, onPageChange }) {
  const menuItems = [
    { id: 'home', label: 'Главная', path: '/' },
    { id: 'about', label: 'О нас', path: '/about' },
    { id: 'services', label: 'Услуги', path: '/services' },
    { id: 'portfolio', label: 'Портфолио', path: '/portfolio' },
    { id: 'producers', label: 'Производители', path: '/producers' },
    { id: 'loops', label: 'Лупы', path: '/loops' },
    { id: 'contact', label: 'Контакты', path: '/contact' }
  ];

  return (
    <header className="bg-white shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 