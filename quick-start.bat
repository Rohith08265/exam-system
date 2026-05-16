@echo off
REM ExamHub Quick Start Script for Windows
REM This script sets up and starts both backend and frontend

echo.
echo =====================================
echo ExamHub - Online Examination System
echo =====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install it first.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Backend Setup
echo Setting up Backend...
cd backend

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [WARNING] Please update backend\.env with your configuration
)

echo Installing backend dependencies...
call npm install

echo [OK] Backend setup complete
echo.

REM Frontend Setup
cd ..\frontend

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

echo Installing frontend dependencies...
call npm install

echo [OK] Frontend setup complete
echo.

REM Display next steps
echo =====================================
echo Setup Complete!
echo =====================================
echo.
echo Next steps:
echo.
echo 1. Start MongoDB (if not already running)
echo.
echo 2. Start Backend ^(in backend directory^):
echo    npm run dev
echo.
echo 3. Start Frontend ^(in frontend directory^):
echo    npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
echo Demo Credentials:
echo   Student: student@example.com / password123
echo   Teacher: teacher@example.com / password123
echo   Admin: admin@example.com / password123
echo.
pause
