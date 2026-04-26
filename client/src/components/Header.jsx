import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { href: '/#o-firmie', label: 'O firmie' },
  { href: '/uslugi',    label: 'Usługi' },
  { href: '/projekty',  label: 'Projekty' },
  { href: '/kontakt',   label: 'Kontakt' },
];

const NAV_H    = 56;  // wysokość paska nawigacji (px)
const BANNER_H = 88;  // wysokość białego paska z logo (px)
const THRESHOLD = 20; // px scrollu po których logo chowa się

export default function Header() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome   = location.pathname === '/';

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > THRESHOLD);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showBanner = isHome && !scrolled;

  return (
    <>
      {/* ── Pasek nawigacji ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark text-white shadow-lg" style={{ height: NAV_H }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-full">

          {/* Logo w pasku – niewidoczne na Home gdy baner widoczny */}
          <Link to="/" className="flex items-center" style={{
            opacity:    showBanner ? 0 : 1,
            transform:  showBanner ? 'scale(0.7) translateY(4px)' : 'scale(1) translateY(0)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}>
            <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="h-9 w-auto" />
          </Link>

          {/* Nawigacja */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
            {NAV.map(n => (
              <a key={n.href} href={n.href} className="text-white/70 hover:text-white transition-colors">
                {n.label}
              </a>
            ))}
          </nav>

          {/* Hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobilne menu */}
        {open && (
          <nav className="md:hidden bg-dark border-t border-white/10 flex flex-col px-6 py-4 gap-4 text-sm font-semibold">
            {NAV.map(n => (
              <a key={n.href} href={n.href} className="text-white/70 hover:text-white transition-colors" onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* ── Biały baner z logo (tylko Home) – stała wysokość, ukrywany przez transform ── */}
      {isHome && (
        <div
          className="fixed left-0 right-0 z-40 bg-white flex items-center justify-center overflow-hidden"
          style={{
            top:        NAV_H,
            height:     BANNER_H,
            // Zamiast zmieniać height (co rusza layout) – przesuwamy w górę i chowamy
            transform:  scrolled ? `translateY(-${BANNER_H}px)` : 'translateY(0)',
            opacity:    scrolled ? 0 : 1,
            transition: 'transform 0.4s ease, opacity 0.3s ease',
          }}
        >
          <Link to="/">
            <img src="/Projekt bez nazwy-3.png" alt="Wenta" className="h-16 w-auto" />
          </Link>
        </div>
      )}

      {/* Placeholder – stała wysokość, nie zmienia się podczas scrollu */}
      <div style={{ height: isHome ? NAV_H + BANNER_H : NAV_H }} />
    </>
  );
}
