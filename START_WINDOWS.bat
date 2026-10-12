@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.12 or later, then run this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm ci
  if errorlevel 1 goto fail
)
if not exist client\dist\index.html (
  call npm run build
  if errorlevel 1 goto fail
)
echo.
echo ATM Atlas - open http://localhost:5000 in your browser.
echo Press Ctrl+C to stop the server.
call npm start
pause
exit /b
:fail
echo Setup failed. Please review the error above.
pause
exit /b 1
