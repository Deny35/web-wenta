/* WENTA – skrypty */

// Hamburger
const burger    = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});
document.querySelectorAll('.mobile-nav a').forEach(a =>
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
  })
);

// Aktywny link w nav
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a[href^="#"]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 80) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + cur));
});

// ── Karuzela klientów ─────────────────────
(function () {
  const track    = document.getElementById('carousel-track');
  const dotsWrap = document.getElementById('carousel-dots');
  const btnPrev  = document.getElementById('carousel-prev');
  const btnNext  = document.getElementById('carousel-next');
  if (!track) return;

  const items = track.querySelectorAll('.carousel-item');
  const total = items.length;
  let current = 0;

  function itemWidth() {
    // rzeczywista szerokość elementu + gap (mierzona na żywo)
    const item = items[0];
    const gap  = parseInt(getComputedStyle(track).gap) || 20;
    return item.offsetWidth + gap;
  }

  function perView() {
    if (window.innerWidth < 600) return 2;
    if (window.innerWidth < 900) return 3;
    return 5;
  }

  function maxIndex() { return Math.max(0, total - perView()); }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(-${current * itemWidth()}px)`;
    dotsWrap.querySelectorAll('button').forEach((b, i) => {
      b.className = i === current
        ? 'w-2 h-2 rounded-full bg-brand border-0 cursor-pointer scale-125'
        : 'w-2 h-2 rounded-full bg-slate-300 border-0 cursor-pointer';
    });
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Slajd ' + (i + 1));
      btn.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsWrap.appendChild(btn);
    }
  }

  btnPrev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  btnNext.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  // Auto-play co 5 sekund
  let timer = setInterval(autoPlay, 5000);
  function autoPlay() { goTo(current < maxIndex() ? current + 1 : 0); }
  function resetTimer() { clearInterval(timer); timer = setInterval(autoPlay, 5000); }

  window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIndex())); });

  buildDots();
  goTo(0);
})();


// Formularz
const contactForm = document.querySelector('form');
if (contactForm) contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-send');
  btn.textContent = '✓ Wysłano – odpiszemy wkrótce!';
  btn.style.background = '#27ae60';
  btn.disabled = true;
});
