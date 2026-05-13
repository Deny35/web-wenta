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
    bg:    '/Spawacz.jpg',
    label: 'Od 1993 roku',
    title: 'Produkcja instalacji\ntechnologicznych',
    desc:  'Dla wygody naszych Klientów zajmujemy się dostawą, rozładunkiem oraz montażem na miejscu.',
    cta1:  { label: 'Sprawdź produkty', href: '#produkty' },
    cta2:  { label: 'Kontakt',          href: '/kontakt'  },
  },
  {
    bg:    '/Inzynier.jpg',
    label: 'Kompleksowo',
    title: 'Izolacje, projektowanie 3D,\nobróbka stali, relokacja maszyn',
    desc:  'Dedykowane rozwiązania technologiczne dopasowane do potrzeb Twojej firmy.',
    cta1:  { label: 'Nasze usługi', href: '/uslugi'  },
    cta2:  { label: 'Kontakt',      href: '/kontakt' },
  },
  {
    bg:    '/Instalacja.jpg',
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


function ImageAccordion({ items, label }) {
  const [openIdx, setOpenIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused]   = useState(false);
  const active = items[openIdx] || items[0];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setOpenIdx(i => (i + 1) % items.length);
        setVisible(true);
      }, 250);
    }, 3000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  function select(i) {
    if (i === openIdx) return;
    setPaused(true);
    setVisible(false);
    setTimeout(() => {
      setOpenIdx(i);
      setVisible(true);
    }, 250);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="bg-white divide-y divide-slate-100">
        <div className="px-6 py-4 bg-dark">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">{label}</span>
        </div>
        {items.map((item, i) => (
          <button
            key={item.title}
            onClick={() => select(i)}
            className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 group ${openIdx === i ? 'bg-accent/5 border-l-4 border-accent' : 'border-l-4 border-transparent hover:bg-slate-50'}`}
          >
            <div className="min-w-0">
              <div className={`font-bold text-sm ${openIdx === i ? 'text-accent' : 'text-slate-800'}`}>{item.title}</div>
              {openIdx === i && <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</div>}
            </div>
          </button>
        ))}
      </div>

      <div className="relative min-h-[320px] lg:min-h-0 bg-slate-900">
        <img
          src={active.img}
          alt={active.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}>
          <p className="text-white font-extrabold text-lg leading-snug">{active.title}</p>
          <p className="text-white/60 text-xs mt-1">{active.desc}</p>
        </div>
      </div>
    </div>
  );
}



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

  const [featured,          setFeatured]          = useState([]);
  const [clients,           setClients]           = useState([]);
  const [featuredProducts,  setFeaturedProducts]  = useState([]);
  const [productsExpanded,  setProductsExpanded]  = useState(false);
  const [homeServices,      setHomeServices]       = useState([]);
  const [productions,       setProductions]        = useState([]);

  useEffect(() => {
    api.projects.list().then(list => setFeatured(list.filter(p => p.featured).slice(0, 3)));
    api.clients.list().then(setClients);
    api.products.list().then(list => setFeaturedProducts(list.filter(p => p.featured)));
    api.services.list().then(setHomeServices);
    api.productions.list().then(setProductions);
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
            <ImageAccordion label="Co produkujemy" items={productions.map(p => ({ title: p.title, desc: p.desc, img: p.img, icon: p.icon }))} />
          </div>
        </section>


        <section id="uslugi" className="py-20 bg-dark">
          <div className="max-w-5xl mx-auto px-6">
            <Label>Usługi</Label>
            <h2 className="mt-1 mb-10 text-3xl font-extrabold text-white">Od projektu do serwisu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden">
              {homeServices.map(s => (
                <div
                  key={s.id}
                  className="relative overflow-hidden group cursor-default"
                  style={{ height: '280px' }}
                >
                  {s.img
                    ? <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                    : <div className="absolute inset-0 bg-slate-700" />
                  }
                  <div className="absolute inset-0 bg-dark/60 group-hover:bg-dark/30 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-white font-extrabold text-base leading-snug">{s.title}</h3>
                    <p className="text-white/0 group-hover:text-white/70 text-xs mt-1 leading-relaxed transition-all duration-500 max-h-0 group-hover:max-h-20 overflow-hidden">{s.short_desc}</p>
                  </div>
                </div>
              ))}
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


        {featuredProducts.length > 0 && (
          <section id="produkty-seryjne" className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                <div>
                  <Label>Oferta</Label>
                  <h2 className="mt-1 text-3xl font-extrabold text-slate-800">Produkty seryjne</h2>
                </div>
                <Link to="/produkty-seryjne" className="px-5 py-2.5 rounded border-2 border-accent text-accent font-bold text-sm hover:bg-accent hover:text-white transition-colors">
                  Pełny katalog →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(productsExpanded ? featuredProducts : featuredProducts.slice(0, 3)).map(p => (
                  <Link
                    key={p.id}
                    to={`/produkt/${p.id}`}
                    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                      {p.img
                        ? <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full bg-slate-200" />
                      }
                    </div>
                    <div className="p-5">
                      {p.category && (
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">{p.category}</span>
                      )}
                      <h3 className="mt-1 text-base font-extrabold text-slate-800 leading-snug group-hover:text-brand transition-colors">{p.title}</h3>
                      {p.short_desc && (
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">{p.short_desc}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {featuredProducts.length > 3 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setProductsExpanded(e => !e)}
                    className="px-8 py-3 rounded border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-brand hover:text-brand transition-colors"
                  >
                    {productsExpanded ? 'Zwiń ↑' : `Pokaż wszystkie (${featuredProducts.length}) ↓`}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}


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
