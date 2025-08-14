// Цветовая схема приложения
export const COLORS = {
  // Основные цвета
  primary: '#3b82f6', // blue-500
  primaryHover: '#2563eb', // blue-600
  secondary: '#8b5cf6', // purple-500
  secondaryHover: '#7c3aed', // purple-600
  
  // Фоны
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb', // gray-50
  bgCard: '#ffffff',
  bgHeader: '#ffffff',
  
  // Темная тема - фоны
  darkBgPrimary: '#111827', // gray-900
  darkBgSecondary: '#1f2937', // gray-800
  darkBgCard: '#1f2937', // gray-800
  darkBgHeader: '#111827', // gray-900
  
  // Текст
  textPrimary: '#1f2937', // gray-800
  textSecondary: '#6b7280', // gray-500
  textMuted: '#9ca3af', // gray-400
  textWhite: '#ffffff',
  
  // Темная тема - текст
  darkTextPrimary: '#f9fafb', // gray-50
  darkTextSecondary: '#d1d5db', // gray-300
  darkTextMuted: '#9ca3af', // gray-400
  
  // Границы
  border: '#e5e7eb', // gray-200
  borderHover: '#d1d5db', // gray-300
  
  // Темная тема - границы
  darkBorder: '#374151', // gray-700
  darkBorderHover: '#4b5563', // gray-600
  
  // Статусы
  success: '#10b981', // green-500
  successLight: '#d1fae5', // green-100
  successDark: '#065f46', // green-800
  error: '#ef4444', // red-500
  errorLight: '#fee2e2', // red-100
  errorDark: '#991b1b', // red-800
  warning: '#f59e0b', // yellow-500
  warningLight: '#fef3c7', // yellow-100
  warningDark: '#92400e', // yellow-800
  
  // Жанры музыки
  genreHouse: '#3b82f6', // blue-500
  genreTechno: '#8b5cf6', // purple-500
  genreDnb: '#10b981', // green-500
  genreHiphop: '#f97316', // orange-500
  genreTrap: '#ef4444', // red-500
  genreDubstep: '#eab308', // yellow-500
  
  // Ранги
  rank1: '#eab308', // yellow-500
  rank2: '#9ca3af', // gray-400
  rank3: '#f97316', // orange-500
};

// Функция для получения цвета жанра
export const getGenreColor = (genre) => {
  const genreColors = {
    'House': COLORS.genreHouse,
    'Techno': COLORS.genreTechno,
    'DnB': COLORS.genreDnb,
    'Hip-Hop': COLORS.genreHiphop,
    'Trap': COLORS.genreTrap,
    'Dubstep': COLORS.genreDubstep,
    'default': '#6b7280' // gray-500
  };
  return genreColors[genre] || genreColors.default;
};

// Функция для получения цвета ранга
export const getRankColor = (rank) => {
  const rankColors = {
    1: COLORS.rank1,
    2: COLORS.rank2,
    3: COLORS.rank3,
    'default': '#e5e7eb' // gray-200
  };
  return rankColors[rank] || rankColors.default;
};

// Функция для получения CSS переменной
export const getCSSVariable = (variableName) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName);
};

// Функция для установки CSS переменной
export const setCSSVariable = (variableName, value) => {
  document.documentElement.style.setProperty(variableName, value);
};





