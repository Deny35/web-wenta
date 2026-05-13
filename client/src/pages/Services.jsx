import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.services.list().then(list => {
      setServices(list);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen">

        <div className="bg-dark py-20">
          <div className="max-w-5xl mx-auto px-6">
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Co oferujemy</span>
            <h1 className="mt-2 text-4xl font-extrabold text-white">Nasze usługi</h1>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              Realizujemy projekty kompleksowo – od koncepcji, przez produkcję, po montaż i serwis. Każdy etap wykonujemy samodzielnie we własnym zakładzie.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16">

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="w-32 animate-pulse opacity-60" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Ładowanie…</p>
            </div>
          )}

          {!loading && (
            <div className="space-y-0 divide-y divide-slate-100">
              {services.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 md:gap-12 items-stretch py-14`}
                >
                  <div className="w-full md:w-2/5 flex-shrink-0">
                    <div className="rounded-2xl overflow-hidden h-64 md:h-full min-h-52 bg-slate-100">
                      {s.img
                        ? <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-slate-200" />
                      }
                    </div>
                  </div>

                  <div className="flex flex-col justify-center flex-1 pt-6 md:pt-0">
                    <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">{s.title}</h2>
                    {s.opis && (
                      <p className="mt-4 text-slate-600 leading-relaxed text-sm">{s.opis}</p>
                    )}
                    {!s.opis && s.short_desc && (
                      <p className="mt-4 text-slate-600 leading-relaxed text-sm">{s.short_desc}</p>
                    )}
                    {Array.isArray(s.tags) && s.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {s.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {!services.length && (
                <p className="text-slate-400 text-sm py-8">Brak usług.</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-dark py-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Potrzebujesz wyceny?</h3>
              <p className="text-white/50 mt-1 text-sm">Skontaktuj się z nami – odpowiemy w ciągu 24 godzin.</p>
            </div>
            <a href="/kontakt" className="flex-shrink-0 px-8 py-3 rounded-lg bg-brand text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Kontakt →
            </a>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
