# 🎨 Руководство по системе цветов

## 📁 Файлы системы цветов

### 1. `src/index.css` - CSS переменные
Здесь определены все CSS переменные для цветов:
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  /* ... остальные переменные */
}
```

### 2. `src/constants/colors.js` - JavaScript константы
Здесь определены все цвета для использования в JavaScript:
```javascript
export const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  /* ... остальные цвета */
};
```

## 🎯 Как использовать

### В CSS/JSX классах:
```jsx
// Вместо
className="bg-blue-500 text-gray-800"

// Используйте
className="bg-primary text-primary"
```

### В JavaScript:
```javascript
import { COLORS, getGenreColor } from '../constants/colors';

// Использование констант
const primaryColor = COLORS.primary;

// Использование функций
const genreColor = getGenreColor('House');
```

## 🎨 Доступные классы

### Основные цвета:
- `.bg-primary` - основной цвет фона
- `.bg-secondary` - вторичный цвет фона
- `.text-primary` - основной цвет текста
- `.text-secondary` - вторичный цвет текста
- `.text-muted` - приглушенный цвет текста

### Фоны:
- `.bg-card` - фон карточек
- `.bg-header` - фон хедера

### Жанры:
- `.genre-house` - House
- `.genre-techno` - Techno
- `.genre-dnb` - DnB
- `.genre-hiphop` - Hip-Hop
- `.genre-trap` - Trap
- `.genre-dubstep` - Dubstep

### Ранги:
- `.rank-1` - 1 место (золото)
- `.rank-2` - 2 место (серебро)
- `.rank-3` - 3 место (бронза)

### Градиенты:
- `.gradient-primary` - основной градиент
- `.gradient-secondary` - вторичный градиент
- `.gradient-hero` - градиент для hero секций
- `.gradient-avatar` - градиент для аватаров

## 🔧 Как изменить цвета

### 1. Изменить CSS переменные в `src/index.css`:
```css
:root {
  --color-primary: #your-new-color;
}
```

### 2. Изменить JavaScript константы в `src/constants/colors.js`:
```javascript
export const COLORS = {
  primary: '#your-new-color',
};
```

### 3. Добавить новые цвета:
1. Добавьте переменную в `:root` в `index.css`
2. Добавьте константу в `COLORS` в `colors.js`
3. Создайте CSS класс в `index.css` (опционально)

## 🌙 Темная тема

Все цвета автоматически адаптируются под темную тему через CSS переменные:
```css
.dark {
  --color-bg-primary: #111827;
  --color-text-primary: #f9fafb;
}
```

## 📝 Примеры использования

### В компонентах:
```jsx
// Карточка
<div className="bg-card text-primary shadow-md">
  <h3 className="text-primary">Заголовок</h3>
  <p className="text-secondary">Описание</p>
</div>

// Жанр
<span className="genre-house text-white px-3 py-1 rounded-full">
  House
</span>

// Ранг
<div className="rank-1 text-white rounded-full w-8 h-8 flex items-center justify-center">
  1
</div>
```

### В JavaScript:
```javascript
import { COLORS, getGenreColor } from '../constants/colors';

// Динамические стили
const style = {
  backgroundColor: COLORS.primary,
  color: COLORS.textWhite
};

// Цвет жанра
const genreColor = getGenreColor('Techno');
```

## ✅ Преимущества новой системы

1. **Централизованное управление** - все цвета в одном месте
2. **Легкое изменение** - измените один файл для обновления всей темы
3. **Автоматическая темная тема** - все цвета адаптируются автоматически
4. **Консистентность** - одинаковые цвета везде
5. **Типобезопасность** - TypeScript поддержка через константы
6. **Производительность** - CSS переменные работают быстрее


