import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.products.list().then(list => {
      const found = list.find(p => String(p.id) === String(id));
      setProduct(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="w-32 animate-pulse opacity-60" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Ładowanie…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="text-slate-500 text-lg font-semibold">Produkt nie istnieje.</p>
          <Link to="/produkty-seryjne" className="text-brand font-bold hover:underline">← Wróć do katalogu</Link>
        </div>
        <Footer />
      </>
    );
  }

  const allImages = [
    ...(product.img ? [product.img] : []),
    ...(Array.isArray(product.images) ? product.images.filter(x => x && x !== product.img) : [])
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-0">

        <div className="bg-dark py-10">
          <div className="max-w-5xl mx-auto px-6">
            <Link to="/produkty-seryjne" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              ← Produkty seryjne
            </Link>
            {product.category && (
              <span className="ml-4 text-xs font-bold tracking-widest uppercase text-accent">{product.category}</span>
            )}
            <h1 className="mt-3 text-3xl font-extrabold text-white leading-tight">{product.title}</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-video">
                {allImages.length > 0
                  ? <img src={allImages[activeImg]} alt={product.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                }
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {allImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImg === i ? 'border-brand' : 'border-transparent'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1">
              {product.short_desc && (
                <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">{product.short_desc}</p>
              )}
              {product.opis && (
                <div className="prose prose-slate prose-sm max-w-none">
                  {product.opis.split('\n').map((line, i) =>
                    line.trim()
                      ? <p key={i} className="text-slate-600 leading-relaxed mb-3">{line}</p>
                      : <br key={i} />
                  )}
                </div>
              )}
              {!product.short_desc && !product.opis && (
                <p className="text-slate-400 italic">Brak opisu produktu.</p>
              )}

              {product.specs && product.specs.rows && product.specs.rows.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Specyfikacja techniczna</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      {product.specs.headers && (
                        <thead>
                          <tr>
                            {product.specs.headers.map((h, i) => (
                              <th key={i} className="py-2 px-3 text-left font-bold text-slate-700 bg-slate-100 border border-slate-200">{h}</th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {product.specs.rows.map((row, ri) => (
                          <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="py-2 px-3 text-slate-700 border border-slate-100">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100">
                <a
                  href="/kontakt"
                  className="inline-block px-6 py-3 bg-brand text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  Zapytaj o produkt →
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
