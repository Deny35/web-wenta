// useState  – przechowuje listę projektów i stan ładowania
// useEffect – pobiera projekty z API przy pierwszym renderze komponentu
import { useState, useEffect } from 'react';

// Link – klikalny kafelek kierujący do strony szczegółów realizacji
import { Link } from 'react-router-dom';

// Wspólne komponenty layoutu
import Header from '../components/Header';
import Footer from '../components/Footer';

// Funkcje do komunikacji z serwerem Node.js
import { api } from '../api';

export default function Projects() {
  // projects – tablica wszystkich projektów z bazy danych; zaczyna jako pusta []
  const [projects, setProjects] = useState([]);

  // loading – true podczas pobierania danych; używamy do wyświetlania "Ładowanie…"
  const [loading, setLoading]   = useState(true);

  // useEffect z pustą tablicą [] – wykona się tylko raz, gdy komponent się pojawi na stronie
  useEffect(() => {
    // Pobieramy projekty z API i zapisujemy je w stanie
    api.projects.list().then(list => {
      setProjects(list); // Zapisujemy tablicę projektów
      setLoading(false); // Wyłączamy wskaźnik ładowania
    });
  }, []); // [] – pusta tablica zależności = uruchom tylko raz

  return (
    <>
      {/* Header przyklejony do góry – wspólny dla wszystkich stron */}
      <Header />

      {/* pt-16 – padding-top żeby treść nie chowała się pod fixedowym headerem */}
      <div className="pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-16">

          {/* Etykieta sekcji */}
          <span className="text-xs font-bold tracking-widest uppercase text-brand">Realizacje</span>
          <h1 className="mt-1 mb-10 text-3xl font-extrabold text-slate-800">Wszystkie projekty</h1>

          {/* Pokazujemy "Ładowanie…" dopóki dane nie są gotowe */}
          {loading && <p className="text-slate-400">Ładowanie…</p>}

          {/* Gdy załadowane i lista pusta – informujemy użytkownika */}
          {!loading && !projects.length && (
            <p className="text-slate-400">Brak projektów.</p>
          )}

          {/* Siatka kafelków projektów – 1 kolumna na mobile, 2 na tablecie, 3 na desktopie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              // Każdy kafelek to klikalny Link do /realizacja/:id
              // key={p.id} – wymagane przez React gdy renderujemy listę elementów
              <Link
                key={p.id}
                to={`/realizacja/${p.id}`}
                className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Zdjęcie okładki w proporcji 16:9 */}
                <div className="aspect-video overflow-hidden bg-slate-100">
                  {p.img
                    // Jeśli projekt ma zdjęcie – wyświetlamy je; group-hover skaluje przy najechaniu
                    ? <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    // Brak zdjęcia – szary placeholder
                    : <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm">Brak zdjęcia</div>
                  }
                </div>

                {/* Informacje tekstowe pod zdjęciem */}
                <div className="p-4">
                  {/* Branża i rok jako małe "tagi" */}
                  <div className="flex gap-2 text-xs text-slate-400 mb-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-brand rounded font-semibold">{p.category}</span>
                    <span>{p.year}</span>
                  </div>
                  {/* Tytuł projektu */}
                  <h3 className="font-bold text-slate-800 text-sm">{p.title}</h3>
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
