# Deployment Quick Start Guide

## 📦 Что готово к загрузке

Build приложения успешно завершен! Все файлы готовы к деплою.

## 🚀 Шаги для загрузки на сервер

### 1. Подготовка файлов (уже сделано)

```bash
✓ npm install
✓ npx prisma generate  
✓ npm run build
```

### 2. Загрузка на сервер

#### Вариант А: Через SCP (рекомендуется)

```powershell
# Из папки проекта в PowerShell:
scp -r .next package.json package-lock.json prisma .env next.config.js public root@209.38.199.90:/var/www/aid_app_web/
```

#### Вариант Б: Через Git

```bash
# На сервере:
git clone <your-repo>
cd aid_app_web
npm install --production
npx prisma generate
```

### 3. Настройка на сервере

SSH подключение к серверу:
```bash
ssh root@209.38.199.90
```

Выполнить команды:
```bash
cd /var/www/aid_app_web

# Установка зависимостей
npm install --production

# Генерация Prisma Client
npx prisma generate

# Настройка .env (ВАЖНО!)
nano .env
# Установите DATABASE_URL и другие production значения

# Применение миграций БД
npx prisma migrate deploy

# Запуск с PM2
pm2 start npm --name aid-app -- start
pm2 save
pm2 startup
```

### 4. Проверка работы

```bash
# Статус приложения
pm2 status

# Логи
pm2 logs aid-app

# Перезапуск при необходимости
pm2 restart aid-app
```

## 🔧 Настройка Nginx (если нужен reverse proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Применение:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 PostgreSQL Setup

Если БД еще не настроена:

```bash
# Установка PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Создание БД и пользователя
sudo -u postgres psql

CREATE DATABASE aid_app_db;
CREATE USER aid_app_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE aid_app_db TO aid_app_user;
\q
```

Обновите DATABASE_URL в .env:
```
DATABASE_URL="postgresql://aid_app_user:secure_password@localhost:5432/aid_app_db"
```

## ✅ Финальная проверка

После деплоя проверьте:

1. ✅ Приложение запущено: `pm2 list`
2. ✅ БД подключена: логи без ошибок подключения
3. ✅ Страница логина открывается: http://209.38.199.90:3000
4. ✅ API работает: проверьте OTP отправку

## 🐛 Troubleshooting

### Проблема: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
pm2 restart aid-app
```

### Проблема: "Database connection error"
Проверьте DATABASE_URL в .env и доступность PostgreSQL

### Проблема: "Port 3000 already in use"
```bash
pm2 stop aid-app
lsof -i :3000
# или
pm2 delete aid-app
pm2 start npm --name aid-app -- start
```

## 📝 Полезные команды PM2

```bash
pm2 list           # Список процессов
pm2 logs aid-app   # Логи приложения
pm2 monit          # Мониторинг в реальном времени
pm2 restart aid-app # Перезапуск
pm2 stop aid-app   # Остановка
pm2 delete aid-app # Удаление процесса
```

## 🔄 Обновление приложения

```bash
# Загрузите новые файлы через SCP
scp -r .next/* root@209.38.199.90:/var/www/aid_app_web/.next/

# На сервере:
pm2 restart aid-app
```

---

**Готово к деплою! 🎉**

Все файлы в папке `/aid_app_web` готовы к загрузке на сервер 209.38.199.90.
