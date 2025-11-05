#!/bin/bash

echo "===================================="
echo "Legal Translation Review System"
echo "===================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js 18+ first: https://nodejs.org/"
    exit 1
fi

# Check if pnpm is installed, if not, use npm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
else
    PKG_MANAGER="npm"
fi

echo "Using package manager: $PKG_MANAGER"
echo ""

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    $PKG_MANAGER install
    cd ..
    echo ""
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    $PKG_MANAGER install
    cd ..
    echo ""
fi

# Create .env file if not exists
if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "Please edit backend/.env to configure your settings"
    echo ""
fi

# Create necessary directories
mkdir -p backend/data
mkdir -p backend/uploads

echo "Starting services..."
echo ""

# Start backend in background
echo "Starting backend server..."
cd backend
$PKG_MANAGER run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend server..."
cd frontend
$PKG_MANAGER run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "===================================="
echo "Services started successfully!"
echo "===================================="
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
