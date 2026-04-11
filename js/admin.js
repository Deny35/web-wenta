/* Admin panel – logika (Supabase) */

const PASSWORD = 'wenta2025'; // ← zmień na własne

/* ── DOM ── */
const loginScreen   = document.getElementById('login-screen');
const adminPanel    = document.getElementById('admin-panel');
const loginForm     = document.getElementById('login-form');
const loginError    = document.getElementById('login-error');
const successMsg    = document.getElementById('success-msg');
const projectList   = document.getElementById('project-list');

const editTabs      = document.getElementById('edit-tabs');
const tabBtns       = document.querySelectorAll('.tab-btn');
const sectionTile   = document.getElementById('section-tile');
const sectionDet    = document.getElementById('section-details');

const tileForm      = document.getElementById('tile-form');
const tileFormTitle = document.getElementById('tile-form-title');
const tileSubmit    = document.getElementById('tile-submit');
const tileCancel    = document.getElementById('tile-cancel');
const coverInput    = document.getElementById('proj-cover');
const coverPreview  = document.getElementById('cover-preview');

const detailsForm   = document.getElementById('details-form');
const descInput     = document.getElementById('proj-desc');
const galleryInput  = document.getElementById('proj-gallery');
const galleryPreview = document.getElementById('gallery-preview');

/* ── Stan ── */
let editingId   = null;
let coverData   = '';
let galleryData = [];

/* ── Logowanie ── */
function isLoggedIn() { return sessionStorage.getItem('wenta_auth') === '1'; }
function showPanel()  { loginScreen.hidden = true; adminPanel.hidden = false; refreshList(); }
function showLogin()  { adminPanel.hidden = true;  loginScreen.hidden = false; }

if (isLoggedIn()) showPanel();

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const pass = document.getElementById('pass').value;
  if (pass === PASSWORD) {
    sessionStorage.setItem('wenta_auth', '1');
    loginError.hidden = true;
    showPanel();
  } else {
    loginError.hidden = false;
    document.getElementById('pass').value = '';
  }
});

document.getElementById('btn-logout').addEventListener('click', function () {
  sessionStorage.removeItem('wenta_auth');
  showLogin();
});

/* ── Zakładki ── */
tabBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    showTab(btn.dataset.tab);
  });
});

function showTab(name) {
  tabBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.tab === name); });
  sectionTile.hidden = (name !== 'tile');
  sectionDet.hidden  = (name !== 'details');
}

/* ── Tryb: dodaj / edytuj ── */
function setModeAdd() {
  editingId = null;
  editTabs.hidden = true;
  sectionTile.hidden = false;
  sectionDet.hidden  = true;
  tileFormTitle.textContent = 'Dodaj projekt';
  tileSubmit.textContent    = 'Dodaj projekt';
  tileCancel.hidden = true;
  tileForm.reset();
  coverData = '';
  coverPreview.hidden = true;
  coverPreview.src = '';
  coverInput.value = '';
}

