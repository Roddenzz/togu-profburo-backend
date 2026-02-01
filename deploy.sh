#!/bin/bash

echo "🚀 Starting deployment preparation..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your production values"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Generate Prisma Client
echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
npx prisma generate

# Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npx prisma migrate deploy

# Build application
echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
mkdir -p deploy
cp -r .next deploy/
cp -r public deploy/
cp -r prisma deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp .env deploy/
cp next.config.js deploy/

echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${GREEN}📁 Files ready in ./deploy directory${NC}"
echo ""
echo "Next steps:"
echo "1. Upload ./deploy to server: scp -r deploy root@your-server:/var/www/aid_app_web"
echo "2. SSH to server: ssh root@your-server"
echo "3. Install dependencies: cd /var/www/aid_app_web && npm install --production"
echo "4. Start with PM2: pm2 start npm --name aid-app -- start"
