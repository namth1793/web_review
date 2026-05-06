@echo off
echo ============================================
echo   Installing Web Review (InsignReview Clone)
echo ============================================
echo.
echo [1/2] Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
echo.
echo [2/2] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
echo.
echo ============================================
echo   Installation complete!
echo   Run start.bat to launch the application.
echo ============================================
pause
