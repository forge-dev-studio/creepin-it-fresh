(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Sticky-nav state ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $('.nav__burger');
  const mobile = $('#mobileNav');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.hasAttribute('hidden') ? false : true;
      if (open) {
        mobile.setAttribute('hidden', '');
        burger.setAttribute('aria-expanded', 'false');
        mobile.style.display = '';
      } else {
        mobile.removeAttribute('hidden');
        burger.setAttribute('aria-expanded', 'true');
        mobile.style.display = 'block';
      }
    });
    $$('a', mobile).forEach((a) => {
      a.addEventListener('click', () => {
        mobile.setAttribute('hidden', '');
        mobile.style.display = '';
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* (Reveal-on-scroll intentionally removed — cards visible by default for instant render and screenshot fidelity.) */

  /* ---------- Scent finder ---------- */
  const RECOMMENDATIONS = {
    'city|quiet':     { picks: ['Bubblegum Heart', 'Spring Butterfly'], why: 'Quiet, in-town drives ask for soft. Cotton candy and white tea up front, blonde woods underneath.' },
    'city|warm':      { picks: ['Pink Mushroom', 'Buttercup Daisy'],    why: 'Warm city blocks. Bourbon vanilla, marshmallow, and a wink of jasmine.' },
    'city|bright':    { picks: ['Spring Butterfly', 'Georgia Peach'],   why: 'Blood orange, jasmine tea, white peach. The city as a Saturday, not a Tuesday.' },
    'city|moody':     { picks: ['Sweet Cherry', 'Pink Mushroom'],       why: 'Streetlights and a vinyl booth. Maraschino, currant, dark almond.' },

    'highway|quiet':  { picks: ['Bubblegum Heart', 'Buttercup Daisy'],  why: 'Long stretches of nothing. Soft cotton candy, lemon zest, jasmine.' },
    'highway|warm':   { picks: ['Pink Mushroom', 'Georgia Peach'],      why: 'Sunset miles. Bourbon vanilla, white peach, soft amber.' },
    'highway|bright': { picks: ['Spring Butterfly', 'Buttercup Daisy'], why: 'Windows down, sun up. Blood orange, green cedar, lemon zest.' },
    'highway|moody':  { picks: ['Sweet Cherry', 'Spring Butterfly'],    why: 'Headlights at midnight. Maraschino, vetiver, sea salt.' },

    'backroad|quiet': { picks: ['Buttercup Daisy', 'Bubblegum Heart'],  why: 'Two-lane silence. Lemon zest, jasmine, and a cotton candy finish.' },
    'backroad|warm':  { picks: ['Georgia Peach', 'Pink Mushroom'],      why: 'Front-porch warmth at thirty-five miles per hour.' },
    'backroad|bright':{ picks: ['Georgia Peach', 'Spring Butterfly'],   why: 'August. White peach, jasmine tea, green cedar.' },
    'backroad|moody': { picks: ['Sweet Cherry', 'Pink Mushroom'],       why: 'Gravel and pine shadows. Currant, almond, soft amber.' },

    'coast|quiet':    { picks: ['Bubblegum Heart', 'Spring Butterfly'], why: 'Salt air and an early window. White tea, sea salt, blonde woods.' },
    'coast|warm':     { picks: ['Pink Mushroom', 'Georgia Peach'],      why: 'Late afternoon on a barrier island. Vanilla, peach, soft amber.' },
    'coast|bright':   { picks: ['Spring Butterfly', 'Buttercup Daisy'], why: 'A ten-AM coast drive. Blood orange, lemon zest, sea salt.' },
    'coast|moody':    { picks: ['Sweet Cherry', 'Spring Butterfly'],    why: 'Storm rolling in. Black currant, vetiver, sea salt.' },
  };

  const finderResult = $('#finderResult');
  function updateFinder() {
    if (!finderResult) return;
    const road = (document.querySelector('input[name="road"]:checked') || {}).value || 'city';
    const mood = (document.querySelector('input[name="mood"]:checked') || {}).value || 'quiet';
    const key = `${road}|${mood}`;
    const rec = RECOMMENDATIONS[key] || RECOMMENDATIONS['city|quiet'];
    finderResult.innerHTML = `
      <p class="eyebrow">Your air</p>
      <p class="finder__pick"><strong>${rec.picks[0]}</strong> &amp; <span>${rec.picks[1]}</span></p>
      <p class="finder__why">${rec.why}</p>
    `;
  }
  $$('input[name="road"], input[name="mood"]').forEach((input) => {
    input.addEventListener('change', updateFinder);
  });
  updateFinder();

  /* ---------- Custom form ---------- */
  const form = $('#customForm');
  const success = $('#formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      if (!name || !email) {
        const firstInvalid = $$('input[required], select[required]', form).find((el) => !el.value.trim());
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      const payload = {
        name,
        email,
        phone: data.get('phone') || '',
        qty: data.get('qty') || '',
        occasions: data.getAll('occasion'),
        notes: data.get('notes') || ''
      };
      console.log('[CABIN] custom request', payload);
      form.reset();
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ---------- Smooth-scroll active link ---------- */
  if ('IntersectionObserver' in window) {
    const links = $$('.nav__links a');
    const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const map = new Map(sections.map((s, i) => [s, links[i]]));
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => navIo.observe(s));
  }
})();
