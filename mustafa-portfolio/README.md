# ⚡ Ghulam Mustafa Nasir — Portfolio

A premium 5D animated personal portfolio website built for a CS student at COMSATS Sahiwal.

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Run
npm start

# 3. Open
http://localhost:3000
```

## ✉️ Enable Contact Form Emails

```bash
cp .env.example .env
# Fill in Gmail + App Password
```

## 📁 Structure

```
portfolio/
├── index.html        ← All sections (Hero, About, Skills, Projects, Education, Contact)
├── server.js         ← Express backend (API + static server)
├── css/style.css     ← Full styles — dark cosmic theme
├── js/main.js        ← Particle canvas, typing, tilt, counters
├── .env.example      ← Email config template
└── package.json
```

## ✏️ How to Update YOUR Details

Everything is in `index.html`. Search for these to replace:
- `Ghulam Mustafa Nasir` — your full name
- `mustafanasirpro@gmail.com` — your email
- `+923148584883` — your phone
- Project titles/descriptions — update each `.proj-card`
- Skills percentages — change `--pct:70%` values in `.sbar-fill` elements

## 🌐 Deploy

**Render / Railway / Vercel:**  
Connect GitHub repo → set Start Command: `npm start`

**VPS:**
```bash
npm install -g pm2
pm2 start server.js --name portfolio
```

---
Built with 💻 by Ghulam Mustafa Nasir · COMSATS Sahiwal · 2025
