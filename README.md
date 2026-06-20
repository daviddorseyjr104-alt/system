# Simon Miller — AI Command Center

A full-stack AI workspace built from the Simon Miller AI Optimization Roadmap. Claude Opus 4.8 embedded across 7 departments, 24 ready-to-run prompts, brand voice engine, metrics, and a 90-day rollout tracker.

---

## Run locally

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install            # one time
cp .env.example .env   # then paste your Anthropic key into .env
npm start              # builds + serves on http://localhost:7462
```

Open **http://localhost:7462**.

For live-reload development instead: `npm run dev`.

---

## Deploy to Railway (recommended — always-on, shareable URL)

Railway keeps the app running 24/7 and gives the team a real link. No credit card needed for the trial.

### 1. Push to GitHub (already done)
The code lives at: **https://github.com/daviddorseyjr104-alt/system**

If you make changes later:
```bash
git add --all
git commit -m "your change"
git push
```
Railway auto-redeploys on every push.

### 2. Create the Railway project
1. Go to **https://railway.app** → sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select **daviddorseyjr104-alt/system**
4. Railway reads `railway.toml` and builds automatically

### 3. Set environment variables
In the Railway project → **Variables** tab → add:

| Variable | Value | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | your `sk-ant-...` key | **Yes** |
| `ACCESS_CODE` | a password for the team (e.g. `simonmiller2026`) | Recommended |

> `PORT` is set by Railway automatically — do **not** add it.

### 4. Get the URL
Railway → **Settings** → **Networking** → **Generate Domain**.
You'll get something like `system-production.up.railway.app`. Share that with the team.

Anyone who opens it sees the access-code screen first (if you set `ACCESS_CODE`), then the full app.

---

## How the access code works
- **No `ACCESS_CODE` set** → app is open (fine for local use)
- **`ACCESS_CODE` set** → visitors see a gold PIN screen; correct code unlocks for that browser session
- The code is checked on the server — it's never exposed in the frontend code

---

## Other hosts
The app is a standard Node/Express server. It also runs on **Render**, **Fly.io**, or any host that supports Node. The only requirements:
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Env vars: `ANTHROPIC_API_KEY` (and optional `ACCESS_CODE`)

> Note: **Vercel is not ideal** for this app — it's serverless and doesn't keep a long-lived Express server with SSE streaming running well. Railway/Render are the right fit.

---

## Tech
React 18 · TypeScript · Vite · Express · Tailwind · Recharts · Anthropic SDK · Claude Opus 4.8
