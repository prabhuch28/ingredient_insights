#!/bin/bash

# Deployment Quick Start Script
# This script helps you prepare your application for deployment

echo "🚀 Ingredient Insights - Deployment Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing backend dependencies..."
cd chat_backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

echo "📦 Step 2: Installing frontend dependencies..."
cd ..
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

echo "🔧 Step 3: Setting up environment files..."

# Frontend .env.local
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local (please update with your keys)"
else
    echo "⚠️  .env.local already exists"
fi

# Backend .env
if [ ! -f "chat_backend/.env" ]; then
    cp chat_backend/.env.example chat_backend/.env
    echo "✅ Created chat_backend/.env (please update with your keys)"
else
    echo "⚠️  chat_backend/.env already exists"
fi
echo ""

echo "🗄️  Step 4: Running database migrations..."
cd chat_backend
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi
echo "✅ Database migrations completed"
cd ..
echo ""

echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update .env.local with your Clerk and Gemini API keys"
echo "2. Update chat_backend/.env with your production settings"
echo "3. Test locally:"
echo "   - Frontend: npm run dev"
echo "   - Backend: cd chat_backend && python manage.py runserver"
echo "4. Follow DEPLOYMENT.md for production deployment"
echo ""
echo "🎉 Happy deploying!"
