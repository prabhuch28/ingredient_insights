# 🔥 Ingredient Insights 🔥

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-FF6B6B?style=for-the-badge&logo=clerk&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

<h3>🚀 Understand what you're eating with AI-powered ingredient analysis 🚀</h3>

<p>
Upload food labels or paste ingredient lists to get clear, human-friendly explanations powered by Google Gemini AI.
</p>

</div>

---

## ✨ Features

### 🔥 Core Functionality
- 📸 **Image Analysis** – Upload food label photos for ingredient extraction  
- 📝 **Text Input** – Paste ingredient lists for instant analysis  
- 🤖 **AI-Powered Insights** – Plain-language explanations powered by Gemini AI  
- 💬 **Interactive Chat** – Ask follow-up questions about ingredients and nutrition  
- 📊 **History Tracking** – View and revisit previous analyses (stored locally)

---

### 🎨 Modern UI / UX
- 🌟 Animated dots background with mouse parallax  
- 💎 Glassmorphism UI with backdrop blur  
- 🌈 Warm, food-themed color palette  
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

- ⚛️ **Next.js 15** (App Router)
- 📘 **TypeScript**
- 🎨 **Tailwind CSS**
- 🔐 **Clerk Authentication**
- 💫 **Framer Motion**
- 🎯 **Lucide React**
- 🤖 **Google Gemini AI** (via Genkit)
- 💾 **Local Storage** (for chat history)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- Clerk account ([Sign up here](https://clerk.com))

---

### Installation

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/ingredient_insights.git
cd ingredient_insights
```

#### 2️⃣ Install dependencies
```bash
npm install
```

#### 3️⃣ Setup environment variables
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Google Gemini API (Required for AI features)
# Get your API key from: https://aistudio.google.com/app/apikey
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

#### 4️⃣ Run the development server
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🎯 Usage

### 📸 Analyze Food Labels
1. Click **New Analysis**
2. Upload a food label image
3. View AI-generated insights

### 📝 Paste Ingredients
1. Click **New Analysis**
2. Paste ingredient list
3. Get a clear, structured explanation

### 💬 Chat with AI
1. After an analysis, click **Continue Chat**
2. Ask questions about ingredients, nutrition, or health
3. Get context-aware responses from Gemini AI

### 📊 History
- Sidebar shows past analyses
- Chat sessions stored in browser local storage
- Click any session to view conversation history

---

## 🏗️ Project Structure

```
ingredient_insights/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── actions.ts        # Server actions (AI integration)
│   │   ├── page.tsx          # Main page
│   │   └── sign-in/          # Authentication pages
│   ├── components/           # UI components
│   │   ├── ingredient-analysis.tsx
│   │   ├── chat-interface.tsx
│   │   ├── cylindrical-navbar.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── useChat.ts        # Chat state management
│   ├── lib/
│   │   └── client-api.ts     # Local storage API
│   └── ai/
│       └── genkit.ts         # Genkit AI configuration
│
└── README.md
```

---

## 🚀 Deployment

This application is a **frontend-only** Next.js app that can be deployed on any serverless platform.

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

Make sure to set these environment variables in your deployment platform:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GOOGLE_GENAI_API_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`

---

## 💾 Data Storage

This application uses **browser local storage** for chat session persistence:
- ✅ No backend server required
- ✅ Data stays on user's device
- ✅ Privacy-focused approach
- ⚠️ Data is device-specific (not synced across devices)
- ⚠️ Clearing browser data will delete chat history

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m "Add YourFeature"`
4. Push and open a PR

---

## 📄 License

MIT License. See LICENSE for details.
