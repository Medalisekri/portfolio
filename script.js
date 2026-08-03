/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

// ── HAMBURGER / MOBILE MENU ─────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mmLinks     = document.querySelectorAll('.mm-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mmLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  // Observe the image wrapper and text
  document.querySelectorAll('.about__img-wrap, .about__text').forEach(el => {
    observer.observe(el);
  });
// ── NAV SCROLL EFFECT ───────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.padding = window.scrollY > 60 ? '12px 40px' : '18px 40px';
}, { passive: true });

// ── SCROLL REVEAL ───────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.section__label, .section__title, .about__inner, .card, .skill-group, .contact__inner, .hero__badge, .hero__title, .hero__sub, .hero__actions'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── SKILL BARS ──────────────────────────────────────────────
const skillBars = document.querySelectorAll('.skill-bar');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const w   = bar.getAttribute('data-w');
      bar.style.setProperty('--w', w + '%');
      bar.classList.add('animated');
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ── EMAILJS CONFIG — replace these 3 values ─────────────────
const EMAILJS_PUBLIC_KEY  = 'OYWIBm4Fg-5dceG1r';     // Account tab
const EMAILJS_SERVICE_ID  = 'service_49bmo3e';     // Email Services tab
const EMAILJS_TEMPLATE_ID = 'template_mqci2jh';    // Email Templates tab

// ── LOAD EMAILJS SDK ─────────────────────────────────────────
(function () {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  document.head.appendChild(s);
})();

// ── CONTACT FORM ─────────────────────────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: name,
      reply_to:  email,
      message:   message,
    });

    form.reset();
    formSuccess.textContent = 'Message sent! I\'ll reply soon. 🚀';
    formSuccess.style.color = 'var(--accent)';
    formSuccess.classList.add('show');
  } catch (err) {
    console.error('EmailJS error:', err);
    formSuccess.textContent = '❌ Something went wrong. Please try again.';
    formSuccess.style.color = '#ff6b6b';
    formSuccess.classList.add('show');
  } finally {
    btn.textContent = 'Send Message ✦';
    btn.disabled = false;
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }
});

// ── SMOOTH ACTIVE NAV LINK ──────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── CURSOR TRAIL (desktop only) ─────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const trail = [];
  const TRAIL_COUNT = 6;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: ${6 - i}px; height: ${6 - i}px;
      border-radius: 50%;
      background: rgba(200,245,66,${0.6 - i * 0.08});
      transform: translate(-50%, -50%);
      transition: transform 0.05s;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateTrail() {
    trail[0].x = mx; trail[0].y = my;
    for (let i = 1; i < TRAIL_COUNT; i++) {
      trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
      trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
    }
    trail.forEach(t => { t.el.style.left = t.x + 'px'; t.el.style.top = t.y + 'px'; });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}
