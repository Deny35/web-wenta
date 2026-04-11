/* Projekty – Supabase backend */

const Projects = (function () {

  const SUPABASE_URL = 'https://TWOJ_ID.supabase.co';   // ← wklej Project URL
  const SUPABASE_KEY = 'TWOJ_ANON_KEY';                  // ← wklej anon key

  const BASE = SUPABASE_URL + '/rest/v1/projects';
  const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  /* ── CRUD ── */

  async function get() {
    try {
      const res = await fetch(BASE + '?order=id', { headers: HEADERS });
      return res.ok ? await res.json() : [];
    } catch (e) { return []; }
  }

  async function add(project) {
    project.id = Date.now();
    await fetch(BASE, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(project)
    });
  }

  async function update(id, changes) {
    await fetch(BASE + '?id=eq.' + id, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(changes)
    });
  }

  async function remove(id) {
    await fetch(BASE + '?id=eq.' + id, {
      method: 'DELETE',
      headers: HEADERS
    });
  }

  async function toggleFeatured(id) {
    const list = await get();
    const project = list.find(function (p) { return p.id === id; });
    if (!project) return;
    const featuredCount = list.filter(function (p) { return p.featured && p.id !== id; }).length;
    if (!project.featured && featuredCount >= 3) {
      alert('Możesz wyróżnić maksymalnie 3 projekty.');
      return;
    }
    await update(id, { featured: !project.featured });
  }

  /* ── Widoki ── */

  function cardHTML(p) {
    var thumb = p.img
      ? '<img src="' + p.img + '" alt="' + p.title + '" class="w-full aspect-video object-cover">'
      : '<div class="w-full aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center"><svg class="w-9 h-9 opacity-30 fill-slate-400" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
    return '<a href="realizacja.html#' + p.id + '" class="block bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-brand transition-all duration-200 no-underline">'
      + thumb
      + '<div class="p-4">'
      + '<span class="text-xs text-slate-400">' + p.category + ' · ' + p.year + '</span>'
      + '<h3 class="font-bold text-slate-800 text-sm mt-0.5">' + p.title + '</h3>'
      + '<span class="inline-block mt-2 text-xs font-bold text-brand">Zobacz szczegóły →</span>'
      + '</div></a>';
  }

  function loading(container) {
    container.innerHTML = '<p class="text-slate-400 text-sm col-span-3 py-6 text-center">Ładowanie...</p>';
  }

  async function render(container) {
    loading(container);
    const list = await get();
    container.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : '<p class="text-slate-400 text-sm">Brak projektów.</p>';
  }

  async function renderFeatured(container) {
    loading(container);
    const list = (await get()).filter(function (p) { return p.featured; }).slice(0, 3);
    container.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : '<p class="text-slate-400 text-sm">Brak wyróżnionych projektów. Dodaj je w panelu admina.</p>';
  }

  return { get, add, update, remove, toggleFeatured, render, renderFeatured };

}());

window.Projects = Projects;
