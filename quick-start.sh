#!/bin/bash

# ExamHub Quick Start Script
# This script sets up and starts both backend and frontend

echo "🚀 ExamHub - Online Examination Management System"
echo "=================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed${NC}"

# Check if MongoDB is running
if ! command -v mongo &> /dev/null && ! command -v mongosh &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB CLI not found. Make sure MongoDB service is running.${NC}"
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"
echo ""

# Backend Setup
echo "Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update backend/.env with your configuration${NC}"
fi

echo "Installing backend dependencies..."
npm install

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend Setup
cd ../frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Display next steps
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start MongoDB (if not already running):"
echo "   mongod"
echo ""
echo "2. Start Backend (in backend directory):"
echo "   npm run dev"
echo ""
echo "3. Start Frontend (in frontend directory):"
echo "   npm run dev"
echo ""
echo "4. Open your browser:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5000"
echo ""
echo "Demo Credentials:"
echo "  Student: student@example.com / password123"
echo "  Teacher: teacher@example.com / password123"
echo "  Admin: admin@example.com / password123"
echo ""
