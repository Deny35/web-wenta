import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.projects.list().then(list => {
      setProjects(list);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header />

      <div className="pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-16">

          <span className="text-xs font-bold tracking-widest uppercase text-accent">Realizacje</span>
          <h1 className="mt-1 mb-10 text-3xl font-extrabold text-slate-800">Wszystkie projekty</h1>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="w-32 animate-pulse opacity-60" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Ładowanie…</p>
            </div>
          )}

          {!loading && !projects.length && (
            <p className="text-slate-400">Brak projektów.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <Link
                key={p.id}
                to={`/realizacja/${p.id}`}
                className="group relative block bg-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ aspectRatio: '16/9' }}
              >
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
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
