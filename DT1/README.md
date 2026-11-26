# 🌱 Footprint Fighter — Carbon Footprint Calculator & Eco Assistant

> **"Know Your Impact. Own Your Change."**

Footprint Fighter is an interactive web application designed to help individuals calculate, track, and reduce their carbon footprint across travel, household energy, diet, and shopping habits. Built with a sleek dark/light theme, gamified XP/leveling system, leaderboard, and an AI-powered sustainability advisor (**EcoBot**) powered by Google Gemini.

---

## ✨ Features

- 📊 **Carbon Footprint Calculator**: Input weekly travel, monthly electricity, shopping, and waste habits with instant emissions breakdown.
- 🤖 **EcoBot (Gemini AI)**: An intelligent sustainability assistant that provides tailored tips, explains climate concepts, and suggests actionable eco-friendly habits.
- 🎨 **Adaptive Light & Dark Themes**: Modern glassmorphic aesthetic built with Tailwind CSS, custom color palettes, and micro-animations.
- 🏆 **Gamification & Leaderboard**: Earn XP and level up as you calculate your footprint and hit sustainability reduction goals.
- 🌐 **Multilingual Support**: Switch seamlessly between English and Hindi.
- 📈 **Personal Dashboard**: Track emissions history and visualize reduction trends.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, i18next
- **Backend**: Python, Flask, Flask-CORS, Pandas, OpenPyXL
- **AI Integration**: Google Generative AI (Gemini 3.5 Flash)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

*(You can copy `.env.example` as a starting point)*

---

### 3. Backend Setup (Flask API)

```bash
cd backend
pip install -r requirements.txt
python app.py
```
> The backend server runs at `http://localhost:5000`

---

### 4. Frontend Setup (React + Vite)

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```
> The frontend application runs at `http://localhost:5173`

---

## 🛡️ License

This project is licensed under the MIT License.
