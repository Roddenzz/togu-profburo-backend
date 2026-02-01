# Автоматический деплой на сервер 209.38.199.90

$SERVER = "209.38.199.90"
$USER = "root"
$REMOTE_PATH = "/var/www/aid_app_web"

Write-Host "🚀 Starting automatic deployment..." -ForegroundColor Cyan

# 1. Create directory on server
Write-Host "📁 Creating directory on server..." -ForegroundColor Yellow
plink -batch ${USER}@${SERVER} "mkdir -p ${REMOTE_PATH}"

# 2. Upload files
Write-Host "📤 Uploading package.json..." -ForegroundColor Yellow
pscp package.json ${USER}@${SERVER}:${REMOTE_PATH}/

Write-Host "📤 Uploading package-lock.json..." -ForegroundColor Yellow
pscp package-lock.json ${USER}@${SERVER}:${REMOTE_PATH}/

Write-Host "📤 Uploading config files..." -ForegroundColor Yellow
pscp next.config.js ${USER}@${SERVER}:${REMOTE_PATH}/
pscp tailwind.config.ts ${USER}@${SERVER}:${REMOTE_PATH}/
pscp tsconfig.json ${USER}@${SERVER}:${REMOTE_PATH}/
pscp .env ${USER}@${SERVER}:${REMOTE_PATH}/

Write-Host "📤 Uploading directories..." -ForegroundColor Yellow
pscp -r prisma ${USER}@${SERVER}:${REMOTE_PATH}/
pscp -r app ${USER}@${SERVER}:${REMOTE_PATH}/
pscp -r components ${USER}@${SERVER}:${REMOTE_PATH}/
pscp -r lib ${USER}@${SERVER}:${REMOTE_PATH}/

Write-Host "📤 Uploading deployment script..." -ForegroundColor Yellow
pscp setup-server-complete.sh ${USER}@${SERVER}:${REMOTE_PATH}/

Write-Host "✅ Files uploaded!" -ForegroundColor Green

# 3. Run deployment script
Write-Host "🔧 Running deployment on server..." -ForegroundColor Yellow
plink -batch ${USER}@${SERVER} "cd ${REMOTE_PATH}; chmod +x setup-server-complete.sh; bash setup-server-complete.sh"

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Application URL: http://${SERVER}:3000" -ForegroundColor Cyan
Write-Host "Check status: plink ${USER}@${SERVER} pm2 status" -ForegroundColor Cyan
