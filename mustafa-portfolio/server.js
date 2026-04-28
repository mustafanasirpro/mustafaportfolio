/**
 * GHULAM MUSTAFA NASIR — Portfolio Backend
 * Express server · Contact Form API · Static Serving
 * ─────────────────────────────────────────────────
 *   npm install
 *   node server.js  →  http://localhost:3000
 */

const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ── Load .env ────────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

// ── Rate limiter ──────────────────────────────
const rateLimitMap = new Map();
function rateLimit(req, res, next) {
  const ip  = req.ip;
  const now = Date.now();
  const rec = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - rec.start > 60000) { rec.count = 0; rec.start = now; }
  rec.count++;
  rateLimitMap.set(ip, rec);
  if (rec.count > 5) return res.status(429).json({ success: false, message: 'Too many requests. Try again in a minute.' });
  next();
}

// ── Validation ────────────────────────────────
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const sanitize = s => String(s || '').replace(/[<>]/g, '').trim().slice(0, 2000);

// ── Contact API ───────────────────────────────
app.post('/api/contact', rateLimit, async (req, res) => {
  try {
    const name    = sanitize(req.body.name);
    const email   = sanitize(req.body.email);
    const subject = sanitize(req.body.subject);
    const message = sanitize(req.body.message);

    const errors = [];
    if (name.length < 2)    errors.push('Name too short.');
    if (!isEmail(email))    errors.push('Invalid email.');
    if (subject.length < 3) errors.push('Subject too short.');
    if (message.length < 10)errors.push('Message too short.');
    if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.OWNER_EMAIL || 'mustafanasirpro@gmail.com',
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;padding:32px;background:#03050d;color:#e8eef8;border-radius:12px;">
            <h2 style="color:#38bdf8;margin-bottom:20px;">📩 New Message on Your Portfolio</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#38bdf8;">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border-color:#1a2233;margin:20px 0"/>
            <p style="background:#0b0f24;padding:20px;border-radius:8px;border-left:3px solid #38bdf8;line-height:1.7;">
              ${message.replace(/\n/g,'<br/>')}
            </p>
            <p style="color:#3d4b5e;font-size:12px;margin-top:24px;">Sent via mustafa-portfolio · ${new Date().toUTCString()}</p>
          </div>`,
      });

      // auto-reply
      await transporter.sendMail({
        from: `"Ghulam Mustafa Nasir" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Hey ${name}, got your message! 👋`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;padding:32px;background:#03050d;color:#e8eef8;border-radius:12px;">
            <h2 style="color:#38bdf8;">Hey ${name}! 👋</h2>
            <p style="color:#7a8899;line-height:1.7;margin:16px 0;">
              Thanks for reaching out! I've received your message and will get back to you as soon as possible — typically within 24 hours.
            </p>
            <p style="color:#7a8899;">— Ghulam Mustafa Nasir<br/>CS Student · COMSATS Sahiwal</p>
          </div>`,
      });
    } else {
      // Test mode — log to console
      console.log('\n📬 [Contact] ──────────────────────────');
      console.log('  From:   ', name, `<${email}>`);
      console.log('  Subject:', subject);
      console.log('  Message:', message);
      console.log('  [Configure .env for real emails]\n');
    }

    res.json({ success: true, message: 'Message received! I\'ll reply within 24 hours 🚀' });
  } catch (err) {
    console.error('[Contact Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please email me directly.' });
  }
});

// ── Health ────────────────────────────────────
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  owner: 'Ghulam Mustafa Nasir',
  smtp: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
  timestamp: new Date().toISOString(),
}));

// ── Fallback → index.html ─────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║  🚀 Mustafa's Portfolio · Port ${PORT}    ║`);
  console.log(`║  🌐 http://localhost:${PORT}             ║`);
  console.log('╚══════════════════════════════════════╝\n');
  console.log(`  SMTP: ${process.env.SMTP_USER ? '✅ Ready' : '⚠  Test mode (add .env)'}`);
});
