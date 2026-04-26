// useState  – przechowuje dane projektu, stan ładowania i aktywne zdjęcie w lightboxie
// useEffect – pobiera dane gdy zmienia się id w URL
import { useState, useEffect } from 'react';

// useParams  – odczytuje dynamiczny parametr :id z URL (np. /realizacja/42 → id="42")
// Link       – link "wróć do projektów"
import { useParams, Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';

export default function ProjectDetail() {
  // id – pobieramy z URL np. /realizacja/42 daje id="42"
  const { id } = useParams();

  // project – dane projektu z bazy; null = nie znaleziono lub jeszcze się ładuje
  const [project, setProject] = useState(null);

  // loading – true podczas pobierania danych z API
  const [loading, setLoading] = useState(true);

  // lightbox – URL zdjęcia które aktualnie powiększamy (null = lightbox zamknięty)
  const [lightbox, setLightbox] = useState(null);

  // Pobieramy projekt gdy komponent się załaduje lub gdy zmieni się id w URL
  useEffect(() => {
    api.projects.list().then(list => {
      // Szukamy projektu którego id (liczba lub string) pasuje do parametru z URL
      const found = list.find(p => String(p.id) === String(id));
      setProject(found || null); // null jeśli nie znaleziono
      setLoading(false);
    });
  }, [id]); // [id] – uruchom ponownie gdy id się zmieni (np. cofnięcie/przejście)

  // Wyświetlamy spinner ładowania zanim dane przyjdą z serwera
  if (loading) return (
    <>
      <Header />
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Ładowanie…</p>
      </div>
    </>
  );

  // Projekt nie istnieje w bazie – komunikat błędu z linkiem powrotu
  if (!project) return (
    <>
      <Header />
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600 font-semibold">Nie znaleziono realizacji.</p>
        <Link to="/projekty" className="text-brand hover:underline">← Wróć do listy</Link>
      </div>
    </>
  );

  // images – tablica zdjęć galerii; zabezpieczamy się gdyby nie była tablicą
  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <>
      <Header />
      <div className="pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* Link powrotu do listy projektów */}
          <Link to="/projekty" className="text-brand hover:underline text-sm">← Wróć do projektów</Link>

          {/* Branża i rok – małe tagi pod linkiem powrotu */}
          <div className="flex flex-wrap gap-2 text-xs mt-4 mb-2">
            <span className="px-2 py-0.5 bg-blue-50 text-brand rounded font-semibold">{project.category}</span>
            <span className="text-slate-400">{project.year}</span>
          </div>

          {/* Tytuł projektu */}
          <h1 className="text-3xl font-extrabold text-slate-800 mb-6">{project.title}</h1>

          {/* Zdjęcie okładki – kliknięcie otwiera lightbox */}
          {project.img && (
            <img
              src={project.img}
              alt={project.title}
              className="w-full aspect-video object-cover rounded-xl mb-8 cursor-pointer"
              onClick={() => setLightbox(project.img)} // Zapisujemy URL do lightbox state
            />
          )}

          {/* Opis tekstowy – whitespace-pre-wrap zachowuje Enter/nowe linie z textarea admina */}
          {project.opis && (
            <div className="mb-10 text-slate-600 leading-relaxed whitespace-pre-wrap">{project.opis}</div>
          )}

          {/* Galeria zdjęć – wyświetlana tylko jeśli admin dodał zdjęcia */}
          {images.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Galeria zdjęć</h2>
              {/* Siatka miniatur – 2 kolumny na mobile, 3 na tablecie */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Zdjęcie ${i + 1}`}
                    className="aspect-video object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightbox(src)} // Kliknięcie otwiera powiększone zdjęcie
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />

      {/* Lightbox – ciemne tło z powiększonym zdjęciem; kliknięcie w tło zamyka */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)} // Kliknięcie gdziekolwiek zamyka lightbox
        >
          {/* max-w-full max-h-full – zdjęcie nie wyjdzie poza ekran */}
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </>
  );
}