function setModeEdit(project) {
  editingId = project.id;
  editTabs.hidden = false;
  tileFormTitle.textContent = 'Edytuj kafelek';
  tileSubmit.textContent    = 'Zapisz kafelek';
  tileCancel.hidden = false;
  showTab('tile');

  document.getElementById('proj-title').value = project.title;
  document.getElementById('proj-cat').value   = project.category;
  document.getElementById('proj-year').value  = project.year;
  coverData = project.img || '';
  if (coverData) { coverPreview.src = coverData; coverPreview.hidden = false; }
  else           { coverPreview.hidden = true; coverPreview.src = ''; }

  descInput.value = project.opis || '';
  galleryData = Array.isArray(project.images) ? project.images.slice() : [];
  renderGalleryPreview();

  tileForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

tileCancel.addEventListener('click', setModeAdd);

/* ── Podgląd okładki ── */
coverInput.addEventListener('change', function () {
  const file = coverInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    coverData = e.target.result;
    coverPreview.src = coverData;
    coverPreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

/* ── Podgląd galerii ── */
function renderGalleryPreview() {
  galleryPreview.innerHTML = galleryData.map(function (src) {
    return '<img src="' + src + '" alt="">';
  }).join('');
}

galleryInput.addEventListener('change', function () {
  const files = Array.from(galleryInput.files);
  if (!files.length) return;
  galleryData = [];
  var loaded = 0;
  files.forEach(function (file, i) {
    const reader = new FileReader();
    reader.onload = function (e) {
      galleryData[i] = e.target.result;
      loaded++;
      if (loaded === files.length) renderGalleryPreview();
    };
    reader.readAsDataURL(file);
  });
});

/* ── Zapis kafelka ── */
tileForm.addEventListener('submit', function (e) {
  e.preventDefault();
  tileSubmit.disabled = true;
  tileSubmit.textContent = 'Zapisywanie...';

  const title    = document.getElementById('proj-title').value.trim();
  const category = document.getElementById('proj-cat').value.trim();
  const year     = document.getElementById('proj-year').value.trim();

  var promise;
  if (editingId) {
    const changes = { title: title, category: category, year: year };
    if (coverData) changes.img = coverData;
    promise = Projects.update(editingId, changes)
      .then(function () { showSuccess('Kafelek zaktualizowany!'); });
  } else {
    promise = Projects.add({
      title: title, category: category, year: year,
      img: coverData, images: [], opis: '', featured: false
    }).then(function () {
      showSuccess('Projekt dodany!');
      setModeAdd();
    });
  }

  promise.then(function () {
    tileSubmit.disabled = false;
    tileSubmit.textContent = editingId ? 'Zapisz kafelek' : 'Dodaj projekt';
    return refreshList();
  }).catch(function (err) {
    console.error(err);
    tileSubmit.disabled = false;
    tileSubmit.textContent = editingId ? 'Zapisz kafelek' : 'Dodaj projekt';
    alert('Błąd zapisu: ' + err.message);
  });
});

/* ── Zapis szczegółów ── */
detailsForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!editingId) return;

  const submitBtn = detailsForm.querySelector('button[type=submit]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Zapisywanie...';

  Projects.get().then(function (list) {
    const current = list.find(function (p) { return p.id === editingId; }) || {};
    const images = galleryData.length ? galleryData : (current.images || []);
    return Projects.update(editingId, { opis: descInput.value.trim(), images: images });
  }).then(function () {
    showSuccess('Szczegóły zaktualizowane!');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Zapisz szczegóły';
    return refreshList();
  }).catch(function (err) {
    console.error(err);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Zapisz szczegóły';
    alert('Błąd zapisu.');
  });
});

/* ── Lista projektów ── */
function refreshList() {
  projectList.innerHTML = '<p class="empty">Ładowanie...</p>';
  return Projects.get().then(function (list) {
    if (!list.length) {
      projectList.innerHTML = '<p class="empty">Brak projektów.</p>';
      return;
    }
    projectList.innerHTML = list.map(function (p) {
      return `
        <div class="admin-item">
          ${p.img ? `<img src="${p.img}" alt="">` : '<div class="admin-item-thumb"></div>'}
          <div class="admin-item-info">
            <strong>${p.title}</strong>
            <span>${p.category} · ${p.year}</span>
          </div>
          <label class="featured-label" title="Wyróżnij na stronie głównej (max 3)">
            <input type="checkbox" class="chk-featured" data-id="${p.id}" ${p.featured ? 'checked' : ''}> ⭐
          </label>
          <button class="btn-edit" data-id="${p.id}" title="Edytuj">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-delete" data-id="${p.id}" title="Usuń">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      `;
    }).join('');

    projectList.querySelectorAll('.btn-edit').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Projects.get().then(function (list) {
          const project = list.find(function (p) { return p.id === Number(btn.dataset.id); });
          if (project) setModeEdit(project);
        });
      });
    });

    projectList.querySelectorAll('.btn-delete').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Usunąć projekt?')) return;
        const id = Number(btn.dataset.id);
        if (editingId === id) setModeAdd();
        Projects.remove(id).then(refreshList);
      });
    });

    projectList.querySelectorAll('.chk-featured').forEach(function (chk) {
      chk.addEventListener('change', function () {
        Projects.toggleFeatured(Number(chk.dataset.id)).then(refreshList);
      });
    });
  });
}

/* ── Komunikat sukcesu ── */
function showSuccess(msg) {
  successMsg.textContent = msg;
  successMsg.hidden = false;
  setTimeout(function () { successMsg.hidden = true; }, 3000);
}

/* ── Init ── */
setModeAdd();
