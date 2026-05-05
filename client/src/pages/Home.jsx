import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';
import { useContent } from '../useContent';


const Label = ({ children }) => (
  <span className="text-xs font-bold tracking-widest uppercase text-accent">{children}</span>
);


const SLIDES = [
  {
    bg:    '/Spawacz.png',
    label: 'Od 1993 roku',
    title: 'Produkcja instalacji\ntechnologicznych',
    desc:  'Dla wygody naszych Klientów zajmujemy się dostawą, rozładunkiem oraz montażem na miejscu.',
    cta1:  { label: 'Sprawdź produkty', href: '#produkty' },
    cta2:  { label: 'Kontakt',          href: '/kontakt'  },
  },
  {
    bg:    '/Inzynier.png',
    label: 'Kompleksowo',
    title: 'Izolacje, projektowanie 3D,\nobróbka stali, relokacja maszyn',
    desc:  'Dedykowane rozwiązania technologiczne dopasowane do potrzeb Twojej firmy.',
    cta1:  { label: 'Nasze usługi', href: '/uslugi'  },
    cta2:  { label: 'Kontakt',      href: '/kontakt' },
  },
  {
    bg:    '/Instalacja.png',
    label: 'Stal nierdzewna',
    title: 'Maszyny i urządzenia\ndla przemysłu spożywczego',
    desc:  'Produkujemy i montujemy maszyny spełniające normy EHEDG i GMP. Jakość potwierdzona certyfikatami.',
    cta1:  { label: 'Realizacje', href: '/projekty' },
    cta2:  { label: 'Kontakt',    href: '/kontakt'  },
  },
];


function HeroSlider() {
  const [cur, setCur] = useState(0);
  const timerRef      = useRef(null);
  const n             = SLIDES.length;

  function goTo(next) {
    setCur(next);
  }

  function advance(direction) {
    const next = (cur + direction + n) % n;
    goTo(next, direction);
  }

  function resetTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => advance(1), 5500);
  }

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  const slide = SLIDES[cur];

  return (
    <section className="relative overflow-hidden bg-slate-900" style={{ height: '90vh', minHeight: 480, maxHeight: 720 }}>

      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === cur ? 1 : 0,
            backgroundImage: `url(${s.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: i === cur ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.88) 55%, rgba(15,23,42,0.3) 100%)' }} />

      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <div key={cur} style={{ animation: 'heroIn 0.7s ease both', maxWidth: 680 }}>
            <span className="text-xs font-bold tracking-widest uppercase text-accent block mb-3">{slide.label}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              {slide.desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={slide.cta1.href} className="px-7 py-3.5 rounded-lg bg-brand text-white font-bold text-sm hover:opacity-90 transition-opacity">
                {slide.cta1.label}
              </a>
              <a href={slide.cta2.href} className="px-7 py-3.5 rounded-lg border-2 border-white/40 text-white font-bold text-sm hover:border-white transition-colors">
                {slide.cta2.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => { advance(-1); resetTimer(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        aria-label="Poprzedni"
      >&#8249;</button>
      <button
        onClick={() => { advance(1); resetTimer(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        aria-label="Następny"
      >&#8250;</button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetTimer(); }}
            className="transition-all duration-300 rounded-full"
            style={{
              width:      i === cur ? 28 : 8,
              height:     8,
              background: i === cur ? 'var(--color-brand, #2563eb)' : 'rgba(255,255,255,0.35)',
            }}
            aria-label={`Slajd ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoRipple {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}


const ProductCard = ({ icon, title, desc }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-5 hover:-translate-y-1 hover:border-accent hover:shadow-lg transition-all duration-200">
    <div className="w-10 h-10 bg-blue-50 rounded-lg grid place-items-center mb-3">
      <svg className="w-5 h-5 fill-accent" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icon }} />
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);


const ServiceRow = ({ icon, title, desc }) => (
  <div className="flex gap-3 p-4 bg-white border border-slate-200 border-l-4 border-l-accent rounded-r-lg hover:shadow-md transition-shadow">
    <svg className="w-5 h-5 fill-accent flex-shrink-0 mt-0.5" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icon }} />
    <div>
      <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);


