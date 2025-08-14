import React, { useState, useEffect } from 'react';

function TagFilter({ loops, onFilterChange }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Извлекаем все уникальные теги из лупов
  useEffect(() => {
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
