# PowerShell deployment script

Write-Host "🚀 Starting deployment preparation..." -ForegroundColor Cyan

# Check if .env exists
if (-Not (Test-Path .env)) {
    Write-Host "❌ .env file not found. Creating from example..." -ForegroundColor Red
    Copy-Item .env.example .env
    Write-Host "⚠️  Please update .env with your production values" -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# Build application
Write-Host "🏗️  Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
if (Test-Path deploy) {
    Remove-Item -Recurse -Force deploy
}
New-Item -ItemType Directory -Path deploy | Out-Null

Copy-Item -Recurse .next deploy/
Copy-Item -Recurse public deploy/ -ErrorAction SilentlyContinue
Copy-Item -Recurse prisma deploy/
Copy-Item package.json deploy/
Copy-Item package-lock.json deploy/
Copy-Item .env deploy/
Copy-Item next.config.js deploy/

Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "📁 Files ready in ./deploy directory" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload to server: scp -r deploy/* root@209.38.199.90:/var/www/aid_app_web"
Write-Host "2. SSH to server: ssh root@209.38.199.90"
Write-Host "3. Install dependencies: cd /var/www/aid_app_web && npm install --production"
Write-Host "4. Run migrations: npx prisma migrate deploy"
Write-Host "5. Start with PM2: pm2 start npm --name aid-app -- start"
