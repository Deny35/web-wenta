import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import AdminContent from './AdminContent';


function readFileAsDataURL(file) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.readAsDataURL(file);
  });
}


function LoginScreen({ onLogin }) {
  const [pass, setPass]   = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const { token } = await api.login(pass);
      sessionStorage.setItem('wenta_token', token);
      onLogin();
    } catch {
      setError('Nieprawidłowe hasło.');
      setPass('');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-xl p-10 w-full max-w-sm shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">Panel administracyjny</h2>
        <p className="text-sm text-slate-400 mb-6">Wenta – zarządzanie projektami</p>

        {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Hasło</label>
            <input
              type="password"
              required
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand"
              placeholder="••••••••"
              autoFocus
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


function SuccessMsg({ msg, onHide }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onHide, 3000);
    return () => clearTimeout(t);
  }, [msg, onHide]);

  if (!msg) return null;
  return (
    <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{msg}</div>
  );
}


function ProjectsSection({ showSuccess }) {
  const [projects, setProjects]       = useState([]);
  const [editingId, setEditingId]     = useState(null);
  const [tab, setTab]                 = useState('tile');

  const [title, setTitle]             = useState('');
  const [category, setCategory]       = useState('');
  const [year, setYear]               = useState('');
  const [coverData, setCoverData]     = useState('');

  const coverRef   = useRef();

  const [shortDesc, setShortDesc]     = useState('');
  const [opis, setOpis]               = useState('');
  const [galleryData, setGalleryData] = useState([]);

  const galleryRef = useRef();

  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const list = await api.projects.list();
    setProjects(list);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  function resetAdd() {
    setEditingId(null);
    setTab('tile');
    setTitle(''); setCategory(''); setYear('');
    setCoverData('');
    setShortDesc(''); setOpis(''); setGalleryData([]);
    if (coverRef.current)   coverRef.current.value   = '';
    if (galleryRef.current) galleryRef.current.value = '';
  }

  function startEdit(p) {
    setEditingId(p.id);
    setTab('tile');
    setTitle(p.title);
    setCategory(p.category);
    setYear(p.year);
    setCoverData(p.img || '');
    setShortDesc(p.short_desc || '');
    setOpis(p.opis || '');
    setGalleryData(Array.isArray(p.images) ? p.images.slice() : []);
  }

  async function handleCoverChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCoverData(await readFileAsDataURL(file));
  }

  async function handleGalleryChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const results = await Promise.all(files.map(readFileAsDataURL));
    setGalleryData(results);
  }

  async function saveTile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const changes = { title, category, year };
        if (coverData) changes.img = coverData;
        await api.projects.update(editingId, changes);
        showSuccess('Kafelek zaktualizowany!');
      } else {
        await api.projects.add({ title, category, year, img: coverData, images: [], opis: '', featured: false });
        showSuccess('Projekt dodany!');
        resetAdd();
      }
      await refresh();
    } catch (err) {
      alert('Błąd zapisu: ' + err.message);
    }
    setSaving(false);
  }

  async function saveDetails(e) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      const current = projects.find(p => p.id === editingId) || {};
      const images  = galleryData.length ? galleryData : (current.images || []);
      await api.projects.update(editingId, { short_desc: shortDesc, opis, images });
      showSuccess('Szczegóły zaktualizowane!');
      await refresh();
    } catch (err) {
      alert('Błąd zapisu: ' + err.message);
    }
    setSaving(false);
  }

  async function deleteProject(id) {
    if (!confirm('Usunąć projekt?')) return;
    if (editingId === id) resetAdd();
    await api.projects.remove(id);
    await refresh();
  }

  async function toggleFeatured(id) {
    const p = projects.find(x => x.id === id);
    await api.projects.update(id, { featured: !p.featured });
    await refresh();
  }

  const isEditing = Boolean(editingId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">

      <div className="bg-white border border-slate-200 rounded-xl p-6">

        {isEditing && (
          <div className="flex border-b-2 border-slate-100 mb-5 gap-0">
            {['tile', 'details'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-bold border-b-2 -mb-0.5 transition-colors ${
                  tab === t
                    ? 'text-brand border-brand'
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {t === 'tile' ? 'Kafelek' : 'Szczegóły'}
              </button>
            ))}
          </div>
        )}

        {(!isEditing || tab === 'tile') && (
          <form onSubmit={saveTile}>
            <h3 className="text-base font-bold text-slate-800 mb-4">
              {isEditing ? 'Edytuj kafelek' : 'Dodaj projekt'}
            </h3>

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

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Zdjęcie okładki</label>
              <input type="file" accept="image/*" ref={coverRef} onChange={handleCoverChange} className="text-sm text-slate-500" />
              {coverData && <img src={coverData} alt="" className="mt-2 w-full aspect-video object-cover rounded border border-slate-200" />}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-brand text-white font-bold rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving ? 'Zapisywanie…' : isEditing ? 'Zapisz kafelek' : 'Dodaj projekt'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetAdd}
                  className="px-4 py-2.5 border border-slate-200 rounded text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Anuluj
                </button>
              )}
            </div>
          </form>
        )}

        {isEditing && tab === 'details' && (
          <form onSubmit={saveDetails}>
            <h3 className="text-base font-bold text-slate-800 mb-4">Szczegóły realizacji</h3>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Krótki opis (kafelek)</label>
                <span className={`text-xs font-semibold ${shortDesc.length > 50 ? 'text-red-500' : 'text-slate-400'}`}>
                  {shortDesc.length}/50
                </span>
              </div>
              <input
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand"
                placeholder="Krótki opis widoczny na kafelku projektu…"
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Długi opis (strona realizacji)</label>
              <textarea
                value={opis}
                onChange={e => setOpis(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand resize-vertical"
                placeholder="Pełny opis wyświetlany na stronie realizacji…"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Zdjęcia galerii</label>
              <input type="file" accept="image/*" multiple ref={galleryRef} onChange={handleGalleryChange} className="text-sm text-slate-500" />
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

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Istniejące projekty</h3>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <img src="/Projekt bez nazwy-4.png" alt="Wenta" className="w-24 animate-pulse opacity-60" />
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Ładowanie…</p>
          </div>
        ) : !projects.length && <p className="text-sm text-slate-400">Brak projektów.</p>}

        <div className="flex flex-col gap-2">
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg">
              {p.img
                ? <img src={p.img} alt="" className="w-14 h-10 object-cover rounded flex-shrink-0" />
                : <div className="w-14 h-10 bg-slate-100 rounded flex-shrink-0" />
              }

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-800 truncate">{p.title}</div>
                <div className="text-xs text-slate-400">{p.category} · {p.year}</div>
              </div>

              <label className="flex items-center gap-1 text-sm text-slate-400 flex-shrink-0 cursor-pointer" title="Wyróżnij na stronie głównej">
                <input
                  type="checkbox"
                  checked={!!p.featured}
                  onChange={() => toggleFeatured(p.id)}
                  className="accent-brand"
                />⭐
              </label>

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


function ClientsSection({ showSuccess }) {
  const [clients, setClients] = useState([]);
  const [name, setName]       = useState('');
  const [logoData, setLogoData] = useState('');
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


export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(sessionStorage.getItem('wenta_token')));
  const [mainTab, setMainTab]   = useState('projects');
  const [success, setSuccess]   = useState('');

  function logout() {
    sessionStorage.removeItem('wenta_token');
    setLoggedIn(false);
  }

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-sm text-slate-600">

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

        <SuccessMsg msg={success} onHide={() => setSuccess('')} />

        {mainTab === 'projects' && <ProjectsSection showSuccess={setSuccess} />}
        {mainTab === 'clients'  && <ClientsSection  showSuccess={setSuccess} />}
        {mainTab === 'content'  && <AdminContent    showSuccess={setSuccess} />}
      </div>
    </div>
  );
}
