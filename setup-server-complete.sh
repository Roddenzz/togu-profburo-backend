#!/bin/bash

# Run this script on the server to complete deployment

cd /var/www/aid_app_web || exit 1

echo "🚀 Setting up Aid Management Platform..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Create PostgreSQL database if needed
echo "🗄️ Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE aid_app_db;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER aid_app_user WITH PASSWORD 'AidApp2026!Secure';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE aid_app_db TO aid_app_user;" 2>/dev/null

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || npx prisma db push

# Seed database
echo "🌱 Seeding database..."
npx prisma db seed

# Stop existing PM2 process
echo "🛑 Stopping existing process..."
pm2 stop aid-app 2>/dev/null || true
pm2 delete aid-app 2>/dev/null || true

# Start with PM2
echo "🚀 Starting application..."
pm2 start npm --name aid-app -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup | tail -n 1 | bash || true

echo "✅ Deployment complete!"
echo ""
echo "Application is running on http://209.38.199.90:3000"
echo ""
echo "Useful commands:"
echo "  pm2 status         - Check status"
echo "  pm2 logs aid-app   - View logs"
echo "  pm2 restart aid-app - Restart app"
echo ""
echo "Default login (from seed data):"
echo "  Admin: admin@university.ru"
echo "  Student: ivanov@university.ru"
echo "  OTP will be shown in console logs: pm2 logs aid-app"
