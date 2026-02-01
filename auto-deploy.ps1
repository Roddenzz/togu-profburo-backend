# Автоматический деплой на сервер 209.38.199.90

$SERVER = "209.38.199.90"
$USER = "root"
$REMOTE_PATH = "/var/www/aid_app_web"

Write-Host "🚀 Starting automatic deployment..." -ForegroundColor Cyan

# 1. Create directory on server
Write-Host "📁 Creating directory on server..." -ForegroundColor Yellow
ssh ${USER}@${SERVER} "mkdir -p ${REMOTE_PATH}"

# 2. Upload files
Write-Host "📤 Uploading files..." -ForegroundColor Yellow
scp package.json ${USER}@${SERVER}:${REMOTE_PATH}/
scp package-lock.json ${USER}@${SERVER}:${REMOTE_PATH}/
scp next.config.js ${USER}@${SERVER}:${REMOTE_PATH}/
scp tailwind.config.ts ${USER}@${SERVER}:${REMOTE_PATH}/
scp tsconfig.json ${USER}@${SERVER}:${REMOTE_PATH}/
scp .env ${USER}@${SERVER}:${REMOTE_PATH}/
scp -r prisma ${USER}@${SERVER}:${REMOTE_PATH}/
scp -r app ${USER}@${SERVER}:${REMOTE_PATH}/
scp -r components ${USER}@${SERVER}:${REMOTE_PATH}/
scp -r lib ${USER}@${SERVER}:${REMOTE_PATH}/
scp setup-server-complete.sh ${USER}@${SERVER}:${REMOTE_PATH}/

Write-Host "✅ Files uploaded!" -ForegroundColor Green

# 3. Run deployment script
Write-Host "🔧 Running deployment on server..." -ForegroundColor Yellow
ssh ${USER}@${SERVER} "cd ${REMOTE_PATH} && chmod +x setup-server-complete.sh && bash setup-server-complete.sh"

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Application URL: http://${SERVER}:3000" -ForegroundColor Cyan
Write-Host "Check status: ssh ${USER}@${SERVER} 'pm2 status'" -ForegroundColor Cyan
Write-Host "View logs: ssh ${USER}@${SERVER} 'pm2 logs aid-app'" -ForegroundColor Cyan
