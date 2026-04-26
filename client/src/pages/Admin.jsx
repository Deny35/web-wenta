// useState  – przechowuje stan formularzy, dane z bazy, tryb edycji
// useEffect – pobiera dane przy pierwszym renderze
// useRef    – referencja do inputów pliku (żeby wyczyścić je po zapisie)
import { useState, useEffect, useRef } from 'react';

// Link – link "wróć na stronę" w topbarze
import { Link } from 'react-router-dom';

// Funkcje API do komunikacji z serwerem
import { api } from '../api';
import AdminContent from './AdminContent';


/* ── Funkcja pomocnicza ── */
// Odczytuje plik (zdjęcie) wybrany w input[type=file] i zwraca go jako base64 string
// Base64 to format tekstu który pozwala przechować obraz w bazie danych jako string
function readFileAsDataURL(file) {
  return new Promise(resolve => {
    const r = new FileReader();        // Wbudowany w przeglądarkę czytnik plików
    r.onload = e => resolve(e.target.result); // Po wczytaniu – resolve z base64 stringiem
    r.readAsDataURL(file);             // Zaczynamy czytanie pliku jako URL (data:image/jpeg;base64,...)
  });
}


/* ══ KOMPONENT: Ekran logowania ══ */
// onLogin – callback wywoływany po poprawnym zalogowaniu (zmienia stan w Admin)
function LoginScreen({ onLogin }) {
  const [pass, setPass]   = useState(''); // Wpisane hasło
  const [error, setError] = useState(''); // Komunikat błędu (puste = brak błędu)

  async function submit(e) {
    e.preventDefault(); // Blokujemy domyślne przeładowanie strony przy submit formularza
    try {
      // Wysyłamy hasło do serwera; jeśli poprawne – dostajemy token
      const { token } = await api.login(pass);
      // Zapisujemy token w sessionStorage – będzie dostępny tylko do zamknięcia karty
      sessionStorage.setItem('wenta_token', token);
      onLogin(); // Informujemy komponent Admin że zalogowano
    } catch {
      setError('Nieprawidłowe hasło.'); // Hasło złe – pokazujemy błąd
      setPass('');                      // Czyścimy pole hasła
    }
  }

  return (
    // Pełnoekranowy kontener wyśrodkowany pionowo i poziomo
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-10 w-full max-w-sm shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">Panel administracyjny</h2>
        <p className="text-sm text-slate-400 mb-6">Wenta – zarządzanie projektami</p>

        {/* Komunikat błędu – wyświetlany tylko gdy error nie jest pusty */}
        {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Hasło</label>
            <input
              type="password"
              required
              value={pass}
              onChange={e => setPass(e.target.value)} // Aktualizujemy stan przy każdym znaku
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand"
              placeholder="••••••••"
              autoFocus // Kursor automatycznie w tym polu
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-brand text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity">
            Zaloguj
          </button>
        </form>
      </div>
    </div>
  );
}


/* ══ KOMPONENT: Komunikat sukcesu ══ */
// msg    – tekst komunikatu (pusty = ukryty)
// onHide – callback wywoływany po 3 sekundach żeby ukryć komunikat
function SuccessMsg({ msg, onHide }) {
  useEffect(() => {
    if (!msg) return; // Jeśli brak komunikatu – nie rób nic
    const t = setTimeout(onHide, 3000); // Po 3 sekundach chowamy komunikat
    return () => clearTimeout(t);       // Cleanup – anulujemy timer jeśli komponent zniknie
  }, [msg, onHide]); // Uruchom ponownie gdy msg się zmieni

  if (!msg) return null; // Nic nie renderuj gdy brak komunikatu
  return (
    <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{msg}</div>
  );
}


/* ══ KOMPONENT: Sekcja projektów ══ */
// showSuccess – funkcja z komponentu Admin do wyświetlania komunikatu sukcesu
function ProjectsSection({ showSuccess }) {
  const [projects, setProjects]       = useState([]); // Lista wszystkich projektów
  const [editingId, setEditingId]     = useState(null); // id edytowanego projektu (null = tryb dodawania)
  const [tab, setTab]                 = useState('tile'); // Aktywna podzakładka: 'tile' lub 'details'

  // Pola formularza kafelka
  const [title, setTitle]             = useState('');
  const [category, setCategory]       = useState('');
  const [year, setYear]               = useState('');
  const [coverData, setCoverData]     = useState(''); // Base64 zdjęcia okładki

  // Ref do inputu pliku okładki – potrzebny żeby wyczyścić go po zapisie (input.value = '')
  const coverRef   = useRef();

  // Pola formularza szczegółów
  const [opis, setOpis]               = useState('');
  const [galleryData, setGalleryData] = useState([]); // Tablica base64 zdjęć galerii

  // Ref do inputu pliku galerii
  const galleryRef = useRef();

  // saving – true gdy trwa zapis do bazy (blokuje przycisk żeby nie kliknąć 2x)
  const [saving, setSaving] = useState(false);

  // Pobiera aktualną listę projektów z serwera i zapisuje w stanie
  async function refresh() {
    const list = await api.projects.list();
    setProjects(list);
  }

  // Pierwsze pobranie danych gdy komponent się pojawia
  useEffect(() => { refresh(); }, []);

  // Resetuje formularz do trybu "dodaj nowy projekt"
  function resetAdd() {
    setEditingId(null);      // Wychodzimy z trybu edycji
    setTab('tile');          // Wracamy do pierwszej zakładki
    setTitle(''); setCategory(''); setYear('');
    setCoverData('');
    setOpis(''); setGalleryData([]);
    // Czyścimy inputy pliku (inaczej poprzednie pliki nadal są "wybrane")
    if (coverRef.current)   coverRef.current.value   = '';
    if (galleryRef.current) galleryRef.current.value = '';
  }

  // Wypełnia formularz danymi projektu i przełącza do trybu edycji
  function startEdit(p) {
    setEditingId(p.id);                                              // Zapamiętujemy które id edytujemy
    setTab('tile');                                                  // Zaczynamy od zakładki Kafelek
    setTitle(p.title);
    setCategory(p.category);
    setYear(p.year);
    setCoverData(p.img || '');                                       // Wczytujemy istniejące zdjęcie
    setOpis(p.opis || '');
    setGalleryData(Array.isArray(p.images) ? p.images.slice() : []); // Kopiujemy tablicę galerii
  }

  // Obsługuje zmianę zdjęcia okładki – odczytuje plik i konwertuje na base64
  async function handleCoverChange(e) {
    const file = e.target.files[0]; // Bierzemy pierwszy wybrany plik
    if (!file) return;
    setCoverData(await readFileAsDataURL(file)); // Konwertujemy i zapisujemy w stanie
  }

  // Obsługuje zmianę zdjęć galerii – odczytuje wszystkie pliki jednocześnie (Promise.all)
  async function handleGalleryChange(e) {
    const files = Array.from(e.target.files); // FileList → zwykła tablica JS
    if (!files.length) return;
    // Promise.all – czekamy aż WSZYSTKIE pliki się wczytają, potem zapisujemy tablicę
    const results = await Promise.all(files.map(readFileAsDataURL));
    setGalleryData(results);
  }

  // Obsługuje zapis formularza kafelka (tytuł, branża, rok, okładka)
  async function saveTile(e) {
    e.preventDefault();
    setSaving(true); // Blokujemy przycisk
    try {
      if (editingId) {
        // EDYCJA – aktualizujemy tylko zmienione pola
        const changes = { title, category, year };
        if (coverData) changes.img = coverData; // Nadpisujemy zdjęcie tylko jeśli wybrano nowe
        await api.projects.update(editingId, changes);
        showSuccess('Kafelek zaktualizowany!');
      } else {
        // DODAWANIE – tworzymy nowy projekt z domyślnymi wartościami
        await api.projects.add({ title, category, year, img: coverData, images: [], opis: '', featured: false });
        showSuccess('Projekt dodany!');
        resetAdd(); // Po dodaniu wracamy do pustego formularza
      }
      await refresh(); // Odświeżamy listę projektów
    } catch (err) {
      alert('Błąd zapisu: ' + err.message); // Pokazujemy błąd z serwera
    }
    setSaving(false); // Odblokowujemy przycisk
  }

  // Obsługuje zapis formularza szczegółów (opis + galeria)
  async function saveDetails(e) {
    e.preventDefault();
    if (!editingId) return; // Zabezpieczenie – nie można zapisać szczegółów bez edytowanego projektu
    setSaving(true);
    try {
      const current = projects.find(p => p.id === editingId) || {};
      // Jeśli admin wybrał nowe zdjęcia – używamy ich; jeśli nie – zachowujemy stare
      const images  = galleryData.length ? galleryData : (current.images || []);
      await api.projects.update(editingId, { opis, images });
      showSuccess('Szczegóły zaktualizowane!');
      await refresh();
    } catch (err) {
      alert('Błąd zapisu: ' + err.message);
    }
    setSaving(false);
  }

  // Usuwa projekt po potwierdzeniu w oknie dialogowym
  async function deleteProject(id) {
    if (!confirm('Usunąć projekt?')) return; // Natywne okno confirm przeglądarki
    if (editingId === id) resetAdd();         // Jeśli usuwamy edytowany projekt – resetujemy formularz
    await api.projects.remove(id);
    await refresh();
  }

  // Przełącza flagę "wyróżniony" (gwiazdka) dla projektu
  async function toggleFeatured(id) {
    const p = projects.find(x => x.id === id);
    await api.projects.update(id, { featured: !p.featured }); // Odwracamy wartość boolean
    await refresh();
  }

  // isEditing – skrót: true gdy jesteśmy w trybie edycji
  const isEditing = Boolean(editingId);

  return (
    // Dwukolumnowy grid: formularz po lewej, lista projektów po prawej
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">

      {/* ── Lewa kolumna: formularz ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">

        {/* Podzakładki "Kafelek / Szczegóły" – widoczne TYLKO podczas edycji */}
        {isEditing && (
          <div className="flex border-b-2 border-slate-100 mb-5 gap-0">
            {['tile', 'details'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)} // Przełączamy aktywną zakładkę
                className={`px-4 py-2 text-sm font-bold border-b-2 -mb-0.5 transition-colors ${
                  tab === t
                    ? 'text-brand border-brand'           // Aktywna zakładka – niebieski podkreślnik
                    : 'text-slate-400 border-transparent hover:text-slate-600' // Nieaktywna
                }`}
              >
                {t === 'tile' ? 'Kafelek' : 'Szczegóły'}
              </button>
            ))}
          </div>
        )}

        {/* ── Formularz KAFELKA ── */}
        {/* Widoczny gdy: tryb dodawania LUB gdy tryb edycji i aktywna zakładka 'tile' */}
        {(!isEditing || tab === 'tile') && (
          <form onSubmit={saveTile}>
            <h3 className="text-base font-bold text-slate-800 mb-4">
              {isEditing ? 'Edytuj kafelek' : 'Dodaj projekt'}
            </h3>

            {/* Pole: Tytuł */}
            <div className="mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tytuł *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand"
                placeholder="np. Linia do przetwórstwa mleka"
              />
            </div>

            {/* Dwa pola obok siebie: Branża + Rok */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Branża *</label>
                <input
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand"
                  placeholder="np. Przemysł spożywczy"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Rok *</label>
                <input
                  required
                  type="number"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand"
                  placeholder="2024"
                  min="2000"
                  max="2099"
                />
              </div>
            </div>

            {/* Pole: Zdjęcie okładki */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Zdjęcie okładki</label>
              {/* ref – referencja do elementu DOM, potrzebna do czyszczenia wartości */}
              <input type="file" accept="image/*" ref={coverRef} onChange={handleCoverChange} className="text-sm text-slate-500" />
              {/* Podgląd okładki – wyświetlany tylko gdy coverData nie jest pusty */}
              {coverData && <img src={coverData} alt="" className="mt-2 w-full aspect-video object-cover rounded border border-slate-200" />}
            </div>

            {/* Przyciski: Zapisz + Anuluj (Anuluj tylko w trybie edycji) */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving} // Blokujemy podczas zapisu
                className="flex-1 px-4 py-2.5 bg-brand text-white font-bold rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving ? 'Zapisywanie…' : isEditing ? 'Zapisz kafelek' : 'Dodaj projekt'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetAdd} // Wracamy do trybu dodawania
                  className="px-4 py-2.5 border border-slate-200 rounded text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Anuluj
                </button>
              )}
            </div>
          </form>
        )}

        {/* ── Formularz SZCZEGÓŁÓW ── */}
        {/* Widoczny tylko gdy edytujemy projekt i aktywna zakładka 'details' */}
        {isEditing && tab === 'details' && (
          <form onSubmit={saveDetails}>
            <h3 className="text-base font-bold text-slate-800 mb-4">Szczegóły realizacji</h3>

            {/* Pole: Opis tekstowy */}
            <div className="mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Opis</label>
              <textarea
                value={opis}
                onChange={e => setOpis(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand resize-vertical"
                placeholder="Opis wyświetlany na stronie realizacji…"
              />
            </div>

            {/* Pole: Zdjęcia galerii – multiple pozwala wybrać kilka naraz */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Zdjęcia galerii</label>
              <input type="file" accept="image/*" multiple ref={galleryRef} onChange={handleGalleryChange} className="text-sm text-slate-500" />
              {/* Miniatury wybranych zdjęć */}
              {galleryData.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {galleryData.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-20 h-14 object-cover rounded border border-slate-200" />
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-1">Możesz wybrać kilka zdjęć. Zastąpią obecną galerię.</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2.5 bg-brand text-white font-bold rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? 'Zapisywanie…' : 'Zapisz szczegóły'}
            </button>
          </form>
        )}
      </div>

      {/* ── Prawa kolumna: lista istniejących projektów ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Istniejące projekty</h3>
        {!projects.length && <p className="text-sm text-slate-400">Brak projektów.</p>}

        <div className="flex flex-col gap-2">
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg">
              {/* Miniatura okładki lub szary placeholder */}
              {p.img
                ? <img src={p.img} alt="" className="w-14 h-10 object-cover rounded flex-shrink-0" />
                : <div className="w-14 h-10 bg-slate-100 rounded flex-shrink-0" />
              }

              {/* Informacje o projekcie */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-800 truncate">{p.title}</div>
                <div className="text-xs text-slate-400">{p.category} · {p.year}</div>
              </div>

              {/* Checkbox gwiazdki – oznacza projekt jako "wyróżniony" na stronie głównej */}
              <label className="flex items-center gap-1 text-sm text-slate-400 flex-shrink-0 cursor-pointer" title="Wyróżnij na stronie głównej">
                <input
                  type="checkbox"
                  checked={!!p.featured} // !! konwertuje na boolean (zabezpieczenie)
                  onChange={() => toggleFeatured(p.id)}
                  className="accent-brand" // Kolor checkboxa = kolor marki
                />⭐
              </label>

              {/* Przycisk edycji – niebieski ołówek */}
              <button
                onClick={() => startEdit(p)}
                className="w-8 h-8 flex-shrink-0 border border-blue-200 rounded grid place-items-center hover:bg-blue-50 transition-colors"
                title="Edytuj"
              >
                <svg className="w-3.5 h-3.5 stroke-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              {/* Przycisk usuwania – czerwony kosz */}
              <button
                onClick={() => deleteProject(p.id)}
                className="w-8 h-8 flex-shrink-0 border border-red-200 rounded grid place-items-center hover:bg-red-50 transition-colors"
                title="Usuń"
              >
                <svg className="w-3.5 h-3.5 stroke-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ══ KOMPONENT: Sekcja klientów ══ */
function ClientsSection({ showSuccess }) {
  const [clients, setClients] = useState([]); // Lista firm klientów
  const [name, setName]       = useState(''); // Wpisywana nazwa firmy
  const [logoData, setLogoData] = useState(''); // Base64 logo firmy
  const [saving, setSaving]   = useState(false);
  const logoRef               = useRef();

  async function refresh() {
    const list = await api.clients.list();
    setClients(list);
  }

  useEffect(() => { refresh(); }, []);

  async function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoData(await readFileAsDataURL(file));
  }

  async function addClient(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.clients.add(name.trim(), logoData);
      showSuccess('Firma dodana!');
      setName('');
      setLogoData('');
      if (logoRef.current) logoRef.current.value = '';
      await refresh();
    } catch (err) {
      alert('Błąd: ' + err.message);
    }
    setSaving(false);
  }

  async function removeClient(id) {
    if (!confirm('Usunąć firmę?')) return;
    await api.clients.remove(id);
    await refresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">

      {/* Formularz dodawania firmy */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Dodaj firmę</h3>
        <form onSubmit={addClient} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Nazwa firmy *</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand"
              placeholder="np. Nestlé"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Logo firmy</label>
            <input type="file" accept="image/*" ref={logoRef} onChange={handleLogoChange} className="text-sm text-slate-500" />
            {logoData && <img src={logoData} alt="" className="mt-2 h-14 object-contain rounded border border-slate-200 p-1" />}
          </div>
          <button type="submit" disabled={saving} className="px-4 py-2.5 bg-brand text-white font-bold rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
            {saving ? 'Dodawanie…' : 'Dodaj'}
          </button>
        </form>
      </div>

      {/* Lista firm z przyciskami usuwania */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Lista firm</h3>
        {!clients.length && <p className="text-sm text-slate-400">Brak firm.</p>}
        <div className="flex flex-col gap-2">
          {clients.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg">
              <div className="flex-1 font-semibold text-sm text-slate-800">{c.name}</div>
              <button
                onClick={() => removeClient(c.id)}
                className="w-8 h-8 flex-shrink-0 border border-red-200 rounded grid place-items-center hover:bg-red-50 transition-colors"
                title="Usuń"
              >
                <svg className="w-3.5 h-3.5 stroke-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ══ GŁÓWNY KOMPONENT: Strona admina ══ */
export default function Admin() {
  // Sprawdzamy przy starcie czy token jest już zapisany w sessionStorage
  // Jeśli tak – od razu pokazujemy panel (bez konieczności logowania po odświeżeniu)
  const [loggedIn, setLoggedIn] = useState(() => Boolean(sessionStorage.getItem('wenta_token')));

  // mainTab – aktywna główna zakładka: 'projects' lub 'clients'
  const [mainTab, setMainTab]   = useState('projects');

  // success – tekst komunikatu sukcesu (pusty = brak komunikatu)
  const [success, setSuccess]   = useState('');

  // Wylogowanie – usuwamy token i pokazujemy ekran logowania
  function logout() {
    sessionStorage.removeItem('wenta_token');
    setLoggedIn(false);
  }

  // Jeśli nie zalogowany – pokazujemy tylko ekran logowania
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  // Panel admina – widoczny po zalogowaniu
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-sm text-slate-600">

      {/* Topbar – ciemny pasek na górze z logo, linkiem do strony i przyciskiem wylogowania */}
      <div className="bg-dark text-white px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="h-9 w-auto" />
          <span className="text-white/30 font-normal text-base">/ Admin</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-white/50 hover:text-white transition-colors">← Wróć na stronę</Link>
          <button onClick={logout} className="px-3 py-1.5 rounded border border-white/20 text-white/70 hover:bg-white/10 transition-colors text-xs font-semibold">
            Wyloguj
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Główne zakładki: Projekty / Klienci */}
        <div className="flex border-b-2 border-slate-200 mb-6 gap-0">
          {[['projects','Projekty'], ['clients','Klienci'], ['content','Treść strony']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={`px-5 py-2.5 text-sm font-bold border-b-2 -mb-0.5 transition-colors ${
                mainTab === t
                  ? 'text-brand border-brand'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Komunikat sukcesu – pojawia się po zapisie i znika po 3 sekundach */}
        <SuccessMsg msg={success} onHide={() => setSuccess('')} />

        {/* Renderujemy aktywną sekcję – tylko jedną naraz */}
        {mainTab === 'projects' && <ProjectsSection showSuccess={setSuccess} />}
        {mainTab === 'clients'  && <ClientsSection  showSuccess={setSuccess} />}
        {mainTab === 'content'  && <AdminContent    showSuccess={setSuccess} />}
      </div>
    </div>
  );
}
