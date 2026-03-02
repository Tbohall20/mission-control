# Mission Control ⚡

Your real-time business operations command center. Built with Next.js 14 + Convex.

---

## How to Deploy — Step by Step

No coding experience needed. Just follow these steps in order.

---

### Step 1 — Install Dependencies

Open a terminal (Command Prompt or PowerShell) inside the `mission-control` folder, then run:

```
npm install
```

Wait for it to finish. It'll download all the code libraries the app needs.

---

### Step 2 — Set Up Your Database (Convex)

Run this command:

```
npx convex dev
```

A browser window will open and ask you to log in with GitHub. Log in.

After logging in, Convex will:
- Create a new project for you (call it `mission-control`)
- Show you two values in the terminal that look like this:
  ```
  CONVEX_DEPLOYMENT=dev:your-project-name-here-123
  NEXT_PUBLIC_CONVEX_URL=https://your-project-name-here-123.convex.cloud
  ```

**Keep this terminal running** — it syncs your database schema automatically.

---

### Step 3 — Create Your Environment File

In the `mission-control` folder, you'll see a file called `.env.local.example`.

1. Make a copy of it and rename the copy to `.env.local` (remove the `.example` part)
2. Open `.env.local` in any text editor (Notepad works)
3. Paste the two values from Step 2:

```
CONVEX_DEPLOYMENT=dev:your-project-name-here-123
NEXT_PUBLIC_CONVEX_URL=https://your-project-name-here-123.convex.cloud
```

Save the file.

---

### Step 4 — Run Locally to Test

Open a **second** terminal window (keep the Convex one running), navigate to the `mission-control` folder, and run:

```
npm run dev
```

Open your browser and go to: **http://localhost:3000**

Your Mission Control dashboard should appear with all 8 panels pre-loaded with data.

If it works, move to Step 5.

---

### Step 5 — Push to GitHub

First, make sure you have Git installed. If you don't, download it from https://git-scm.com/

Run these commands one at a time:

```
git init
git add .
git commit -m "Initial commit — Mission Control"
```

Then:
1. Go to https://github.com and log in
2. Click the **+** button in the top right → **New repository**
3. Name it `mission-control`
4. Leave everything else as default → Click **Create repository**
5. GitHub will show you commands — copy and run the ones under "push an existing repository"

They'll look like:
```
git remote add origin https://github.com/YOUR-USERNAME/mission-control.git
git branch -M main
git push -u origin main
```

---

### Step 6 — Deploy to Vercel (Live on the Internet)

1. Go to https://vercel.com and sign up (use your GitHub account)
2. Click **Add New Project**
3. Select your `mission-control` repository from GitHub
4. Click **Import**
5. On the configuration screen, click **Environment Variables** and add:
   - `CONVEX_DEPLOYMENT` → paste your value from Step 2
   - `NEXT_PUBLIC_CONVEX_URL` → paste your value from Step 2
6. Click **Deploy**

Vercel will build and deploy your app. In about 2 minutes, you'll get a live URL like:
`https://mission-control-xyz.vercel.app`

---

### Done! 🎉

Your Mission Control is now live. Every time you push changes to GitHub, Vercel automatically redeploys.

---

## The 8 Panels

| Panel | URL | What it shows |
|-------|-----|---------------|
| Tasks Board | /tasks | Kanban with Todo, In Progress, Done |
| Memory | /memory | Searchable knowledge base |
| Team | /team | All agents, roles, and responsibilities |
| Office | /office | Visual digital office with live status |
| Launch Tracker | /launch | Product launch phases and revenue |
| Agent Logs | /logs | Real-time feed of agent activity |
| Product Vault | /vault | All products — ideas to launched |
| Ecom Pipeline | /ecom | Dedicated ecom agent control room |

---

## Need Help?

If something breaks, the most common fixes are:
1. Make sure the Convex terminal is still running (Step 2)
2. Double-check your `.env.local` has the right values
3. Try stopping (`Ctrl+C`) and restarting both terminals
