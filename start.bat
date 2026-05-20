@echo off

echo Starting backend server...
start "Backend" cmd /k "cd /d %~dp0backend && node server.js"

echo Starting frontend server...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==========================================
echo All servers are starting!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo Admin Panel: http://localhost:5173/admin
echo ==========================================
echo.
echo Press any key to exit (servers will keep running)...
pause >nul