function Carousel({ clients }) {
  const [idx, setIdx]       = useState(clients.length);
  const [animated, setAnim] = useState(true);
  const timerRef            = useRef(null);

  const ITEM_W = 160;
  const GAP    = 20;

  const triple = [...clients, ...clients, ...clients];

  function step(dir) {
    setAnim(true);
    setIdx(i => i + dir);
  }

  function resetTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => step(1), 3500);
  }

  useEffect(() => {
    setIdx(clients.length);
    resetTimer();
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients.length]);

  useEffect(() => {
    if (idx >= clients.length * 2) {
      setTimeout(() => { setAnim(false); setIdx(i => i - clients.length); }, 500);
    } else if (idx < clients.length) {
      setTimeout(() => { setAnim(false); setIdx(i => i + clients.length); }, 500);
    }
  }, [idx, clients.length]);

  if (!clients.length) return <p className="text-slate-400 text-sm text-center">Brak firm klientów.</p>;

  return (
    <div className="flex items-center gap-2 max-w-5xl mx-auto px-6">

      <button
        onClick={() => { step(-1); resetTimer(); }}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-slate-200 grid place-items-center text-xl text-slate-500 hover:bg-accent hover:text-white hover:border-accent transition-colors"
        aria-label="Poprzedni"
      >&#8249;</button>

      <div className="flex-1 overflow-hidden">
        <div
          className="flex gap-5"
          style={{
            transform: `translateX(-${idx * (ITEM_W + GAP)}px)`,
            transition: animated ? 'transform 0.5s ease' : 'none',
          }}
        >
          {triple.map((c, i) => (
            <div
              key={i}
              className="group relative flex-shrink-0 w-40 h-20 bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-accent transition-colors"
            >
              {c.logo
                ? <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-slate-500 px-2 text-center">{c.name}</div>
              }
              {c.logo && (
                <div className="absolute inset-0 bg-accent/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-xs font-bold text-center px-2">{c.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { step(1); resetTimer(); }}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-slate-200 grid place-items-center text-xl text-slate-500 hover:bg-accent hover:text-white hover:border-accent transition-colors"
        aria-label="Następny"
      >&#8250;</button>

    </div>
  );
}


function ProjectTile({ p }) {
  return (
    <Link to={`/realizacja/${p.id}`} className="group relative block bg-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ aspectRatio: '16/9' }}>
      {p.img
        ? <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400 group-hover:opacity-0" />
        : <div className="absolute inset-0 bg-slate-700" />
      }

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="font-bold text-white text-sm drop-shadow">{p.title}</h3>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm text-center leading-relaxed line-clamp-5">{p.opis || 'Brak opisu.'}</p>
        <span className="mt-4 text-xs font-bold text-accent uppercase tracking-wider">Zobacz więcej →</span>
      </div>
    </Link>
  );
}


export default function Home() {
  const { c } = useContent();

  const [featured, setFeatured] = useState([]);
  const [clients,  setClients]  = useState([]);

  useEffect(() => {
    api.projects.list().then(list => setFeatured(list.filter(p => p.featured).slice(0, 3)));
    api.clients.list().then(setClients);
  }, []);

  return (
    <>
      <Header />

      <div>

        <HeroSlider />


        <section id="o-firmie" className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-start">

              <div className="flex-1">
                <Label>{c('about_label')}</Label>
                <h2 className="mt-2 mb-6 text-4xl font-extrabold text-slate-800 leading-tight whitespace-pre-line">{c('about_title')}</h2>
                <div className="flex items-center gap-0 mb-8">
                  <div className="w-12 h-0.5 bg-accent" />
                  <div className="w-28 h-0.5 bg-slate-200" />
                </div>
                <p className="text-slate-700 font-semibold leading-relaxed mb-6">{c('about_desc')}</p>
                <div className="flex flex-wrap gap-2">
                  {['Stal nierdzewna','Instalacje kwasoodporne','Projektowanie 3D','EHEDG / GMP','Spawanie orbitalne'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-accent text-white text-xs font-bold">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-200 border border-slate-200 rounded-xl min-w-[240px]">
                {[
                  { n: '30+',  l: 'Lat doświadczenia' },
                  { n: '200+', l: 'Zrealizowanych projektów' },
                ].map(s => (
                  <div key={s.l} className="py-8 px-10 flex flex-col items-center justify-center">
                    <div className="text-6xl font-extrabold text-accent">{s.n}</div>
                    <div className="text-sm font-bold text-slate-700 mt-2 text-center uppercase tracking-wide">{s.l}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>


        <section id="produkty" className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <Label>Produkty</Label>
            <h2 className="mt-1 mb-8 text-3xl font-extrabold text-slate-800">Co produkujemy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProductCard icon='<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' title="Linie technologiczne"    desc="Kompletne linie produkcyjne ze stali nierdzewnej pod konkretny proces." />
              <ProductCard icon='<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>' title="Zbiorniki nierdzewne"    desc="Procesowe, magazynowe i ciśnieniowe – certyfikowane z dokumentacją UDT." />
              <ProductCard icon='<path d="M3 3h18v18H3z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'                title="Instalacje rurowe"       desc="Rurociągi ze stali nierdzewnej i kwasoodpornej – sanitarne, technologiczne, CIP." />
              <ProductCard icon='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'                            title="SKID-y produkcyjne"      desc="Gotowe moduły procesowe z armaturą i osprzętem – plug & play." />
              <ProductCard icon='<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' title="Stacje mycia CIP" desc="Automatyczne mycie instalacji bez demontażu – z dokumentowanymi programami." />
              <ProductCard icon='<path d="M12 22V12m0 0L8 8m4 4l4-4M4 6h16"/>'                                       title="Mieszalniki przemysłowe" desc="Różne typy wirników – do roztworów, past, emulsji i zawiesin." />
              <ProductCard icon='<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>' title="Przenośniki"             desc="Taśmowe, ślimakowe i łańcuchowe ze stali nierdzewnej." />
              <ProductCard icon='<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' title="Konstrukcje stalowe"  desc="Platformy, podesty, schody i balustrady ze stali nierdzewnej." />
            </div>
          </div>
        </section>


        <section id="uslugi" className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <Label>Usługi</Label>
            <h2 className="mt-1 mb-8 text-3xl font-extrabold text-slate-800">Od projektu do serwisu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ServiceRow icon='<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>'   title="Projektowanie 3D"                        desc="Projekty P&ID, rysunki warsztatowe, wizualizacje 3D, dokumentacja techniczna." />
              <ServiceRow icon='<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>' title="Obróbka i spawanie"    desc="Cięcie laserowe, CNC, spawanie TIG orbitalne, elektropolerowanie." />
              <ServiceRow icon='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'                                                    title="Izolacje techniczne"                     desc="Izolacje termiczne rurociągów i zbiorników – obudowy nierdzewne lub aluminiowe." />
              <ServiceRow icon='<path d="M5 12H19M12 5l7 7-7 7"/>'                                                                          title="Relokacja maszyn"                        desc="Demontaż, transport i ponowny montaż linii produkcyjnych." />
              <ServiceRow icon='<path d="M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>' title="Maszyny i urządzenia przemysłu spożywczego" desc="Produkcja i montaż maszyn oraz urządzeń dedykowanych dla branży spożywczej." />
              <ServiceRow icon='<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>' title="Instalacje procesowe"   desc="Kompleksowe instalacje procesowe ze stali nierdzewnej dla różnych gałęzi przemysłu." />
              <ServiceRow icon='<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>'       title="Urządzenia i instalacje transportowe"    desc="Systemy transportu wewnętrznego – przenośniki, rurociągi, instalacje pneumatyczne." />
              <ServiceRow icon='<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'                                                        title="Montaż linii technologicznych"           desc="Realizujemy montaże kompletnych linii technologicznych – od spawania po uruchomienie i testy." />
            </div>
          </div>
        </section>


        <section id="realizacje" className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <Label>Realizacje</Label>
                <h2 className="mt-1 text-3xl font-extrabold text-slate-800">Wybrane projekty</h2>
              </div>
              <Link to="/projekty" className="px-5 py-2.5 rounded border-2 border-accent text-accent font-bold text-sm hover:bg-accent hover:text-white transition-colors">Więcej realizacji →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(p => <ProjectTile key={p.id} p={p} />)}
              {!featured.length && <p className="text-slate-400 text-sm col-span-3">Brak wyróżnionych projektów.</p>}
            </div>

            <div className="text-center mt-10">
              <Link to="/projekty" className="px-8 py-3 rounded bg-brand text-white font-bold text-sm hover:opacity-90 transition-opacity">Zobacz wszystkie projekty</Link>
            </div>
          </div>
        </section>


        <section id="klienci" className="py-20">
          <div className="max-w-5xl mx-auto px-6 mb-8">
            <Label>Klienci</Label>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-800">Zaufali nam</h2>
          </div>
          <div className="pb-10">
            <Carousel clients={clients} />
          </div>
        </section>


        <section id="kontakt" className="py-20 bg-dark">
          <div className="max-w-5xl mx-auto px-6">
            <Label>Kontakt</Label>
            <h2 className="mt-1 mb-10 text-3xl font-extrabold text-white">Napisz lub zadzwoń</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

              <div className="flex flex-col gap-5">
                {[
                  { icon: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.2 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>', label: 'Telefon', value: c('contact_phone'), href: `tel:${c('contact_phone').replace(/\s/g,'')}` },
                  { icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>', label: 'E-mail', value: c('contact_email'), href: `mailto:${c('contact_email')}` },
                ].map(item => (
                  <div key={item.label} className="flex gap-3 items-start">
                    <div className="w-10 h-10 min-w-[40px] rounded-lg bg-accent/20 grid place-items-center">
                      <svg className="w-4 h-4 fill-accent" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: item.icon }} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/30 mb-0.5">{item.label}</p>
                      <a href={item.href} className="text-white font-semibold hover:text-accent transition-colors">{item.value}</a>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 min-w-[40px] rounded-lg bg-accent/20 grid place-items-center">
                    <svg className="w-4 h-4 fill-accent" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30 mb-0.5">Adres</p>
                    <p className="text-white font-semibold whitespace-pre-line">{c('contact_address')}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 min-w-[40px] rounded-lg bg-accent/20 grid place-items-center">
                    <svg className="w-4 h-4 fill-accent" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30 mb-0.5">Godziny</p>
                    <p className="text-white font-semibold">{c('contact_hours')}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden h-80 md:h-full min-h-[320px]">
                <iframe
                  title="Lokalizacja Wenta"
                  src="https://maps.google.com/maps?width=425&height=350&hl=pl&q=Nysa%2C%20P.P.H.U.%20WENTA%20SP.%20C.+(P.P.H.U.%20WENTA%20SP.%20C.)&ie=UTF8&t=&z=13&iwloc=B&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px', overflow: 'hidden' }}
                />
              </div>

            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
