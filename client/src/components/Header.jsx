import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { href: '/#o-firmie', label: 'O firmie' },
  { href: '/uslugi',    label: 'Usługi' },
  { href: '/projekty',  label: 'Projekty' },
  { href: '/kontakt',   label: 'Kontakt' },
];

const NAV_H       = 56;
const THRESHOLD   = 20;
const HERO_LOGO_W = 380;
const NAV_LOGO_H  = 36;
const NAV_LOGO_W  = 120;

export default function Header() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome   = location.pathname === '/';

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > THRESHOLD); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark text-white shadow-lg" style={{ height: NAV_H }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-full">

          <Link to="/" className="flex items-center"
            style={{ visibility: isHome ? 'hidden' : 'visible' }}
          >
            <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="h-9 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
            {NAV.map(n => (
              <a key={n.href} href={n.href} className="text-white/70 hover:text-white transition-colors">
                {n.label}
              </a>
            ))}
          </nav>

          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

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

      {isHome && (
        <div
          style={{
            position:   'fixed',
            zIndex:     60,
            left:       24,
            top:        scrolled ? Math.round((NAV_H - NAV_LOGO_H) / 2) : -60,
            width:      scrolled ? NAV_LOGO_W : HERO_LOGO_W,
            height:     scrolled ? NAV_LOGO_H : HERO_LOGO_W,
            transform:  scrolled
              ? 'translateX(0px)'
              : `translateX(calc(50vw - 24px - ${HERO_LOGO_W / 2}px))`,
            transition: 'top 0.4s ease, width 0.4s ease, height 0.4s ease, transform 0.4s ease',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <Link to="/" className="relative z-10 flex items-center justify-center w-full h-full">
            <img
              src="/Projekt bez nazwy-4.png"
              alt="Wenta"
              style={{
                width:     scrolled ? '100%' : '60%',
                height:    scrolled ? '100%' : 'auto',
                objectFit: 'contain',
                animation: scrolled ? 'none' : 'heroLogoFloat 4s ease-in-out infinite',
                transition: 'width 0.4s ease, height 0.4s ease',
              }}
            />
          </Link>

          <style>{`
            @keyframes heroRipple {
              0%   { transform: scale(1);   opacity: 1; }
              100% { transform: scale(2.2); opacity: 0; }
            }
            @keyframes heroLogoFloat {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-8px); }
            }
          `}</style>
        </div>
      )}

      <div style={{ height: NAV_H }} />
    </>
  );
}
