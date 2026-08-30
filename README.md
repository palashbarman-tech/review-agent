# Palash Cafe — Reputation Desk

AI-powered Small Business Review Management dashboard. Isme 2 hisse hain:

- **`client/`** — React + Vite + Tailwind dashboard, **`client/api/draft.js`** ek Vercel Serverless Function hai jo Google Gemini se AI draft banati hai
- **`server/`** — sirf **local development** ke liye ek chhota Express server (Vercel deployment isse use nahi karta)

Frontend seedhe Gemini ko browser se call nahi karta — key safe rakhne ke liye backend function beech me hai. Local machine par `/api/draft` request Vite proxy ke through `server/` (port 3001) tak jaati hai; Vercel par production me wahi `/api/draft` seedha `client/api/draft.js` (serverless function) ko hit karta hai. Code same rehta hai, bas peeche ka backend badalta hai.

---

## Part A — Local machine par chalana

### 1. Gemini API key lo (FREE)
[aistudio.google.com/apikey](https://aistudio.google.com/apikey) → Google account se sign in → "Create API key" → `AIza...` wali key copy karo. Free hai, card ki zaroorat nahi.

### 2. Server setup karo
```bash
cd server
npm install
cp .env.example .env
```
`.env` file kholo aur apni key daalo:
```
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Chalao:
```bash
npm start
```
Terminal chalta rehne do.

### 3. Client setup karo (naye terminal me)
```bash
cd client
npm install
npm run dev
```
Browser me `http://localhost:5173` kholo.

---

## Part B — Vercel par deploy karna

### 1. Root Directory set karo
Vercel project → **Settings → General → Root Directory** → `client` likho (bilkul isi tarah, quotes ke bina). Ye zaroori hai kyunki repo/zip me `client` aur `server` dono folders hain, aur Vercel ko batana hai ki asli app kaha hai.

### 2. Environment Variable add karo
Vercel project → **Settings → Environment Variables** → naya variable banao:
```
Name:  GEMINI_API_KEY
Value: AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Save karke sabhi environments (Production, Preview, Development) select karo.

### 3. Redeploy karo
**Deployments** tab → latest deployment ke 3-dot menu → **Redeploy**.

Bas — ab `client/api/draft.js` khud-ba-khud Vercel Serverless Function ban jaayega, aur `/api/draft` calls usi ko hit karengi. Koi alag server deploy karne ki zaroorat nahi.

---

## Agar kuch atke to

| Problem | Wajah |
|---|---|
| Vercel par 404: NOT_FOUND | Root Directory `client` set nahi hai (Part B, Step 1 dekho) |
| "Generate draft" pe error (local) | `server` terminal chal raha hai ya nahi check karo, `.env` me sahi key hai ya nahi |
| "Generate draft" pe error (Vercel) | Environment Variable `GEMINI_API_KEY` Vercel Settings me hai ya nahi check karo, phir Redeploy karo |
| Browser console me 429 error | Gemini free tier ki per-minute limit cross ho gayi — thoda ruk ke try karo |
| Fonts plain dikh rahe hain | Internet connection check karo — fonts Google Fonts se load hote hain |

Error ka exact reason dekhne ke liye: F12 → **Network** tab → "Generate draft" dabao → `draft` request pe click karo → **Response** tab me poora error milega.
