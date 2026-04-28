# ⚡ Ghulam Mustafa Nasir — Portfolio

A premium 5D animated personal portfolio website built for a CS student at COMSATS Sahiwal.

## 🚀 Quick Start (Local Development)

Simply double-click the `run.bat` file to start a local development server!

Alternatively, you can run:
```bash
python -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

## 📁 Structure

```
portfolio/
├── index.html        ← All sections (Hero, About, Skills, Projects, Education, Contact)
├── css/style.css     ← Full styles — dark cosmic theme
├── js/main.js        ← Particle canvas, typing, tilt, counters
└── run.bat           ← Local development server launcher
```

## ✏️ How to Update YOUR Details

Everything is in `index.html`. Search for these to replace:
- `Ghulam Mustafa Nasir` — your full name
- `mustafanasirpro@gmail.com` — your email
- `+923148584883` — your phone
- Project titles/descriptions — update each `.proj-card`
- Skills percentages — change `--pct:70%` values in `.sbar-fill` elements

## 🌐 Deploy

**Vercel / Netlify / GitHub Pages:**
Since this is a pure static frontend (HTML/CSS/JS), you can deploy it directly without any build steps! 
- On Vercel: Just import your GitHub repository, leave the Framework Preset as "Other", and hit Deploy. Vercel will automatically serve your `index.html`.

---
Built with 💻 by Ghulam Mustafa Nasir · COMSATS Sahiwal · 2025
