@echo off
echo Starting Blood Donation Support System...
echo.

echo Starting Backend (Spring Boot)...
cd backend
start "Backend" cmd /k "mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo Starting Frontend (React)...
cd ..
start "Frontend" cmd /k "npm run dev"

echo.
echo Both applications are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul 