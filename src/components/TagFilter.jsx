import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TagFilter({ loops, onFilterChange }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);

  // Загружаем теги из API или извлекаем из лупов
  useEffect(() => {
    const loadTags = async () => {
      setLoadingTags(true);
      try {
        // Сначала пытаемся загрузить теги из отдельного API
        const tagsUrl = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_LOOPS_TAGS_ENDPOINT}`;
        const response = await axios.get(tagsUrl);
        
        if (response.data && Array.isArray(response.data)) {
          setAvailableTags(response.data.sort());
          return;
        }
      } catch (error) {
        console.log('Не удалось загрузить теги из API, извлекаем из лупов:', error.message);
      }
      
      // Если API недоступен, извлекаем теги из лупов
      if (loops && Array.isArray(loops)) {
        const allTags = [];
        loops.forEach(loop => {
          if (loop.loop?.tags && Array.isArray(loop.loop.tags)) {
            loop.loop.tags.forEach(tag => {
              if (!allTags.includes(tag)) {
                allTags.push(tag);
              }
            });
          }
        });
        setAvailableTags(allTags.sort());
      }
      setLoadingTags(false);
    };

    loadTags();
  }, [loops]);

  // Фильтруем лупы по выбранным тегам
  useEffect(() => {
    if (selectedTags.length === 0) {
      onFilterChange(loops);
      return;
    }

    const filteredLoops = loops.filter(loop => {
      if (!loop.loop?.tags || !Array.isArray(loop.loop.tags)) {
        return false;
      }
      
      // Проверяем, содержит ли луп хотя бы один из выбранных тегов
      return selectedTags.some(selectedTag => 
        loop.loop.tags.includes(selectedTag)
      );
    });

    onFilterChange(filteredLoops);
  }, [selectedTags, loops, onFilterChange]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  if (loadingTags) {
    return (
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Загрузка тегов...
          </p>
        </div>
      </div>
    );
  }

  if (availableTags.length === 0) {
    return (
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-4">
          <div className="text-2xl mb-2">😊</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            пока без тегов
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          Фильтр по тегам
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
          >
            Очистить все
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={`inline-block text-sm px-3 py-1 rounded-full transition-colors cursor-pointer ${
              selectedTags.includes(tag)
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tag}
            {selectedTags.includes(tag) && (
              <span className="ml-1">×</span>
            )}
          </button>
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Выбрано тегов: {selectedTags.length}
        </div>
      )}
    </div>
  );
}

export default TagFilter;
