# Design System: Система управления материальной помощью

## Содержание
1. [Философия дизайна](#философия-дизайна)
2. [Цветовая палитра](#цветовая-палитра)
3. [Типографика](#типографика)
4. [Спейсинг и грид](#спейсинг-и-грид)
5. [Компоненты UI Kit](#компоненты-ui-kit)
6. [Иконография](#иконография)
7. [Анимации и переходы](#анимации-и-переходы)
8. [Темная тема](#темная-тема)
9. [Адаптивность](#адаптивность)
10. [Accessibility](#accessibility)

---

## Философия дизайна

### Ключевые принципы

**1. Clarity (Ясность)**
- Четкая визуальная иерархия
- Понятная навигация
- Очевидные call-to-action

**2. Efficiency (Эффективность)**
- Минимум кликов для достижения цели
- Быстрая загрузка и отклик
- Предсказуемое поведение

**3. Consistency (Согласованность)**
- Единый язык дизайна
- Переиспользуемые паттерны
- Стабильное поведение компонентов

**4. Sophistication (Изысканность)**
- Плавные анимации
- Внимание к деталям
- Профессиональный внешний вид

### Референсы и вдохновение
- Uber Dashboard (clean, professional, data-driven)
- Google Analytics (advanced data visualization)
- Figma (smooth interactions, intuitive UX)
- Linear (modern, polished UI)
- Stripe Dashboard (clarity, depth)

---

## Цветовая палитра

### Основная палитра (Semantic Colors)

```typescript
const colors = {
  // Primary - Основной бренд (синий, профессиональный)
  primary: {
    50:  '#eff6ff',  // Lightest
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Base
    600: '#2563eb',  // Preferred for UI
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Darkest
  },

  // Secondary - Акцентный (индиго)
  secondary: {
    50:  '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',  // Base
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Success - Успех (зеленый)
  success: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Base
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Предупреждение (желтый)
  warning: {
    50:  '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Base
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error - Ошибка (красный)
  error: {
    50:  '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Base
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info - Информация (голубой)
  info: {
    50:  '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Base
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Neutral - Нейтральные (серые)
  neutral: {
    50:  '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
};
```

### Семантическое использование

```typescript
// Применение в UI
const semanticColors = {
  // Backgrounds
  'bg-canvas': 'neutral-50',           // Основной фон
  'bg-surface': 'white',               // Карточки, панели
  'bg-surface-hover': 'neutral-100',   // Ховер состояние
  'bg-overlay': 'black/50',            // Модальные оверлеи

  // Text
  'text-primary': 'neutral-900',       // Основной текст
  'text-secondary': 'neutral-600',     // Вторичный текст
  'text-tertiary': 'neutral-400',      // Placeholder, disabled
  'text-inverse': 'white',             // На темном фоне

  // Borders
  'border-subtle': 'neutral-200',      // Тонкие границы
  'border-default': 'neutral-300',     // Стандартные границы
  'border-strong': 'neutral-400',      // Выраженные границы

  // Status
  'status-draft': 'neutral-500',
  'status-pending': 'warning-500',
  'status-approved': 'success-500',
  'status-rejected': 'error-500',
};
```

### Цветовая система статусов заявок

```css
.status-draft {
  @apply bg-neutral-100 text-neutral-700 border-neutral-300;
}

.status-submitted {
  @apply bg-info-100 text-info-700 border-info-300;
}

.status-under-review {
  @apply bg-warning-100 text-warning-700 border-warning-300;
}

.status-approved {
  @apply bg-success-100 text-success-700 border-success-300;
}

.status-rejected {
  @apply bg-error-100 text-error-700 border-error-300;
}

.status-completed {
  @apply bg-primary-100 text-primary-700 border-primary-300;
}
```

---

## Типографика

### Шрифтовая система

```typescript
// Next.js font configuration
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-mono',
});

// Font families
export const fonts = {
  sans: 'var(--font-sans), system-ui, sans-serif',
  mono: 'var(--font-mono), monospace',
};
```

### Типографическая шкала

```css
/* Headings */
.text-display-2xl {
  font-size: 4.5rem;      /* 72px */
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.text-display-xl {
  font-size: 3.75rem;     /* 60px */
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.text-display-lg {
  font-size: 3rem;        /* 48px */
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.text-display-md {
  font-size: 2.25rem;     /* 36px */
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.text-display-sm {
  font-size: 1.875rem;    /* 30px */
  line-height: 1.3;
  font-weight: 600;
}

.text-xl {
  font-size: 1.5rem;      /* 24px */
  line-height: 1.4;
  font-weight: 600;
}

.text-lg {
  font-size: 1.25rem;     /* 20px */
  line-height: 1.5;
  font-weight: 500;
}

/* Body text */
.text-base {
  font-size: 1rem;        /* 16px */
  line-height: 1.5;
  font-weight: 400;
}

.text-sm {
  font-size: 0.875rem;    /* 14px */
  line-height: 1.5;
  font-weight: 400;
}

.text-xs {
  font-size: 0.75rem;     /* 12px */
  line-height: 1.5;
  font-weight: 400;
}

/* Utility */
.text-label {
  font-size: 0.875rem;    /* 14px */
  line-height: 1.4;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
}
```

### Использование в компонентах

```tsx
// Примеры применения
<h1 className="text-display-md text-neutral-900">
  Дашборд администратора
</h1>

<p className="text-base text-neutral-600">
  Общее количество заявок за текущий месяц
</p>

<span className="text-label text-neutral-500">
  Статус
</span>
```

---

## Спейсинг и грид

### Spacing Scale

```typescript
// Tailwind spacing (rem values)
const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  32: '8rem',        // 128px
};

// Semantic spacing
const semanticSpacing = {
  'component-xs': spacing[2],   // 8px
  'component-sm': spacing[3],   // 12px
  'component-md': spacing[4],   // 16px
  'component-lg': spacing[6],   // 24px
  'component-xl': spacing[8],   // 32px

  'section-sm': spacing[8],     // 32px
  'section-md': spacing[12],    // 48px
  'section-lg': spacing[16],    // 64px
  'section-xl': spacing[24],    // 96px
};
```

### Grid System

```typescript
// Responsive grid
const gridSystem = {
  // Container widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Grid columns
  columns: 12,

  // Gutter (gap)
  gutter: {
    default: '1.5rem',  // 24px
    sm: '1rem',         // 16px
    lg: '2rem',         // 32px
  },
};
```

### Layout Patterns

```tsx
// Dashboard Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard />
  <StatCard />
  <StatCard />
  <StatCard />
</div>

// Sidebar + Content
<div className="flex h-screen">
  <aside className="w-64 border-r">
    <Sidebar />
  </aside>
  <main className="flex-1 overflow-auto">
    <Content />
  </main>
</div>

// Two-column layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    <MainContent />
  </div>
  <aside>
    <SidePanel />
  </aside>
</div>
```

---

## Компоненты UI Kit

### Button

```tsx
// Variants
type ButtonVariant = 
  | 'primary'     // Основное действие
  | 'secondary'   // Вторичное действие
  | 'outline'     // Контурная кнопка
  | 'ghost'       // Прозрачная кнопка
  | 'danger'      // Опасное действие
  | 'link';       // Ссылка

// Sizes
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// States
- Default
- Hover: transform scale(1.02) + shadow
- Active: transform scale(0.98)
- Focus: ring outline
- Disabled: opacity-50 + cursor-not-allowed
- Loading: spinner + disabled state
```

**Визуальные спецификации:**

```css
/* Primary Button */
.btn-primary {
  @apply bg-primary-600 text-white font-medium;
  @apply hover:bg-primary-700 hover:shadow-lg;
  @apply active:bg-primary-800;
  @apply focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-all duration-200 ease-in-out;
  @apply rounded-lg;
}

/* Size: md (default) */
.btn-md {
  @apply px-4 py-2.5 text-sm;
}

/* Size: lg */
.btn-lg {
  @apply px-6 py-3 text-base;
}
```

### Input

```tsx
// States
- Default
- Focus: border-primary + ring
- Error: border-error + error message
- Disabled: bg-neutral-50 + cursor-not-allowed
- With icon: padding adjustment

// Variants
type InputVariant = 'default' | 'filled' | 'flushed';
```

```css
.input {
  @apply w-full px-3 py-2.5 text-sm;
  @apply bg-white border border-neutral-300 rounded-lg;
  @apply placeholder:text-neutral-400;
  @apply focus:border-primary-600 focus:ring-2 focus:ring-primary-100;
  @apply disabled:bg-neutral-50 disabled:text-neutral-400;
  @apply transition-all duration-200;
}

.input-error {
  @apply border-error-500 focus:border-error-600 focus:ring-error-100;
}
```

### Card

```css
.card {
  @apply bg-white rounded-xl border border-neutral-200;
  @apply shadow-sm hover:shadow-md;
  @apply transition-shadow duration-300;
  @apply p-6;
}

.card-interactive {
  @apply cursor-pointer;
  @apply hover:border-primary-300 hover:-translate-y-0.5;
  @apply active:translate-y-0;
}
```

### Table

```tsx
// Advanced table features
- Sortable columns
- Filterable
- Pagination
- Row selection (checkbox)
- Row actions (dropdown menu)
- Sticky header
- Loading state (skeleton)
- Empty state
```

```css
.table {
  @apply w-full border-collapse;
}

.table-header {
  @apply bg-neutral-50 sticky top-0 z-10;
}

.table-header-cell {
  @apply px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider;
  @apply border-b border-neutral-200;
}

.table-row {
  @apply border-b border-neutral-100;
  @apply hover:bg-neutral-50;
  @apply transition-colors duration-150;
}

.table-cell {
  @apply px-6 py-4 text-sm text-neutral-900;
}
```

### Modal

```tsx
// Types
- Center modal (default)
- Slide-over (from right)
- Drawer (from bottom)
- Full screen

// Features
- Overlay backdrop (blur effect)
- Close on ESC
- Close on backdrop click
- Trap focus
- Prevent scroll
- Animate enter/exit
```

```css
.modal-overlay {
  @apply fixed inset-0 z-50;
  @apply bg-black/50 backdrop-blur-sm;
  /* Framer Motion: fade in */
}

.modal-content {
  @apply fixed left-1/2 top-1/2 z-50;
  @apply -translate-x-1/2 -translate-y-1/2;
  @apply bg-white rounded-xl shadow-2xl;
  @apply max-w-lg w-full max-h-[90vh] overflow-auto;
  @apply p-6;
  /* Framer Motion: scale + fade in */
}

.modal-header {
  @apply flex items-center justify-between mb-4;
}

.modal-title {
  @apply text-xl font-semibold text-neutral-900;
}

.modal-close {
  @apply text-neutral-400 hover:text-neutral-600;
  @apply rounded-lg p-1 hover:bg-neutral-100;
  @apply transition-colors;
}
```

### Badge

```tsx
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';
```

```css
.badge {
  @apply inline-flex items-center gap-1;
  @apply px-2.5 py-0.5 rounded-full;
  @apply text-xs font-medium;
  @apply transition-colors duration-200;
}

.badge-success {
  @apply bg-success-100 text-success-700;
}

.badge-with-dot::before {
  content: '';
  @apply w-2 h-2 rounded-full;
  @apply bg-current;
}
```

### Skeleton Loader

```css
.skeleton {
  @apply animate-pulse bg-neutral-200 rounded;
}

.skeleton-text {
  @apply h-4 w-full;
}

.skeleton-title {
  @apply h-6 w-3/4;
}

.skeleton-avatar {
  @apply h-12 w-12 rounded-full;
}

.skeleton-card {
  @apply h-32 w-full rounded-xl;
}
```

### Toast Notification

```tsx
// Position
type ToastPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

// Variant
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

// Duration: 3000ms (default), 5000ms, permanent (manual close)
```

```css
.toast {
  @apply flex items-start gap-3 p-4 rounded-lg shadow-lg;
  @apply bg-white border-l-4;
  @apply min-w-[300px] max-w-md;
  /* Framer Motion: slide in from side */
}

.toast-success {
  @apply border-success-500;
}

.toast-icon {
  @apply flex-shrink-0 w-5 h-5;
}

.toast-content {
  @apply flex-1;
}

.toast-title {
  @apply font-medium text-neutral-900;
}

.toast-message {
  @apply text-sm text-neutral-600 mt-1;
}
```

---

## Иконография

### Icon System

```typescript
// Icon library: Lucide React
import {
  Home,
  FileText,
  MessageSquare,
  Settings,
  User,
  ChevronDown,
  Search,
  Filter,
  Download,
  Upload,
  Check,
  X,
  AlertTriangle,
  Info,
  // ... etc
} from 'lucide-react';

// Icon sizes
const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

// Usage
<Home size={iconSizes.md} className="text-neutral-600" />
```

### Icon Patterns

```tsx
// Icon + Text
<button className="flex items-center gap-2">
  <Download size={16} />
  <span>Скачать PDF</span>
</button>

// Icon Button
<button className="p-2 rounded-lg hover:bg-neutral-100">
  <Settings size={20} />
</button>

// Status Icons
const StatusIcon = ({ status }: { status: ApplicationStatus }) => {
  const icons = {
    approved: <Check className="text-success-600" />,
    rejected: <X className="text-error-600" />,
    pending: <Clock className="text-warning-600" />,
  };
  return icons[status];
};
```

---

## Анимации и переходы

### Transition Timings

```typescript
const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};

const easings = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};
```

### Framer Motion Presets

```typescript
// Fade variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// Slide variants
export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// Scale variants
export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.2 },
};

// Stagger children
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

### Micro-interactions

```css
/* Button hover lift */
.btn-lift {
  @apply transition-transform duration-200;
}
.btn-lift:hover {
  @apply -translate-y-0.5 shadow-md;
}
.btn-lift:active {
  @apply translate-y-0;
}

/* Card hover */
.card-hover {
  @apply transition-all duration-300;
}
.card-hover:hover {
  @apply shadow-lg -translate-y-1;
}

/* Input focus ring */
.input-focus {
  @apply transition-all duration-200;
}
.input-focus:focus {
  @apply ring-2 ring-primary-500 ring-offset-2;
}

/* Skeleton pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Progress bar */
@keyframes progress {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}
.progress-bar::after {
  animation: progress 1.5s ease-in-out infinite;
}
```

---

## Темная тема

### Color Tokens для Dark Mode

```typescript
const darkTheme = {
  // Backgrounds
  'bg-canvas': 'neutral-900',
  'bg-surface': 'neutral-800',
  'bg-surface-hover': 'neutral-750',
  'bg-overlay': 'black/70',

  // Text
  'text-primary': 'neutral-100',
  'text-secondary': 'neutral-400',
  'text-tertiary': 'neutral-600',

  // Borders
  'border-subtle': 'neutral-700',
  'border-default': 'neutral-600',
  'border-strong': 'neutral-500',

  // Primary color - slightly lighter in dark mode
  primary: {
    DEFAULT: 'primary-400',  // instead of 600
  },
};
```

### Dark Mode Implementation

```tsx
// Using next-themes
import { ThemeProvider } from 'next-themes';

// Tailwind config
module.exports = {
  darkMode: 'class',
  // ...
};

// Component usage
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
  {/* Content */}
</div>

// Semantic classes
<div className="bg-surface text-primary border-subtle">
  {/* Auto adapts to theme */}
</div>
```

### Theme Toggle Component

```tsx
<button
  onClick={toggleTheme}
  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
>
  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
</button>
```

---

## Адаптивность

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Laptop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
};
```

### Responsive Patterns

```tsx
// Mobile-first approach

// Stack on mobile, grid on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">{/* Column 1 */}</div>
  <div className="w-full md:w-1/2">{/* Column 2 */}</div>
</div>

// Hide/show based on screen size
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Responsive text sizes
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

### Mobile Navigation

- Mobile: Hamburger menu → Slide-over drawer
- Desktop: Fixed sidebar
- Sticky header on scroll

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast**
- Text: Minimum 4.5:1 for normal text, 3:1 for large text
- Non-text elements: Minimum 3:1

**Focus Indicators**
```css
.focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}
```

**Keyboard Navigation**
- All interactive elements accessible via Tab
- Escape closes modals/dropdowns
- Arrow keys for menus/selects
- Enter/Space activates buttons

**Screen Reader Support**
```tsx
// Semantic HTML
<button aria-label="Закрыть модальное окно">
  <X />
</button>

// ARIA attributes
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">Заголовок</h2>
</div>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Перейти к основному содержанию
</a>

// Loading states
<button disabled aria-busy="true">
  <Spinner /> Загрузка...
</button>
```

**Form Accessibility**
```tsx
<label htmlFor="email" className="block mb-2">
  Email
</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert" className="text-error-600">
    {errors.email.message}
  </span>
)}
```

---

## Design Tokens Export

```typescript
// design-tokens.ts
export const tokens = {
  colors,
  spacing,
  typography: {
    fontFamily: fonts,
    fontSize: { /* ... */ },
    fontWeight: { /* ... */ },
    lineHeight: { /* ... */ },
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  transitions,
  easings,
};
```

---

## Примеры экранов

### 1. Student Dashboard
```
┌────────────────────────────────────────────────────────┐
│ [LOGO]    Главная  Заявки  Чат  Новости     [👤] [🌙] │
├────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Мои заявки                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │    3     │ │    1     │ │    2     │ │ 45,000₽ │ │
│  │ Всего    │ │ Активных │ │ Одобрено │ │ Выплачен│ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                         │
│  📝 Последние заявки                                   │
│  ┌────────────────────────────────────────────────┐   │
│  │ № 2024-001  [В обработке]  15.01.2024  15000₽ │   │
│  │ № 2024-002  [Одобрено]     10.01.2024  20000₽ │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  [+ Подать новую заявку]                               │
└────────────────────────────────────────────────────────┘
```

### 2. Admin Analytics Dashboard
```
┌────────────────────────────────────────────────────────┐
│ [☰] Аналитика                     [Фильтр ▼]  [👤] [🌙]│
├────┬───────────────────────────────────────────────────┤
│    │                                                    │
│ 📊 │  Общая статистика                                 │
│ 📝 │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ 💬 │  │  1,234   │ │  234     │ │  89%     │         │
│ ⚙️ │  │ Заявок   │ │ Активных │ │ Одобрено │         │
│    │  └──────────┘ └──────────┘ └──────────┘         │
│    │                                                    │
│    │  📈 Динамика по месяцам                           │
│    │  [─────────────CHART─────────────]                │
│    │                                                    │
│    │  🏢 Распределение по факультетам                  │
│    │  [──────────PIE CHART────────────]                │
└────┴───────────────────────────────────────────────────┘
```

---

## Связанные файлы

- [Архитектура проекта](./ARCHITECTURE.md)
- [Компонентная библиотека](./COMPONENT_LIBRARY.md)
- [Accessibility Guide](./ACCESSIBILITY.md)
