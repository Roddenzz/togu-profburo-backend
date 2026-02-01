#!/bin/bash

# Server Deployment Script
# Run this on the server after uploading files

echo "🚀 Deploying Aid Management Platform..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
APP_DIR="/var/www/aid_app_web"
APP_NAME="aid-app"
NODE_VERSION="20"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

# Install Node.js if needed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Installing Node.js ${NODE_VERSION}...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 if needed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
fi

# Navigate to app directory
cd $APP_DIR || exit 1

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --production

# Generate Prisma Client
echo -e "${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate deploy

# Stop existing process
echo -e "${YELLOW}Stopping existing process...${NC}"
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Start application with PM2
echo -e "${YELLOW}Starting application...${NC}"
pm2 start npm --name $APP_NAME -- start
pm2 save
pm2 startup

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Application Status:"
pm2 list
echo ""
echo "View logs: pm2 logs $APP_NAME"
echo "Monitor: pm2 monit"
echo "Restart: pm2 restart $APP_NAME"
