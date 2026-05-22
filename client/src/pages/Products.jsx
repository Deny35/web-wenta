import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('Wszystkie');

  useEffect(() => {
    api.products.list().then(list => {
      setProducts(list);
      setLoading(false);
    });
  }, []);

  const categories = ['Wszystkie', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const visible = filter === 'Wszystkie' ? products : products.filter(p => p.category === filter);

  return (
    <>
      <Header />
      <div className="min-h-screen">

        <div className="bg-dark py-20">
          <div className="max-w-5xl mx-auto px-6">
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Oferta</span>
            <h1 className="mt-2 text-4xl font-extrabold text-white">Produkty seryjne</h1>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              Standardowe produkty ze stali nierdzewnej dostępne z naszego zakładu – gotowe do zamówienia lub modyfikacji pod konkretne wymagania.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="w-32 animate-pulse opacity-60" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Ładowanie…</p>
            </div>
          )}

          {!loading && (
            <>
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        filter === cat
                          ? 'bg-brand text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {!visible.length && (
                <p className="text-slate-400 text-sm">Brak produktów.</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map(p => (
                  <Link
                    key={p.id}
                    to={`/produkt/${p.id}`}
                    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                      {p.img
                        ? <img src={p.img} alt={p.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                      }
                    </div>

                    <div className="p-5">
                      {p.category && (
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">{p.category}</span>
                      )}
                      <h2 className="mt-1 text-base font-extrabold text-slate-800 leading-snug group-hover:text-brand transition-colors">{p.title}</h2>
<span className="mt-4 inline-block text-xs font-bold text-accent uppercase tracking-wider">
                        Szczegóły →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-dark py-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Potrzebujesz niestandardowego rozwiązania?</h3>
              <p className="text-white/50 mt-1 text-sm">Skontaktuj się – dostosujemy produkt do Twoich wymagań.</p>
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
