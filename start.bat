@echo off
echo ====================================
echo Legal Translation Review System
echo ====================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js 18+ first: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if pnpm is installed, if not, use npm
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PKG_MANAGER=pnpm
) else (
    set PKG_MANAGER=npm
)

echo Using package manager: %PKG_MANAGER%
echo.

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call %PKG_MANAGER% install
    cd ..
    echo.
)

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call %PKG_MANAGER% install
    cd ..
    echo.
)

REM Create .env file if not exists
if not exist "backend\.env" (
    echo Creating backend .env file...
    copy backend\.env.example backend\.env
    echo Please edit backend\.env to configure your settings
    echo.
)

REM Create necessary directories
if not exist "backend\data" mkdir backend\data
if not exist "backend\uploads" mkdir backend\uploads

echo Starting services...
echo.

REM Start backend
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && %PKG_MANAGER% run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && %PKG_MANAGER% run dev"

echo.
echo ====================================
echo Services started successfully!
echo ====================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Close the terminal windows to stop services
echo.
pause
