/* ═══════════════════════════════════════════════
   ETHEREAL 12D PORTFOLIO JS
   ═══════════════════════════════════════════════ */

'use strict';

// ── LOADER ──
const loader = document.getElementById('loader');
const loaderCode = document.getElementById('loaderCode');
const phrases = ['initiating sequence', 'aligning dimensions', 'stabilizing core', 'entering 12D space'];
let pi = 0;
const loaderInterval = setInterval(() => {
  if (loaderCode) loaderCode.textContent = phrases[pi++ % phrases.length];
}, 400);

window.addEventListener('load', () => {
  setTimeout(() => {
    clearInterval(loaderInterval);
    loader?.classList.add('out');
    document.body.style.overflow = '';
    initAnimations();
  }, 2000);
});
document.body.style.overflow = 'hidden';

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const curAura = document.getElementById('curAura');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
});
(function trailLoop() {
  tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
  if (curAura) { curAura.style.left = tx + 'px'; curAura.style.top = ty + 'px'; }
  requestAnimationFrame(trailLoop);
})();

// ── 12D NEBULA CANVAS (HERO) ──
(function initNebula() {
  const canvas = document.getElementById('nebula');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;
  const colors = ['#64c9e3', '#cefc98', '#2c6f86', '#ffffff'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    const count = Math.min(Math.floor(W * H / 6000), 250);
    particles = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * W * 3,
      y: (Math.random() - 0.5) * H * 3,
      z: Math.random() * 2000,
      r: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedZ: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2,
      orbitSpeed: (Math.random() - 0.5) * 0.002
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    const cx = W / 2;
    const cy = H / 2;
    const fov = 400;

    // Mouse parallax offset
    const mxOff = (mx - cx) * 0.08;
    const myOff = (my - cy) * 0.08;

    // Sort by Z for proper rendering order (back to front)
    particles.sort((a, b) => b.z - a.z);

    particles.forEach(p => {
      // 12D Motion: Move forward, orbit around center
      p.z -= p.speedZ;
      p.angle += p.orbitSpeed;
      
      // Rotate coordinates around center
      const rx = Math.cos(p.angle) * p.x - Math.sin(p.angle) * p.y;
      const ry = Math.sin(p.angle) * p.x + Math.cos(p.angle) * p.y;

      if (p.z <= 1) {
        p.z = 2000;
        p.x = (Math.random() - 0.5) * W * 3;
        p.y = (Math.random() - 0.5) * H * 3;
      }

      const scale = fov / (fov + p.z);
      const x2d = rx * scale + cx - mxOff * scale;
      const y2d = ry * scale + cy - myOff * scale;

      if (x2d > 0 && x2d < W && y2d > 0 && y2d < H) {
        const size = Math.max(0.1, p.r * scale * 2);
        const opacity = Math.min(1, Math.max(0, 1 - (p.z / 2000)));
        
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Ethereal glow
        ctx.shadowBlur = size * 4;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = opacity;
        
        ctx.fill();
      }
    });
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    animId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); draw(); });
  draw();
})();

// ── SIMPLE 3D TEXT ANIMATION ──
document.fonts.ready.then(() => {
  const words = document.querySelectorAll('.title-word');
  let delay = 0;
  
  words.forEach((word) => {
    const text = word.textContent;
    word.textContent = '';
    
    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'char-3d';
      if (word.classList.contains('glow-text')) span.classList.add('glow-char');
      
      span.style.animationDelay = `${delay}s`;
      delay += 0.05; // 50ms stagger per letter
      
      word.appendChild(span);
    });
  });
});

// ── TYPING EFFECT ──
const roles = [
  'CS Student',
  'Frontend Developer',
  'Data Science Enthusiast',
  'Code Architect',
  'Creative Thinker'
];
let ri = 0, ci = 0, deleting = false;
const typed = document.getElementById('typedRole');

function typeRole() {
  if (!typed) return;
  const current = roles[ri];
  if (!deleting) {
    typed.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(typeRole, 2000); return; }
  } else {
    typed.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 30 : 80);
}
setTimeout(typeRole, 2500);

// ── NAVIGATION & SCROLL ──
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link[data-s]');
const allSecs = document.querySelectorAll('section[id]');
const burger = document.getElementById('burger');
const mobNav = document.getElementById('mobNav');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('stuck', window.scrollY > 50);
  
  let cur = '';
  allSecs.forEach(s => { if (window.scrollY >= s.offsetTop - 300) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('on', a.dataset.s === cur));
});

burger?.addEventListener('click', () => {
  mobNav?.classList.toggle('open');
});
mobNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobNav.classList.remove('open');
}));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── SCROLL REVEAL & STATS ──
function initAnimations() {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revObs.observe(el));

  // Skill bars
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sbar-fill').forEach(f => f.classList.add('go'));
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skills-grid').forEach(g => barObs.observe(g));

  // Stats Counters
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseFloat(el.dataset.target);
          const dec = parseInt(el.dataset.dec) || 0;
          const start = performance.now();
          function step(now) {
            const p = Math.min((now - start) / 2000, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            el.textContent = (target * ease).toFixed(dec);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
        countObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stat-row').forEach(el => countObs.observe(el));
}

// ── 3D TILT EFFECT ──
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const rx = ((y - cy) / cy) * -10;
    const ry = ((x - cx) / cx) * 10;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

// ── CONTACT FORM ──
const form = document.getElementById('contactForm');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button');
  const text = btn.querySelector('.btn-text');
  
  text.textContent = 'Transmitting...';
  btn.disabled = true;

  setTimeout(() => {
    form.reset();
    text.textContent = 'Message Sent ✦';
    showToast('Signal received! Mustafa will reach out soon.');
    setTimeout(() => { text.textContent = 'Send Message →'; btn.disabled = false; }, 3000);
  }, 1500);
});

function showToast(msg) {
  const t = document.getElementById('toast');
  const tm = document.getElementById('toastMsg');
  if (!t || !tm) return;
  tm.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}
