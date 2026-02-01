# 🎓 Aid Management Platform

> Enterprise-grade Material Aid Management System for Universities

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.8-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Высоконагруженная система для управления заявками на материальную помощь с глубокой аналитикой, автоматизацией документооборота и бесшовным UX/UI. Вдохновлена лучшими практиками Uber Dashboard, Google Analytics и современных SaaS-платформ.

---

## 📋 Содержание

- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Быстрый старт](#-быстрый-старт)
- [Архитектура](#-архитектура)
- [Документация](#-документация)
- [Разработка](#-разработка)
- [Тестирование](#-тестирование)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Участие в проекте](#-участие-в-проекте)

---

## ✨ Возможности

### Для студентов
- 📝 **Подача заявок** — интуитивная многошаговая форма с автосохранением
- 📄 **PDF генерация** — автоматическое создание официальных документов
- 📊 **Личный кабинет** — отслеживание статуса заявок в реальном времени
- 💬 **Чат с поддержкой** — живое общение со специалистами
- 📰 **Новости** — актуальная информация от администрации
- 🔐 **OTP аутентификация** — безопасный вход через email/SMS

### Для администраторов
- 📊 **Продвинутая аналитика** — интерактивные дашборды и графики
- 🔍 **Управление заявками** — фильтрация, сортировка, пакетные операции
- 📈 **Глубокая статистика** — распределения, тренды, когортный анализ
- 👥 **Управление пользователями** — role-based access control
- 💬 **Административный чат** — общение со студентами
- 📰 **CMS** — управление новостями и FAQ
- 📥 **Экспорт данных** — выгрузка в Excel/CSV

### Технические особенности
- ⚡ **Высокая производительность** — Core Web Vitals ≥90
- 🎨 **Современный UI/UX** — темная тема, анимации, адаптивность
- 🔒 **Enterprise security** — JWT, CSRF protection, rate limiting
- 🌐 **Real-time** — Socket.io для мгновенных обновлений
- 📱 **Mobile-first** — полная поддержка мобильных устройств
- ♿ **Accessibility** — WCAG 2.1 AA compliance

---

## 🛠 Технологический стек

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** Zustand, TanStack Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **UI Components:** Radix UI, Lucide Icons

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5.8
- **Cache:** Redis 7.2
- **Real-time:** Socket.io 4.6
- **Auth:** JWT + OTP

### DevOps
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Testing:** Vitest, Playwright

---

## 🚀 Быстрый старт

### Требования

- Node.js 20+ и npm 10+
- PostgreSQL 16+
- Redis 7+ (опционально для production)
- Git

### Установка

1. **Клонировать репозиторий**
```bash
git clone https://github.com/your-org/aid-management-platform.git
cd aid-management-platform
```

2. **Установить зависимости**
```bash
npm install
```

3. **Настроить переменные окружения**
```bash
cp .env.example .env
```

Отредактируйте `.env` файл:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/aid_app_db"
JWT_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

4. **Настроить базу данных**
```bash
# Создать БД
createdb aid_app_db

# Применить миграции
npm run db:migrate

# Заполнить тестовыми данными
npm run db:seed
```

5. **Запустить сервер разработки**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) 🎉

### Docker (альтернатива)

```bash
# Запустить все сервисы
docker-compose up -d

# Применить миграции
docker-compose exec app npm run db:migrate

# Заполнить БД
docker-compose exec app npm run db:seed
```

---

## 🏗 Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │Components│  │   Hooks  │             │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘             │
└────────┼─────────────┼─────────────┼────────────────────┘
         │             │             │
         ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes (Server)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   Auth   │  │   CRUD   │  │ Real-time│             │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘             │
└────────┼─────────────┼─────────────┼────────────────────┘
         │             │             │
         ▼             ▼             ▼
┌──────────────┐ ┌────────────┐ ┌──────────────┐
│  PostgreSQL  │ │   Redis    │ │  Socket.io   │
│  (Prisma)    │ │  (Cache)   │ │ (Real-time)  │
└──────────────┘ └────────────┘ └──────────────┘
```

Подробнее: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📚 Документация

- **[Архитектура](./ARCHITECTURE.md)** — полная техническая архитектура системы
- **[Design System](./DESIGN_SYSTEM.md)** — UI/UX guidelines и компоненты
- **[База данных](./DATABASE.md)** — схема БД, миграции, оптимизация
- **[Roadmap](./ROADMAP.md)** — план разработки и milestones

### API Documentation

После запуска сервера, документация доступна по адресу:
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs/openapi.json`

---

## 💻 Разработка

### Структура проекта

```
aid_app_web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected routes
│   ├── api/               # API endpoints
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Base UI components
│   ├── dashboard/         # Dashboard components
│   ├── shared/            # Shared components
│   └── ...
├── lib/
│   ├── auth/              # Authentication
│   ├── api/               # API client
│   ├── hooks/             # Custom hooks
│   ├── stores/            # Zustand stores
│   ├── utils/             # Utilities
│   └── db.ts              # Prisma client
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/                # Static assets
└── types/                 # TypeScript types
```

### Доступные команды

```bash
# Разработка
npm run dev              # Запустить dev сервер
npm run build            # Build для production
npm run start            # Запустить production сервер
npm run lint             # Проверить код
npm run format           # Форматировать код

# База данных
npm run db:generate      # Сгенерировать Prisma Client
npm run db:push          # Push схему в БД (dev)
npm run db:migrate       # Применить миграции
npm run db:studio        # Открыть Prisma Studio
npm run db:seed          # Заполнить БД

# Тестирование
npm run test             # Unit тесты
npm run test:ui          # Тесты с UI
npm run test:coverage    # Coverage report
npm run e2e              # E2E тесты
npm run e2e:ui           # E2E тесты с UI

# Storybook
npm run storybook        # Запустить Storybook
npm run build-storybook  # Build Storybook
```

### Соглашения о коде

- **TypeScript** — строгая типизация, no any
- **Naming** — camelCase для переменных, PascalCase для компонентов
- **Components** — один компонент на файл
- **Styles** — Tailwind CSS classes, избегать inline styles
- **Commits** — [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🧪 Тестирование

### Unit тесты (Vitest)

```bash
npm run test
```

Покрытие: ≥80%

### E2E тесты (Playwright)

```bash
npm run e2e
```

Критические пути:
- ✅ Аутентификация (OTP)
- ✅ Подача заявки
- ✅ Рассмотрение заявки (admin)
- ✅ Чат

### Accessibility тесты

```bash
npm run test:a11y
```

Compliance: WCAG 2.1 AA

---

## 🚢 Deployment

### Vercel (рекомендуется)

1. Подключить репозиторий к Vercel
2. Настроить environment variables
3. Deploy автоматически при push в `main`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/aid-management-platform)

### Docker

```bash
# Build image
docker build -t aid-management-platform .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  aid-management-platform
```

### Production checklist

- [ ] Настроить environment variables
- [ ] Настроить PostgreSQL с репликацией
- [ ] Настроить Redis cluster
- [ ] Настроить CDN для статики
- [ ] Настроить backup strategy
- [ ] Настроить monitoring (Sentry)
- [ ] Настроить logging
- [ ] Провести load testing
- [ ] Настроить SSL сертификаты

---

## 🗺 Roadmap

### Phase 1: MVP (Недели 1-7) ✅
- [x] Архитектура и дизайн-система
- [x] Базовые UI компоненты
- [x] OTP аутентификация
- [ ] Управление заявками
- [ ] PDF генерация

### Phase 2: Analytics (Недели 8-9)
- [ ] Admin dashboard
- [ ] Интерактивные графики
- [ ] Экспорт данных

### Phase 3: Communication (Недели 10-11)
- [ ] Real-time chat
- [ ] CMS для новостей
- [ ] Notifications

### Phase 4: Polish (Недели 12-15)
- [ ] Performance optimization
- [ ] Testing & bug fixes
- [ ] Production deployment

Подробный roadmap: [ROADMAP.md](./ROADMAP.md)

---

## 🤝 Участие в проекте

Мы приветствуем contributions! Пожалуйста:

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'feat: add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Reporting Issues

Используйте [GitHub Issues](https://github.com/your-org/aid-management-platform/issues) для:
- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements

---

## 📄 Лицензия

MIT License. См. [LICENSE](LICENSE) для деталей.

---

## 👥 Команда

- **Lead Developer** — [@your-name](https://github.com/your-name)
- **UI/UX Designer** — [@designer-name](https://github.com/designer-name)
- **QA Engineer** — [@qa-name](https://github.com/qa-name)

---

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) — потрясающий React framework
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS
- [Prisma](https://www.prisma.io/) — modern database toolkit
- [Radix UI](https://www.radix-ui.com/) — unstyled accessible components

---

## 📞 Поддержка

- **Email:** support@university.edu
- **Документация:** [docs.aid-platform.com](https://docs.aid-platform.com)
- **Discord:** [Join our server](https://discord.gg/...)

---

<div align="center">

**Made with ❤️ for students**

[Website](https://aid-platform.com) • [Documentation](https://docs.aid-platform.com) • [Support](mailto:support@university.edu)

</div>
