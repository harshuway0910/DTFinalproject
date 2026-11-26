# 🚀 Deployment Guide — Footprint Fighter (DTFinalproject)

This guide covers deploying the **Footprint Fighter** full-stack application (Python Flask backend + React Vite frontend) to **Render** or **Vercel + Render** for free.

---

## 🌟 Method 1: Deploy Everything on Render (Recommended & Easiest)

Render can host both your Python backend (Web Service) and your React frontend (Static Site) under a single free account.

### Step 1: Deploy Backend (Flask API)

1. Go to [render.com](https://render.com/) and sign in with your **GitHub** account (`harshuway0910`).
2. Click **New +** &rarr; **Web Service**.
3. Select your repository: **`harshuway0910/DTFinalproject`**.
4. Configure the settings:
   - **Name**: `footprint-fighter-backend` *(or any unique name)*
   - **Root Directory**: `DT1/backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: `Free`
5. Click **Advanced** &rarr; **Add Environment Variable**:
   - `PYTHON_VERSION`: `3.10.12`
   - `GEMINI_API_KEY`: *(paste your Gemini API Key)*
6. Click **Create Web Service**.
7. Wait 2-3 minutes for the build to finish. Copy your backend URL (e.g., `https://footprint-fighter-backend.onrender.com`).

---

### Step 2: Deploy Frontend (React + Vite)

1. In your Render Dashboard, click **New +** &rarr; **Static Site**.
2. Select your repository: **`harshuway0910/DTFinalproject`**.
3. Configure the settings:
   - **Name**: `footprint-fighter-frontend`
   - **Root Directory**: `DT1/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Click **Advanced** &rarr; **Add Environment Variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 1 (e.g., `https://footprint-fighter-backend.onrender.com`)
5. Click **Create Static Site**.
6. Under **Redirects/Rewrites** in the static site settings, add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
7. Once deployed, open your frontend URL and your application is live!

---

## ⚡ Method 2: Vercel (Frontend) + Render (Backend)

If you prefer Vercel for the frontend:

1. **Deploy Backend on Render** using **Step 1** above.
2. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
3. Click **Add New...** &rarr; **Project**.
4. Import `harshuway0910/DTFinalproject`.
5. In **Root Directory**, click **Edit** and select `DT1/frontend`.
6. Under **Environment Variables**:
   - `VITE_API_URL`: `https://footprint-fighter-backend.onrender.com`
7. Click **Deploy**.
