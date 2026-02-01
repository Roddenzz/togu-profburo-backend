@echo off
echo ===================================
echo Automatic Deployment Script
echo ===================================
echo.

set SERVER=209.38.199.90
set USER=root
set REMOTE_PATH=/var/www/aid_app_web

echo [1/4] Creating directory on server...
ssh %USER%@%SERVER% "mkdir -p %REMOTE_PATH%"

echo.
echo [2/4] Uploading files...
scp package.json %USER%@%SERVER%:%REMOTE_PATH%/
scp package-lock.json %USER%@%SERVER%:%REMOTE_PATH%/
scp next.config.js %USER%@%SERVER%:%REMOTE_PATH%/
scp tailwind.config.ts %USER%@%SERVER%:%REMOTE_PATH%/
scp tsconfig.json %USER%@%SERVER%:%REMOTE_PATH%/
scp .env %USER%@%SERVER%:%REMOTE_PATH%/

echo.
echo [3/4] Uploading directories...
scp -r prisma %USER%@%SERVER%:%REMOTE_PATH%/
scp -r app %USER%@%SERVER%:%REMOTE_PATH%/
scp -r components %USER%@%SERVER%:%REMOTE_PATH%/
scp -r lib %USER%@%SERVER%:%REMOTE_PATH%/

echo.
echo [4/4] Running deployment on server...
ssh %USER%@%SERVER% "cd %REMOTE_PATH% && chmod +x setup-server-complete.sh && bash setup-server-complete.sh"

echo.
echo ===================================
echo Deployment Complete!
echo ===================================
echo.
echo Application URL: http://%SERVER%:3000
echo.
pause
