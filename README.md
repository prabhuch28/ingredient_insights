# 🔥 Tatva.ai – Ingredient Insights 🔥

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-FF6B6B?style=for-the-badge&logo=clerk&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)

<h3>🚀 Understand what you're eating with AI-powered ingredient analysis 🚀</h3>

<p>
Upload food labels or paste ingredient lists to get clear, human-friendly explanations powered by AI.
</p>

</div>

---

## ✨ Features

### 🔥 Core Functionality
- 📸 **Image Analysis** – Upload food label photos for ingredient extraction  
- 📝 **Text Input** – Paste ingredient lists for instant analysis  
- 🤖 **AI-Powered Insights** – Plain-language explanations, not raw data  
- 💬 **Follow-up Chat** – Ask contextual questions after analysis  
- 📊 **History Tracking** – View and revisit previous analyses (ChatGPT-style)

---

### 🎨 Modern UI / UX
- 🌟 Animated dots background with mouse parallax  
- 💎 Glassmorphism UI with backdrop blur  
- 🌈 Neon cyan & blue theme on dark mode  
- 📱 Fully responsive (desktop, tablet, mobile)  
- 🎯 Cylindrical floating navbar  

---

### 💰 Subscription System
- 💳 Starter ($9), Pro ($29), Enterprise  
- 🎁 14-day free trial (no card required)  
- 📈 Feature unlocks by plan  
- 🏢 Custom enterprise solutions  

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **Next.js 14** (App Router)
- 📘 **TypeScript**
- 🎨 **Tailwind CSS**
- 🔐 **Clerk Authentication**
- 💫 **Framer Motion**
- 🎯 **Lucide React**

### Backend
- 🐍 **Django**
- 🔌 **Django REST Framework**
- 🗄️ **SQLite** (dev)
- 🤖 **AI Integration** for ingredient reasoning

---

## 🧠 Product Philosophy

- This app is **not a chatbot**
- Each analysis is a **single, immutable snapshot**
- History feels like ChatGPT, but data is **analysis-based**, not message-based
- AI explains **what matters**, not everything
- Uncertainty is stated clearly when evidence is mixed

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

---

### Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mehulagarwal17/ingredient_insights.git
cd ingredient_insights
```


#### 2️⃣ Install frontend dependencies

```bash
npm install
```


#### 3️⃣ Setup backend
```bash
cd chat_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### 4️⃣ Setup environment variables
```bash
cp .env.example .env.local
```
Add your Clerk keys and AI API keys.

5️⃣ Run the app
```
npm run dev
```
Open: http://localhost:3000

🎯 Usage
📸 Analyze Food Labels
Click New Analysis

Upload a food label image

View AI-generated insights

📝 Paste Ingredients
Click New Analysis

Paste ingredient list

Get a clear, structured explanation

💬 Follow-up Chat
Continue asking questions about the same analysis

Context stays limited to that analysis only

📊 History
Sidebar shows past analyses

Clicking an item reloads stored results

No AI re-run unless a new analysis is created

🏗️ Project Structure
txt
Copy code
ingredient_insights/
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # UI components
│   │   ├── animated-dots-background.tsx
│   │   ├── cylindrical-navbar.tsx
│   │   ├── subscription-page.tsx
│   │   └── ...
│   ├── hooks/
│   ├── lib/
│   └── middleware.ts
│
├── chat_backend/
│   ├── chatapp/
│   └── manage.py
│
└── README.md

🎨 Design System:
🌈 Colors
Primary: Cyan #00FFFF

Secondary: Blue #0000FF

Background: Black #000000

Text: White #FFFFFF

✨ Animations
Mouse-responsive parallax dots

Smooth hover transitions

Skeleton loaders

Micro-interactions

🔧 Configuration
Environment Variables
env
```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google Gemini API (Required for ingredient analysis)
# Get your API key from: https://aistudio.google.com/app/apikey
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

Django
Configure DB in chat_backend/chatbackend/settings.py

Set CORS for frontend domain

Add AI API keys

🚀 Deployment

This application is ready to deploy! We support multiple deployment platforms.

### Quick Start

Run the deployment setup script to prepare your environment:

```bash
chmod +x deploy-setup.sh
./deploy-setup.sh
```

### Deployment Options

#### Frontend (Vercel) - Recommended
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or use the [Vercel Dashboard](https://vercel.com) to deploy directly from GitHub.

#### Backend Options

**Option A: Railway (Easiest)**
1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically

**Option B: Render**
1. Sign up at [render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Configure build and start commands
5. Add PostgreSQL database

**Option C: Docker**
```bash
cd chat_backend
docker build -t ingredient-insights-backend .
docker run -p 8000:8000 ingredient-insights-backend
```

### Detailed Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide including:
- Step-by-step instructions for each platform
- Environment variable configuration
- Database setup
- Troubleshooting tips
- Post-deployment checklist

### Environment Variables

**Frontend (.env.local):**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk secret
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `GOOGLE_GENAI_API_KEY` - Gemini API key

**Backend (.env):**
- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False` in production
- `ALLOWED_HOSTS` - Your domain
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ALLOWED_ORIGINS` - Frontend URL

📄 License
Fork the repo

Create a branch

```
git checkout -b feature/YourFeature
```

Commit changes
```
git commit -m "Add YourFeature"
Push and open a PR
```

📄 License
MIT License.
See LICENSE for details.








