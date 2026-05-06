@echo off
echo ============================================
echo   Starting Web Review (InsignReview Clone)
echo ============================================
echo.
echo Backend:  http://localhost:5026
echo Frontend: http://localhost:5174
echo.
start "InsignReview Backend" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 2 /nobreak >nul
start "InsignReview Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo.
echo Both servers are starting...
echo Press any key to exit this window.
pause >nul
