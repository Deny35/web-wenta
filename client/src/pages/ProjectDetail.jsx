import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    api.projects.list().then(list => {
      const found = list.find(p => String(p.id) === String(id));
      setProject(found || null);
      setLoading(false);
    });
  }, [id]);

  const allImages = project
    ? [
        ...(project.img ? [project.img] : []),
        ...(Array.isArray(project.images) ? project.images : [])
      ]
    : [];

  const prev = useCallback(() =>
    setLightboxIdx(i => (i - 1 + allImages.length) % allImages.length),
    [allImages.length]
  );
  const next = useCallback(() =>
    setLightboxIdx(i => (i + 1) % allImages.length),
    [allImages.length]
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e) {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setLightboxIdx(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, prev, next]);

  if (loading) return (
    <>
      <Header />
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Ładowanie…</p>
      </div>
    </>
  );

  if (!project) return (
    <>
      <Header />
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600 font-semibold">Nie znaleziono realizacji.</p>
        <Link to="/projekty" className="text-accent hover:underline">← Wróć do listy</Link>
      </div>
    </>
  );

  const galleryImages = Array.isArray(project.images) ? project.images : [];

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">

          <Link to="/projekty" className="text-accent hover:underline text-sm">← Wróć do projektów</Link>

          <div className="flex flex-wrap gap-2 text-xs mt-4 mb-2">
            <span className="px-2 py-0.5 bg-blue-50 text-accent rounded font-semibold">{project.category}</span>
            <span className="text-slate-400">{project.year}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 mb-6">{project.title}</h1>

          {project.img && (
            <img
              src={project.img}
              alt={project.title}
              className="w-full aspect-video object-cover rounded-xl mb-8 cursor-pointer"
              onClick={() => setLightboxIdx(0)}
            />
          )}

          {project.opis && (
            <div className="mb-10 text-slate-600 leading-relaxed whitespace-pre-wrap">{project.opis}</div>
          )}

          {galleryImages.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Galeria zdjęć</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Zdjęcie ${i + 1}`}
                    className="aspect-video object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxIdx(project.img ? i + 1 : i)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />

      {lightboxIdx !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          {/* tło – kliknięcie zamyka */}
          <div className="absolute inset-0" onClick={() => setLightboxIdx(null)} />

          {/* X */}
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* lewa strzałka */}
          {allImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* zdjęcie */}
          <img
            src={allImages[lightboxIdx]}
            alt=""
            className="relative max-w-full max-h-full rounded-lg object-contain z-10 pointer-events-none"
            style={{ maxHeight: '90vh' }}
          />

          {/* prawa strzałka */}
          {allImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* licznik */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm z-10">
              {lightboxIdx + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
