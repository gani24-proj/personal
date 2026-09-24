# ⚡ AI Career Journey

A personal **1-year career roadmap and progress tracker** for AI/ML + Web Development.  
Built with React + Vite. No backend. No account needed. Everything lives in your browser.

---

## 🎯 What It Does

Helps you answer these questions every day:

- **Where am I?** — Current phase, streak, overall progress
- **What should I learn?** — Phase-by-phase topic tracker with notes
- **What should I build?** — Full project tracker from idea to deployment
- **What have I completed?** — Visual progress across all 6 phases
- **What should I focus on next?** — Today's task checklist

---

## ✨ Features

| Section | What you get |
|---------|-------------|
| 🏠 **Dashboard** | Stats overview, today's focus tasks, streak, current phase |
| 🗺️ **Roadmap** | 6-phase 12-month roadmap with collapsible topic lists & status tracking |
| 📚 **Learn** | 51 learning topics with descriptions, examples, notes, and status |
| 🚀 **Projects** | Full project tracker (add/edit/delete) with progress, links, learnings |
| 🎬 **Content** | YouTube + Instagram pipeline with filtering and status tracking |
| 📊 **Progress** | Stats, progress bars per phase, currently learning, recently completed |

**Plus:**
- 🌙 Dark / Light mode
- 📱 Fully responsive (mobile + desktop)
- 💾 localStorage persistence — all data survives refresh
- 0 external runtime dependencies (React only)

---

## 🗺️ The 12-Month Roadmap

| Phase | Period | Focus |
|-------|--------|-------|
| 1 | Months 1–2 | Python + Web Fundamentals |
| 2 | Months 3–4 | Machine Learning |
| 3 | Months 5–6 | Deep Learning + Generative AI |
| 4 | Months 7–8 | Full-Stack AI Development |
| 5 | Months 9–10 | Major AI Project |
| 6 | Months 11–12 | Portfolio + Career + Content |

---

## 🛠️ Tech Stack

- **React 19** — UI framework
- **Vite 8** — build tool and dev server
- **localStorage** — data persistence (zero backend)
- **CSS custom properties** — design system with dark/light theme
- **No external UI libraries** — every component is hand-crafted

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/ai-career-journey.git
cd ai-career-journey
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Output goes to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment

### GitHub Pages

1. In `vite.config.js`, add your repository base path:

```js
export default defineConfig({
  base: '/ai-career-journey/',  // ← your repo name
  plugins: [react()],
})
```

2. Install the deploy tool:

```bash
npm install --save-dev gh-pages
```

3. Add to `package.json` scripts:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

4. Deploy:

```bash
npm run deploy
```

### Vercel / Netlify

Just connect your GitHub repo — both platforms auto-detect Vite and configure everything.

---

## 📁 Project Structure

```
ai-career-journey/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Sidebar.jsx          # Navigation sidebar + mobile header
│   ├── context/
│   │   └── AppContext.jsx        # Global state (React Context)
│   ├── data/
│   │   ├── roadmapData.js        # All phase/topic data (source of truth)
│   │   └── storage.js            # localStorage abstraction layer
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Roadmap.jsx
│   │   ├── Learn.jsx
│   │   ├── Projects.jsx
│   │   ├── Content.jsx
│   │   └── Progress.jsx
│   ├── utils/
│   │   └── helpers.js            # Shared utilities
│   ├── App.jsx                   # Root layout + page routing
│   ├── App.css                   # (intentionally empty)
│   ├── index.css                 # Design system + all component styles
│   └── main.jsx                  # Entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🔮 Future Improvements

- **Cloud sync** — Replace localStorage with Supabase or Firebase
- **Authentication** — Multi-device access with login
- **AI assistant** — Chat interface for daily study guidance
- **Calendar view** — Schedule topics across weeks
- **Habit tracking** — Detailed daily/weekly habit logs
- **Export/Import** — JSON backup and restore
- **Notifications** — Daily reminders via browser Notification API
- **Game development track** — Dedicated section for secondary goal

---

## 📄 License

MIT — use it, fork it, make it your own.
